from sbtrans import * 
import codecs
import json
"""
Here's a little script to generate some test output 
in tests/japanese/ so we can start to look at what's 
going wrong with our Roman-to-Hiragana scheme!

We should think about where a good place to store a
script like this would be, and better yet, about how
to have a general testing mechanism for arbitrary 
scripts.  

"""

ja_test = open('test/japanese/romaji.txt').read().decode('utf-8')
words = ja_test.lower().replace('.',' ').split()

roman2hira = json.load(open('rules/japanese/roman2hiragana.json'))

# A crummy way to tokenize!
words = ja_test.lower().replace('.',' ').replace(',',' ').split()

out = codecs.open('test/japanese/word_by_word.txt', mode='w', encoding='utf-8')

for word in words:
 transliterated = transliterate(roman2hira, word)
 out.write( word + '\n' + transliterated + '\n\n')

out.close()
