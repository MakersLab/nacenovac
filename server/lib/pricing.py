def price(printTime, filamentUsed, filament=None):
  return round((printTime/60/60)*filament['price'])
