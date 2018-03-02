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
  def createMessage(sender, receiver, subject, content, files=None):
    message = None
    text = MIMEText(content, 'html')
    if (files):
      message = MIMEMultipart()
      for file in files:
        file = MIMEApplication(file['content'], Name=file['name'])
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

