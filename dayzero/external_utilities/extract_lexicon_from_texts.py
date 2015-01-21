import json
from glob import glob
import sys

if len(sys.argv) < 1:
  print 'Usage: python extract_lexicon_from_texts.py <text1.json, text2.json, ...>'
  exit()

corpus = {}
#texts = glob('texts/*.json')
texts = sys.argv[1:]

for t in texts: 
 corpus[t] = json.load(open(t))

lexicon = []

for t, sentences in corpus.items():
 for s in sentences:
  if 'analysis' in s: 
    for w in s['analysis']: 
      lexicon.append(w)

print json.dumps(lexicon, indent=2)
