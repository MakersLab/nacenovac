from lib.database import Base
from sqlalchemy import Column, Integer, String, Float, Text, Numeric, Boolean, Table
from sqlalchemy.orm import relationship

class Order(Base):
  __tablename__ = 'orders'
  id = Column('id',Integer, primary_key=True)
  email = Column(String(100), nullable=False)
  details = Column(Text)
  delivery = Column(String(20))
  price = Column(Integer)
  emailSentToClient = Column('email_sent_to_client', Boolean)
  emailSentToCompany = Column('email_sent_to_company', Boolean)
  files = relationship('File', backref='order', lazy=True)
  phone = Column(String(30))

  def __init__(self, email, phone, delivery=None, price=None, details=None, emailSentToClient=False, emailSenToCompany=False):
    self.email = email
    self.phone = phone
    self.price = price
    self.delivery = delivery
    self.details = details
    self.emailSentToClient = emailSentToClient
    self.emailSentToCompany = emailSenToCompany
