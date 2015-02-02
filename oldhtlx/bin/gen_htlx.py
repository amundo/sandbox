"""
Script to compile all model and collection js files down to a
single htlx.js file for inclusion in interfaces.

This is a pain because you have to run it every time you change
any model or collection, but it makes for fewer annoying <script>
tags in interface marker.
"""
from glob import glob

htlx = 'app = {};\n';

for subfolder in 'models collections'.split():
  for f in glob(subfolder + '/*.js'):
    print f
    htlx += '\n' + open(f).read() + '\n'


open('htlx.js','w').write(htlx)
