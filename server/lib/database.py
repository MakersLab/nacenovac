from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from config import CONFIG, PATH
from lib.utils import getPath

engine = create_engine('sqlite:///{0}'.format(getPath(PATH, CONFIG['database'])),
                       convert_unicode=True)
dbSession = scoped_session(sessionmaker(autocommit=False,
                                        autoflush=False,
                                        bind=engine))
Base = declarative_base()
Base.query = dbSession.query_property()

def init_db():
    # import all modules here that might define models so that
    # they will be registered properly on the metadata.  Otherwise
    # you will have to import them first before calling init_db()
    import models.files
    import models.orders
    Base.metadata.create_all(bind=engine)
