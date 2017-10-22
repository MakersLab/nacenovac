import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from lib.utils import loadYaml, loadFromFile
from jinja2 import FileSystemLoader, Environment

class Email:
  def __init__(self, server, port, login, password):
    self.login = login
    self.password = password
    self.server = server
    self.port = port
    self.createConnection()

  def createConnection(self):
    self.connection = smtplib.SMTP_SSL(self.server, self.port)
    self.connection.ehlo()
    self.connection.login(self.login, self.password)

  @staticmethod
  def createMessage(sender, receiver, subject, content, fileContent=None, fileName=None):
    message = None
    text = MIMEText(content, 'html')
    if (fileContent and fileName):
      message = MIMEMultipart()
      file = MIMEApplication(fileContent, Name=fileName)
      message.attach(file)
      message.attach(text)
    else:
      message = text
    message['Subject'] = subject
    message['From'] = sender
    message['To'] = receiver
    return message

  def send(self, message):
    try:
      self.connection.noop()
    except smtplib.SMTPServerDisconnected as e:
      self.createConnection()
    finally:
      self.connection.sendmail(message['From'], message['To'], message.as_string())
    self.connection.quit()

if __name__ == '__main__':
  config = loadYaml('../../email/email.yml')
  mail = Email(config['server'], config['port'], config['email'], config['password'])

  #
  messageForClient = mail.createMessage(
    config['email'],
    'devastor555@gmail.com',
    'Your newly created order is registered and we are working on it',
    'New order for 3D print shop')
  mail.send(messageForClient)

  env = Environment(loader=FileSystemLoader('../../email/'))
  template = env.get_template('company.jinja2')
  content = template.render(filament='the blue one...plastic', price='between 10 and 20')

  messageForCompany = mail.createMessage(
    config['email'],
    config['order-to'],
    'new order',
    content,
    loadFromFile('../../data/stl/Flower_pot_3-7bde90.STL', bytes=True),
    'flower-pot.stl')
  mail.send(messageForCompany)
