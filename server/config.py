from lib.utils import loadYaml
import os

def getProjectPath(file):
  return '/'.join(os.path.dirname(file).split('\\')[0:-1])+'/'

PATH = getProjectPath(__file__)
CONFIG = loadYaml('./config.yml')
EMAIL_CONFIG = loadYaml(CONFIG['email-config'])
FILAMENTS = loadYaml(CONFIG['filaments-config'])
