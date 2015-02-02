"""
textual2json.py - convert newline-separated transliteration
  scheme into appropriate JSON scheme

This takes two system arguments:

1. a text file with newline seperated values for each character converstion
with another newline after the two e.g.

character1
character2

character3
character4

and so on... 

2. an output json file

"""
import json
import sys

input_filename = sys.argv[1]
output_filename = sys.argv[2]

if not input_filename.endswith('txt'):
  print 'must be a .txt file'
  exit()

if not output_filename.endswith('json'):
  print 'must be a .json file'
  exit()    
    

raw = open(input_filename).read().decode('utf-8')

chunks = raw.strip().split('\n\n')

rules = []

for chunk in chunks:
  rules.append(chunk.splitlines()) 

json_out = json.dumps(rules, indent=2)
outfile = open(output_filename, "w")
outfile.write(json_out)

