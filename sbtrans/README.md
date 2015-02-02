<img src=http://i.imgur.com/tDDGeIw.png>
=======

A minimalist (ha, ha) transliteration library built by UCSB ComplingFTW!

## What is transliteration?

Transliteration is the conversion of a text from one script or alphabet to another. For instance, the Greek phrase "Ελληνική Δημοκρατία" 'Hellenic Republic' can be transliterated as "Ellēnikē Dēmokratia" by substituting Greek letters for Latin letters.


## Using this Library

It's all in the source code, yo. For now.

Also, more instructions coming soon.


## How to Add a Scheme

The rule format for sbtrans is very simple: it consists of a directory which is named for the language
that the transliteration rules are applied to, which contains a `.txt` file whose
name is of the form `<before>2<after>.txt`. Here, `before` is the name of the input scheme, and `after`
is the name of the output scheme. 

## A Sample Transliteration Scheme

So for instance, the Esperanto has two writing systems, the so-called
“X-System” and the “Diacritical” or “Full” system. Esperanto letters with diacritics 
can be converted to plain text by changing the letter to its standard Latin form followed by an x. 


Here are the contents of `rules/esperanto/x2full.txt`:

    Cx
    Ĉ
    
    cx
    ĉ
    
    Gx
    Ĝ
    
    gx
    ĝ


…and so forth. In order to contribute a new transliteration scheme, one would simply compile a file in this
form, put it into a directory named for the language, and then either commit that file through this github 
project, or simply email it to us. You will be credited for your work!

## Contact Us

You can reach us through our Facebook group ComplingFTW.


## License

MIT 

(Yes, we appreciate the irony.)

