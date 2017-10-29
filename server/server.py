from flask import Flask, request, g
from werkzeug.utils import secure_filename
from json import dumps, loads
from flask_cors import CORS, cross_origin
import os
from jinja2 import Environment, FileSystemLoader
from lib.slicer import slice
from lib.utils import getPath, addUniqueIdToFile, loadYaml, loadFromFile, removeValueFromDict
from lib.pricing import price
from lib.email_util import Email
from lib.background_task import execute

app = Flask(__name__)
app.debug = True
CORS(app)

PATH = getPath(__file__)
config = loadYaml('../config.yml')
emailConfig = loadYaml(config['email-config'], PATH)
filaments = loadYaml(config['filaments-config'], PATH)
env = Environment(loader=FileSystemLoader('../email/'))


@app.route('/upload', methods=['POST'])
def uploadFile():
  file = request.files['file']
  fileName = addUniqueIdToFile(secure_filename(file.filename))
  file.save(os.path.join(PATH,config['stl-upload-directory'], fileName))
  return dumps({
    'fileName': fileName,
  })


@app.route('/slice', methods=['POST'])
def sliceFile():
  data = loads(request.form['data'])
  result, err = slice(PATH, data['fileName'])
  if not err:
    result['price'] = price(result['printTime'], result['filament'], filaments[data['filament']])
    return dumps(result)
  else:
    return dumps({ 'error': err })


@app.route('/pricing', methods=['POST'])
def getPrice():
  data = loads(request.form['data'])
  sliceResult = data['sliceResult']
  filament = data['filament']
  return dumps({'price': price(sliceResult['printTime'], sliceResult['filament'], filaments[filament])})


@app.route('/filaments', methods=['POST'])
def getFilaments():
  response = {
    'filaments': removeValueFromDict(loadYaml(config['filaments-config'], PATH), 'price')
  }
  return dumps(response)


@app.route('/order', methods=['POST'])
def order():
  data = loads(request.form['data'])
  @execute
  def sendMail():
    email = Email(emailConfig['server'], emailConfig['port'], emailConfig['email'], emailConfig['password'])
    template = env.get_template('client.jinja2')
    content = template.render()
    messageForClient = email.createMessage(
      emailConfig['email'],
      data['email'],
      '3D print shop order',
      content)
    email.send(messageForClient)

    template = env.get_template('company.jinja2')
    content = template.render(filament=data['filament'], email=data['email'])
    messageForCompany = email.createMessage(
      emailConfig['email'],
      emailConfig['order-to'],
      'new order',
      content,
      loadFromFile(os.path.join(PATH, config['stl-upload-directory'], data['fileName']), bytes=True),
      data['fileName'])
    email.send(messageForCompany)

  return dumps({'message': 'new order was created'})

if __name__ == '__main__':
  app.run('0.0.0.0', 8040, threaded=True)
