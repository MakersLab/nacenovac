import yaml
import json
import os
import uuid

def loadFromFile(file_name):
    fileContents = ''
    path = '/'.join(os.path.dirname(__file__).split('/')[0:-1])
    with open((os.path.join(path,file_name)), 'r') as file:
        fileContents = file.read()
        file.close()
    return fileContents

def loadYaml(file_name):
    return yaml.load(loadFromFile(file_name))

def loadJson(file_name):
    return json.loads(loadFromFile(file_name))

def writeFile(file_name, content):
    path = '/'.join(os.path.dirname(__file__).split('/')[0:-1])
    with open((os.path.join(path,file_name)), 'w') as file:
        file.write(content)
        file.close()

def getPath(file):
  print(file)
  return '/'.join(os.path.dirname(file).split('/')[0:-1])+'/'

def addUniqueIdToFile(filename):
    splitFilename = filename.split('.')
    splitFilename[0] = '{filename}-{id}'.format(filename=splitFilename[0], id=str(uuid.uuid4())[:6])
    return '.'.join(splitFilename)
