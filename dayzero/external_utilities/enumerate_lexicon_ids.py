import sys
import json

if not sys.argv[1]:
  print 'Usage: python enumerate_lexicon_ids.py <path.to.lexicon.json>'
  exit()

lex = json.load(open(sys.argv[1]))

#lex = json.load(open('lexicon.json'))

lex_with_ids = []

for i, w in enumerate(lex):
  w['id'] = i
  lex_with_ids.append(w)

print json.dumps(lex, indent=2)
