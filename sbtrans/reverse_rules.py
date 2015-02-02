"""
reverse_json_rules.py - reverse a transliteration scheme

To run this script as a standalone file, pass two arguemnts:

1. the first list of json rules
2. the second list of json rules you want to create

* Make sure you remember to type the full path to the location where you want
your out file to end up ! 

"""
import json

def reverse_rules(rules):
  """
    Convert:

    [ 
       ['a', 'A'],
       ['b', 'B'],
       ['c', 'C']
    ]
    
    To: 

    [ 
       ['A', 'a'],
       ['B', 'b'],
       ['C', 'c']
    ]

    @TODO: what if the rules are not reversible? 
  """
  return [(b,a) for a,b in rules] 

if __name__ == "__main__":
  import sys

  if len(sys.argv) != 3:
    print 'Usage: python reverse_json_rules.py <./path/to/input.json> <path/to/output.json>'
    exit()
  
  rules          = json.load(open(sys.argv[1]))
  reversed_rules = reverse_rules(rules)

  output_path = sys.argv[2]
  out = open(output_path, "w")
  out.write(json.dumps(reversed_rules, indent=2))
  out.close()

