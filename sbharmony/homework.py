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
import pandas
from matplotlib import pyplot as plt
from numpy import log

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

keys = sequence_count.keys()
values = sequence_count.values()
values.sort()
log_values = log(map(float, values))

plot_conf = raw_input("\n\nhey kid, wanna plot?: y/n").lower()

if 'y' in plot_conf:
    pandas.DataFrame({
        'x':sequence_count.keys(),
        'y':log_values}
        ).plot(x='x', kind='bar', title="Vowel Combination Occurrences",
                colormap="winter", legend=False, ylim=(0, max(log_values)))
    plt.show()

""" didn't finish this:

more_plots = raw_input("hey kid, wanna plot some more? this time by vowel groups?: y/n")

if 'y' in more_plots:
    seq_list = list(sequence_count.items())
    va = [v for v in seq_list if v[0][0].startswith('a')]
    ve = [v for v in seq_list if v[0][0].startswith('e')]
    vi = [v for v in seq_list if v[0][0].startswith('i')]
    vo = [v for v in seq_list if v[0][0].startswith('o')]
    vu = [v for v in seq_list if v[0][0].startswith('u')]

"""
