from flask import Flask, request, g
from werkzeug.utils import secure_filename
from json import dumps, loads
from flask_cors import CORS, cross_origin
import os
from jinja2 import Environment, FileSystemLoader
from time import time

from lib.slicer import slice
from lib.stl_tools import analyzeSTL
from lib.utils import getPath, addUniqueIdToFile, loadYaml, loadFromFile, removeValueFromDict
from lib.pricing import price
from lib.email_util import Email
from lib.background_task import execute
from lib.database import dbSession, init_db
from config import CONFIG, EMAIL_CONFIG, FILAMENTS, PATH

from models.files import File
from models.orders import Order

app = Flask(__name__)
app.debug = True
CORS(app)

init_db()

env = Environment(loader=FileSystemLoader('../email/'))

@app.route('/upload', methods=['POST'])
def uploadFile():
  file = request.files['file']
  fileName = addUniqueIdToFile(secure_filename(file.filename))
  file.save(os.path.join(PATH, CONFIG['stl-upload-directory'], fileName))
  fileDb = File(file.filename, fileName)
  dbSession.add(fileDb)
  dbSession.commit()
  return dumps({
    'fileId': fileDb.id,
  })


@app.route('/slice', methods=['POST'])
def sliceFile():
  data = loads(request.form['data'])
  fileDb = File.query.filter_by(id=data['fileId']).first()
  fileName = fileDb.fileName
  result, err = slice(fileName)
  if not err:
    result['price'] = price(result['printTime'], result['filament'], FILAMENTS[data['filament']])
    result['dimensions'] = analyzeSTL(PATH, fileName)
    fileDb.update(result['printTime'], result['filament'], result['dimensions'])
    dbSession.commit()
    return dumps(result)
  else:
    return dumps({ 'error': err })


@app.route('/pricing', methods=['POST'])
def getPrice():
  data = loads(request.form['data'])
  fileDb = File.query.filter_by(id=data['fileId']).first()
  filament = data['filament']
  return dumps({'price': price(fileDb.printTime, fileDb.filamentUsed, FILAMENTS[filament])})


@app.route('/filaments', methods=['POST'])
def getFilaments():
  response = {
    'filaments': removeValueFromDict(loadYaml(CONFIG['filaments-config']), 'price')
  }
  return dumps(response)


@app.route('/order', methods=['POST'])
def order():
  data = loads(request.form['data'])
  files = data['files']
  filesDb = []

  orderDb = Order(data['email'], delivery=data['delivery'], details=data['delivery'])
  orderPrice = 0
  for file in files:
    fileDb = File.query.filter_by(id=file['id']).first()
    orderDb.files.append(fileDb)
    fileDb.filament = file['filament']
    fileDb.amount = file['amount']
    filesDb.append(fileDb)
    filament = FILAMENTS[file['filament']]
    individualPrice = price(fileDb.printTime, fileDb.filamentUsed, filament)*file['amount']
    orderPrice += individualPrice
    file['color'] = filament['color-name']
    file['material'] = filament['material']
    file['price'] = round(individualPrice,2)
    file['name'] = fileDb.name
    file['content'] = loadFromFile(os.path.join(CONFIG['stl-upload-directory'], fileDb.fileName), bytes=True)
  if data['delivery'] == 'express':
    orderPrice = orderPrice*1.3

  orderDb.price = orderPrice
  dbSession.add(orderDb)
  dbSession.commit()
  orderId = orderDb.id

  @execute
  def sendMail():
    filesDb = []
    for file in files:
      fileDb = File.query.filter_by(id=file['id']).first()
      filesDb.append(fileDb)

    orderDb = Order.query.filter_by(id=orderId).first()

    email = Email(EMAIL_CONFIG['server'], EMAIL_CONFIG['port'], EMAIL_CONFIG['email'], EMAIL_CONFIG['password'])

    try:
      template = env.get_template('client.jinja2')
      content = template.render(
        files=files,
        price=orderPrice,
        orderId=orderId,
        delivery=data['delivery'])
      messageForClient = email.createMessage(
        EMAIL_CONFIG['email'],
        data['email'],
        '3D továrna - objednávka č. S{orderId}'.format(orderId=orderId),
        content)
      email.send(messageForClient)
      orderDb.emailSentToClient = True
      dbSession.commit()
    except Exception as e:
      pass

    try:
      template = env.get_template('company.jinja2')
      content = template.render(
        files=files,
        price=orderPrice,
        orderId=orderId,
        email=data['email'],
        delivery = data['delivery'])
      messageForCompany = email.createMessage(
        EMAIL_CONFIG['email'],
        EMAIL_CONFIG['order-to'],
        '3D továrna - objednávka č. S{orderId}'.format(orderId=orderId),
        content,
        files,
        )
      email.send(messageForCompany)
      orderDb.emailSentToCompany = True
      dbSession.commit()
    except Exception as e:
      pass

  return dumps({'message': 'new order was created', 'successful': True})

@app.teardown_appcontext
def shutdownSession(exception=None):
    dbSession.remove()

if __name__ == '__main__':
  app.run('0.0.0.0', 8040, threaded=True)
