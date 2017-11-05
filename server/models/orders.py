from lib.database import Base
from sqlalchemy import Column, Integer, String, Float, Text, Numeric, Boolean

class Order(Base):
  __tablename__ = 'orders'
  id = Column('id',Integer, primary_key=True)
  email = Column(String(100), nullable=False)
  details = Column(Text)
  price = Column(Integer, nullable=False)
  emailSentToClient = Column('email_sent_to_client', Boolean)
  emailSentToCompany = Column('email_sent_to_company', Boolean)

  def __init__(self, email, price, details=None, emailSentToClient=False, emailSenToCompany=False):
    self.email = email
    self.price = price
    if details:
      self.details = details,
    self.emailSentToClient = emailSentToClient
    self.emailSentToCompany = emailSenToCompany
