#!/usr/bin/python2.7
# -*- coding: utf-8 -*-
"""
sbtrans.py - apply a set of transliteration rules to text

Created by ComplingFTW at UCSB
"""
import json
import sys
import os

def order_rules(rules):
  """
  Transliteration rules must be ordered by the length of the 
  "before" side of each, to prevent rule bleeding.

  Consider the ruleset:  

  [
    ["n", "N"],   # rule 1
    ["na", "NA"]  # rule 2
  ]

  Consider what happens If this ruleset is applied to the 
  string "nana":

  Apply rule 1:  
  
    "nana" -> "NaNa"

  Now rule 2 is blocked!

  The solution is to reorder the rules such that the longest
  rules with the longest input sides are run first. (In this
  example, rule 2 should precede rule 1.
 
  """
  bylength = sorted([(len(left), left, right) for left, right in rules])
  ordered = [(left, right) for length, left, right in bylength]
  return list(reversed(ordered))
  
def read_rules(filename):
  """
  Read the contents of the json file called filename and return
  the data structure. Contains a structure like (imagine a trivial
  capitalization transliteration scheme):
  
  [
     ['a', 'A'],
     ['b', 'B'],
     ['c', 'C']  
  ]
  
  """
  return order_rules(json.load(open(filename)))

def transliterate(rule_list, input_text):
  """
  Apply the before, after transliteration rules in 
  rule_list to input_text.

  Returns a Unicode string.
  """
  text = input_text
  for before, after in rule_list:
    text = text.replace(before, after) 
  return text

def transliterate_file(ruleset, input_filehandle=sys.stdin, output_filehandle=sys.stdout):
  """
  Basic usage:
  
      $ python sbtrans.py <rule_file> <input_file> <output_file>

  E.g.: 

      $ python sbtrans.py rules/georgian/mkhedruli.json test/georgian/cities.txt test/georgian/cities-roman.txt

  This will read rules from rules/georgian/mkhedruli.json, input text from test/georgian/cities.txt,  
  and write it to test/georgian/cities-roman.txt.

  Advanced usage:

  Read text to be transliterated from STDIN and print it to STDOUT:
  
      $ echo 'Cxu vi parolas?' | python sbtrans.py rules/esperanto/x2full.json 
      Ĉu vi parolas?

  This function is not recommended for use from the interactive Python prompt -- use 
  transliterate() and normal file I/O.
  """
  input_text = input_filehandle.read().decode('utf-8')
  transliterated = transliterate(ruleset, input_text)
  output_filehandle.write(transliterated.encode('utf-8'))

if __name__ == "__main__":
  import sys

  args = sys.argv
  args_count = len(args)

  if args_count == 1:
    print "Usage: python sbtrans.py [RULES] [INFILE] [OUTFILE]"
    exit()
    
  rule_path = sys.argv[1]
  rules = read_rules(rule_path)

  if args_count == 2: # from STDIN to STDOUT
    transliterate_file(rules)

  elif args_count == 3: # from INFILE to STDOUT 
    INFILE = sys.argv[2]
    input_filehandle=open(INFILE)

    transliterate_file(rules, input_filehandle=open(INFILE))

  elif args_count == 4: # from INFILE to OUTFILE
    INFILE, OUTFILE = sys.argv[2:4]
    input_filehandle=open(INFILE)
    output_filehandle=open(OUTFILE, 'w')

    transliterate_file(rules, input_filehandle, output_filehandle)


