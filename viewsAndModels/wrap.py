#!/usr/bin/python2.7
# coding: utf-8
import sys, codecs
sys.stdout = codecs.getwriter('utf-8')(sys.stdout)
from string import Template
import sys


template = u"""
<!DOCTYPE html>
<html>
<head>
  <title>Data and Presentation</title>
  <meta charset=utf-8>
  <script src=js/jquery.js></script>
  <link rel=stylesheet href="style.css" media=screen />
</head>
<body>
<main>
$content
</main>
</body>

</html>
"""


content = sys.stdin.read().decode('utf-8')
print Template(template).safe_substitute({'content':content})
