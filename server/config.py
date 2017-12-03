from lib.utils import loadYaml
import os
from sys import platform

OS = None
if platform == 'linux' or platform == 'linux2':
  OS = 'linux'
elif platform == 'win32':
  OS = 'windows'

def getProjectPath(file):
  replaceChar = '/'
  if OS == 'windows':
    replaceChar = '\\'
  return '/'.join(os.path.dirname(file).split(replaceChar)[0:-1]) + '/'

PATH = getProjectPath(__file__)
CONFIG = loadYaml('config.yml')
EMAIL_CONFIG = loadYaml(CONFIG['email-config'])
FILAMENTS = loadYaml(CONFIG['filaments-config'])
