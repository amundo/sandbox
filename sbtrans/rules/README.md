Transliteration rules
=====================

The directories found here contain one or more rule files,
one for each transliteration scheme. (A single language may
be transliterated in a number 
 which are read by the transliteration code 
(`sbtrans.py`) and then applied to text or whole files. 

The code reads the rules represented in `.json` format, which 
look like this:

    [
      [
        "a", 
        "\u30a2"
      ], 
      [
        "i", 
        "\u30a4"
      ], 
      [
        "u", 
        "\u30a6"
      ] 
    ]

This is a reliable format because the unicode data are escaped, and
because `.json` is usable by many different programming languages.
However, due to this very escaping notation, the rule files are not
fully human readable.

In order to enable easy adding of new transliteration rules, rulesets
may be stored in a simple plain-text format. This format should be
understandable by non-programmers. Scripts are included to convert
that plain text format to the `.json` format which the code reads.

So for instance, `japanese/roman2katakana.txt` begins like this:

    a
    ア
    
    i
    イ
    
    u
    ウ


