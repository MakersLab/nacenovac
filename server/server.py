from flask import Flask, request, g
from werkzeug.utils import secure_filename
from json import dumps, loads
from flask_cors import CORS, cross_origin
import os
from jinja2 import Environment, FileSystemLoader

from lib.slicer import slice
from lib.utils import getPath, addUniqueIdToFile, loadYaml, loadFromFile
from lib.pricing import price
from lib.email_util import Email

app = Flask(__name__)
app.debug = True
CORS(app)

PATH = getPath(__file__)
config = loadYaml('../config.yml')
emailConfig = loadYaml(config['email-config'], PATH)
email = Email(emailConfig['server'], emailConfig['port'], emailConfig['email'], emailConfig['password'])

env = Environment(loader=FileSystemLoader('../email/'))

@app.route('/upload', methods=['POST'])
def uploadFile():
  file = request.files['file']
  fileName = addUniqueIdToFile(secure_filename(file.filename))
  file.save(os.path.join(PATH,config['stl-upload-directory'], fileName))
  return dumps({
    'fileName': fileName,
  })

@app.route('/pricing', methods=['POST'])
def priceFile():
  data = loads(request.form['data'])
  result, err = slice(PATH, data['fileName'])
  if not err:
    result['price'] = price(result['printTime'], result['filament'])
    return dumps(result)
  else:
    return dumps({ 'error': err })

@app.route('/filaments', methods=['POST'])
def filaments():
  response = {
    'filaments': loadYaml(config['filaments-config'], PATH)
  }
  return dumps(response)

@app.route('/order', methods=['POST'])
def order():
  print(request.form['data'])
  requestData = loads(request.form['data'])

  @callAfterRequest
  def sendMail():
    template = env.get_template('client.jinja2')
    content = template.render(price=48)
    messageForClient = email.createMessage(
      emailConfig['email'],
      requestData['email'],
      '3D print shop order',
      content)
    email.send(messageForClient)

    template = env.get_template('company.jinja2')
    content = template.render(filament='the blue one...plastic', price=48)
    messageForCompany = email.createMessage(
      emailConfig['email'],
      emailConfig['order-to'],
      'new order',
      content,
      loadFromFile(os.path.join(PATH,config['stl-upload-directory'], requestData['fileName']), bytes=True),
      requestData['fileName'])
    email.send(messageForCompany)

  return dumps({'message': 'new order was created'})

def callAfterRequest(func):
    if not hasattr(g, 'call_after_response'):
        g.call_after_response = []
    g.call_after_response.append(func)
    return func


@app.teardown_request
def tearDownRequest(k):
  for func in getattr(g, 'call_after_response', ()):
      func()

if __name__ == '__main__':
  app.run('0.0.0.0', 8040)

