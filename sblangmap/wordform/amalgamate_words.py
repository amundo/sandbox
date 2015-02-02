import json
"""
read the data from the language files
"""

languages = json.load(open('language_data.json'))

def nest(array, attr):
  result = {}
  for el in array:
    result[el[attr]] = el
  return result

languages_by_code = nest(languages, 'code')

es = json.load(open('data/es.json'))

"""
this will be the output structure we 
generate the GeoJSON files
"""
words = open('words.txt').read().strip().splitlines()

data = { }

for word in words:
  data[word] = {}

