import os
import sys
import json
from sbtrans import * 

def parse_textual_rules(rule_string):
  """
  Given an input Unicode string with transliteration 
    rules in the format:

      a
      A
      
      b
      B
      
      c
      C

   Return a nested array with those rules in this structure:

      [
        ['a', 'A'],
        ['b', 'B'],
        ['c', 'C']
      ]

  """
  chunks = rule_string.strip().split('\n\n')
  rules = []

  for chunk in chunks:
    rules.append(chunk.splitlines()) 

  rules = order_rules(rules)
 
  return rules

def ruleset_name_from_path(path):
  """ 

    >>> parse_textual_filename('roman2hiragana.txt')
    ('roman', 'hiragana')

  return a tuple containing (before, after)

  @@ TODO: This approach fails if the name of the before or 
    after scheme contains a literal '2'!
  """ 
  os.split(path)
  base = left2right.strip().replace('.txt', '')
  left, right = base.split('2')
  return (left, right) 

def save_rules(rules, path):
  """
  Writes out rules as formatted JSON to path.  
  """
  open(path, 'w').write(json.dumps(rules, indent=2) + "\n")

def generate_all(rules_directory='rules/'):
  for subdir, dirs, files in os.walk(rules_directory):
    for filename in files: 
      if filename.endswith('.txt'): # read file name and extract before and after names
        rules_string = open(subdir + os.sep + filename).read().decode('utf-8')
        rules = parse_textual_rules(rules_string)

        path = os.sep.join([subdir, filename])
        json_path = path.replace('.txt', '.json')

        save_rules(rules, json_path)
    
if __name__ == "__main__":
  generate_all()
