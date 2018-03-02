from threading import Thread

def execute(func):
  executionThread = Thread(target=func)
  executionThread.daemon = True
  executionThread.start()

