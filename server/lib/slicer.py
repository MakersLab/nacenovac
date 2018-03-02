import subprocess
import re
import os
import configparser
from lib.utils import loadYaml, loadFromFile, getPath
from config import PATH, CONFIG, OS

printTimeRegex = r'Print time: (\d*)'
filamentRegex = r'Filament: (\d*)'


def runSlicerCommand(stlPath, resultGcodePath, settings):
  command = '{curaExecutable} slice -v -j {definitionPath} {settings} -o {resultGcodePath}.gcode -l {stlPath}'\
    .format(
      curaExecutable=CONFIG['slicer']['executable'],
      definitionPath=CONFIG['slicer']['printer-definition'],
      stlPath=stlPath,
      resultGcodePath=resultGcodePath,
      settings=settings
    )
  command = command.replace('\n', '')
  launchedCommand = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell= (OS == 'linux'))
  _, output = launchedCommand.communicate()
  output = output.decode(CONFIG['terminal-encoding'])
  return output, None


def slice(stlFileName, profilePath=None):
  stlPath = os.path.join(PATH, CONFIG['stl-upload-directory'], stlFileName)
  resultGcodePath = os.path.join(PATH, CONFIG['gcode-directory'], stlFileName)
  # settings = generateSettings(CONFIG['slicer']['profiles']['draft'])
  settings = loadFromFile(os.path.join(CONFIG['settings-directory'], CONFIG['slicer']['settings']['low']))
  if not os.path.isfile(stlPath):
    return None, 'STL at {} does not exist'.format(stlPath)
  result, err = runSlicerCommand(stlPath, resultGcodePath, settings)
  return {
    'printTime': int(re.findall(printTimeRegex, result)[0]),
    'filament': int(re.findall(filamentRegex, result)[0]),}, err


def generateSettings(path):
  profile = configparser.ConfigParser()
  profile.read_string(loadFromFile(path))
  settings = []
  if 'values' in profile.sections():
    for option in profile.options('values'):
      settings.append('-s {0}="{1}"'.format(option, profile['values'][option]))
  return ' '.join(settings)
