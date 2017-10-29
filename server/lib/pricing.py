def price(printTime, filamentUsed, filament=None):
  return (printTime/60/60)*filament['price']
