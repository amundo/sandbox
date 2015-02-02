import json
from copy import deepcopy

"""
{"geometry": { 
    "coordinates": [
      -73.805578999999994, 
      40.871778999999997
    ], 
    "type": "Point"
    }, 
    "id": 11, 
    "properties": {
    "ADDRESS2": "Pelham Bay Park", 
    "ADRESS1": "895 Shore Road", 
    "CITY": "Bronx", 
    "NAME": "Bartow-Pell Mansion", 
    "TEL": "(718) 885-1461", 
    "URL": "http://bartowpellmansionmuseum.org/index.php", 
    "ZIP": 10464.0
    }, 
    "type": "Feature"
}
"""

"""
A GeoJSON file is an object

We'll be making one which is a list of 
Features of type Point.

Each point will represent a word.

"""

word_point_feature = {
  "type": "Feature",

  "id": 0, 

  "geometry": {
    "coordinates": [
    ]
  },

  "properties": {
  }
 }
}

def build_word_collection(words){
  word_feature_collection = []
  for word in words: 
    word = build_word(word)
    word_feature_collection.append(word)
  return word_feature_collection

def build_word(data){
  word = deepcopy(word_point_feature)
  data['properties'] = data['properties']
  data['properties'] = data['properties']



