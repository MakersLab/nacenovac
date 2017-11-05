from lib.utils import getProjectPath, getPath, addUniqueIdToFile, loadYaml, loadFromFile, removeValueFromDict

PATH = getProjectPath(__file__)
CONFIG = loadYaml('../config.yml')
EMAIL_CONFIG = loadYaml(CONFIG['email-config'], PATH)
FILAMENTS = loadYaml(CONFIG['filaments-config'], PATH)
