import subprocess
import re
import os
from lib.utils import loadYaml, getPath

config = loadYaml('../config.yml')

printTimeRegex = r'Print time: (\d*)'
filamentRegex = r'Filament: (\d*)'


def runSlicerCommand(stlPath, resultGcodePath):
  command = subprocess.Popen(
    '{curaExecutable} slice -v -j {definitionPath} -o {resultGcodePath}.gcode -l {stlPath}'
      .format(
      curaExecutable=config['slicer']['executable'],
      definitionPath=config['slicer']['printer-definition'],
      stlPath=stlPath,
      resultGcodePath=resultGcodePath
    ),
    stdout=subprocess.PIPE, stderr=subprocess.PIPE)
  _, output = command.communicate()
  output = output.decode(config['terminal-encoding'])
  return output, None


def slice(path, stlFileName):
  stlPath = os.path.join(path, config['stl-upload-directory'], stlFileName)
  resultGcodePath = os.path.join(path, config['gcode-directory'], stlFileName)

  if not os.path.isfile(stlPath):
    return None, 'STL at {} does not exist'.format(stlPath)

  result, err = runSlicerCommand(stlPath, resultGcodePath)
  return {
           'printTime': int(re.findall(printTimeRegex, result)[0]),
           'filament': int(re.findall(filamentRegex, result)[0]),
         }, err


if (__name__ == '__main__'):
  print(slice('3DBenchy.stl'))
