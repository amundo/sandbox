# -*- coding: utf-8 -*-
"""
Created on Thu May 22 13:26:35 2014

@author: Meagan
@author: Pat
"""
from collections import defaultdict
from collections import Counter
import json
import re

bigcor = open('corpus/hiligaynon.txt').read().decode('utf-8')

VOWELS = list(u'aeiou')

def vocabularize(text): 
  text = text.lower()
  tokens = re.sub("[^\w]" , " " , text).split()
  return list(set(tokens))

words = vocabularize(bigcor)
 
def build_re(splittables):
  return '(' + '|'.join(splittables) + ')'

def vowel_sequences(word):
  sequences =  re.findall('[aeiou]', word)
  if len(sequences) > 1:
    return tuple(sequences[:2])
  else:
    return False

first_two_vowels = map(vowel_sequences, words)
first_two_vowels = [x for x in first_two_vowels if x]

sequence_list = []
for two_vowels in first_two_vowels:
  if two_vowels:
    sequence_list.append( two_vowels )

sequence_count = Counter(first_two_vowels)

tally = defaultdict(unicode)
for v in VOWELS:
  tally[v] = defaultdict(int)

for sequence, count in sequence_count.items():
  a,b = sequence
  tally[a][b] = count

print json.dumps(tally, indent=2)

