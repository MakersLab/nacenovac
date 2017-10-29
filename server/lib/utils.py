import yaml
import json
import os
import uuid

def loadFromFile(fileName, projectPath = None, bytes=False):
    if projectPath:
      path = os.path.join(projectPath, fileName)
    else:
      path = os.path.join('/'.join(os.path.dirname(__file__).split('/')[0:-1]), fileName)
    readType = 'r' if not bytes else 'rb'
    with open(path, readType) as file:
        fileContents = file.read()
        file.close()
    return fileContents

def loadYaml(fileName, projectPath = None):
    return yaml.load(loadFromFile(fileName, projectPath))

def loadJson(fileName):
    return json.loads(loadFromFile(fileName))

def writeFile(fileName, content):
    path = '/'.join(os.path.dirname(__file__).split('/')[0:-1])
    with open((os.path.join(path,fileName)), 'w') as file:
        file.write(content)
        file.close()

def getPath(file):
  return '/'.join(os.path.dirname(file).split('/')[0:-1])+'/'

def addUniqueIdToFile(filename):
    splitFilename = filename.split('.')
    splitFilename[0] = '{filename}-{id}'.format(filename=splitFilename[0], id=str(uuid.uuid4())[:6])
    return '.'.join(splitFilename)

def removeValueFromDict(k, value):
  for key in k:
    del k[key][value]
  return k
