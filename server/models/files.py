from lib.database import Base
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

class File(Base):
  __tablename__ = 'files'
  id = Column('id',Integer, primary_key=True)
  name = Column('name',String, nullable=False)
  fileName = Column('file_name',String, nullable=False)
  printTime = Column('print_time',Integer)
  filamentUsed = Column('filament_used',Integer)
  dimensionsX = Column('dimensions_x',Float)
  dimensionsY = Column('dimensions_y',Float)
  dimensionsZ = Column('dimensions_z',Float)
  orderId = Column('order_id', Integer, ForeignKey('orders.id'))
  amount = Column(Integer)
  filament = Column(String(100))

  def update(self, printTime, filamentUsed, dimensions):
    self.printTime = printTime
    self.filamentUsed = filamentUsed
    self.dimensionsX = dimensions['x']
    self.dimensionsY = dimensions['y']
    self.dimensionsZ = dimensions['z']

  def __init__(self, name, fileName):
    self.name = name
    self.fileName = fileName
    # self.printTime = printTime
    # self.filamentUsed = filamentUsed
    # self.dimensionsX = dimensions['x']
    # self.dimensionsY = dimensions['y']
    # self.dimensionsZ = dimensions['z']
