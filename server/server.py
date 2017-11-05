from flask import Flask, request, g
from werkzeug.utils import secure_filename
from json import dumps, loads
from flask_cors import CORS, cross_origin
import os
from jinja2 import Environment, FileSystemLoader
from time import time

from lib.slicer import slice
from lib.stl_tools import analyzeSTL
from lib.utils import getProjectPath, getPath, addUniqueIdToFile, loadYaml, loadFromFile, removeValueFromDict
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
  result, err = slice(PATH, fileName)
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
  sliceResult = data['sliceResult']
  filament = data['filament']
  return dumps({'price': price(sliceResult['printTime'], sliceResult['filament'], FILAMENTS[filament])})


@app.route('/filaments', methods=['POST'])
def getFilaments():
  response = {
    'filaments': removeValueFromDict(loadYaml(CONFIG['filaments-config'], PATH), 'price')
  }
  return dumps(response)


@app.route('/order', methods=['POST'])
def order():
  data = loads(request.form['data'])
  fileDb = File.query.filter_by(id=data['fileId']).first()
  selectedFilament = FILAMENTS[data['filament']]
  orderPrice = price(fileDb.printTime, fileDb.filamentUsed, selectedFilament)*data['amount']
  orderDb = Order(data['email'], orderPrice)
  dbSession.add(orderDb)
  dbSession.commit()
  orderId = orderDb.id

  @execute
  def sendMail():
    fileDb = File.query.filter_by(id=data['fileId']).first()
    orderDb = Order.query.filter_by(id=orderId).first()

    email = Email(EMAIL_CONFIG['server'], EMAIL_CONFIG['port'], EMAIL_CONFIG['email'], EMAIL_CONFIG['password'])

    try:
      template = env.get_template('client.jinja2')
      content = template.render(
        fileName=data['fileName'],
        filament=FILAMENTS[data['filament']],
        amount=data['amount'],
        price=orderPrice,
        orderId=orderId)
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
        fileName=data['fileName'],
        filament=FILAMENTS[data['filament']],
        amount=data['amount'],
        price=orderPrice,
        orderId=orderId)
      messageForCompany = email.createMessage(
        EMAIL_CONFIG['email'],
        EMAIL_CONFIG['order-to'],
        '3D továrna - objednávka č. S{orderId}'.format(orderId=orderId),
        content,
        loadFromFile(os.path.join(PATH, CONFIG['stl-upload-directory'], fileDb.fileName), bytes=True),
        fileDb.name)
      email.send(messageForCompany)
      orderDb.emailSentToCompany = True
      dbSession.commit()
    except Exception as e:
      pass

  return dumps({'message': 'new order was created'})

@app.teardown_appcontext
def shutdownSession(exception=None):
    dbSession.remove()

if __name__ == '__main__':
  app.run('0.0.0.0', 8040, threaded=True)
