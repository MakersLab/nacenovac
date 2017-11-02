import subprocess
import re
import os
from lib.utils import loadYaml

config = loadYaml('../config.yml')

dimensionsRegex = r'{type} = +(\-?\d+\.\d+)'
types = {
  'x': ['Min X', 'Max X'],
  'y': ['Min Y', 'Max Y'],
  'z': ['Min Z', 'Max Z'],
}

def analyzeSTL(path, fileName):
  command = subprocess.Popen('{ADMeshExecutable} {stlFilePath}'.format(
    ADMeshExecutable=config['ADMesh-executable'],
    stlFilePath = os.path.join(path, config['stl-upload-directory'], fileName)
  ), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
  output, err = command.communicate()
  output = output.decode(config['terminal-encoding'])
  dimensions = {}
  for type in types:
    try:
      firstVal = re.findall(dimensionsRegex.format(type=types[type][0]), output)[0]
      secondVal = re.findall(dimensionsRegex.format(type=types[type][1]), output)[0]
      dimensions[type] = abs(float(firstVal) - float(secondVal))
    except IndexError as e:
      print('unable to decode', output)
      raise e
  return dimensions
