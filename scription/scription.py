#!/usr/bin/python2.7

"""
scription.py - convert scription format text content to JSON 

(Note: this isn't identical to the Javascript version yet.)
"""
import fileinput
import json
import re

contents = [] 
for line in fileinput.input():
  contents.append( line.decode('utf-8') ) 

contents = ''.join(contents).strip()

chunks = re.split('\n[\n]+', contents)

pairs = [c.splitlines() for c in chunks]
for p in pairs:
  if len(p) != 2: 
    print p
    exit()

sentences = [dict(zip('sentence translation'.split(), (a,b))) for a,b in pairs]

print json.dumps(sentences, indent=2)
