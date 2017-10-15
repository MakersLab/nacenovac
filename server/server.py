from flask import Flask, request
from werkzeug.utils import secure_filename
from lib.slicer import slice
from json import dumps, loads
from lib.utils import getPath, addUniqueIdToFile, loadYaml
from lib.pricing import price
from flask_cors import CORS, cross_origin
import os

app = Flask(__name__)
app.debug = True
CORS(app)

PATH = getPath(__file__)
config = loadYaml('../config.yml')

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

if __name__ == '__main__':
  app.run('0.0.0.0', 8040)

