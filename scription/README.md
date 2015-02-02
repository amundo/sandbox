scription2json
==============

License:  http://www.wtfpl.net/ 

Read the content in a textarea composed in a simple plain-text format (which we’re calling
“scription” for no particular reason) and convert that content to JSON.

You can paste that output JSON into another textarea suitable for cutting and pasting into a new file.

Suppose you are doing a quick and dirty transcription from Quichua
to Spanish. You want to persist your notes in a form that won’t cause
difficulties down the road. One reasonable output would be [JSON](http://json.org).

This little app reads an extremely simple input format that looks like this (thanks
to [Jesse Stewart](http://jessestewart.net) for the example data):


    Shayhushka kani.
    Estoy cansado.
    
    Puñunayahuni.
    Quiero dormir.


And it converts it to JSON that looks like this:

    [
      {
        "transcription": "shayhushka kani",
        "translation": "estoy cansado"
      },
      {
        "transcription": "puñunayahuni",
        "translation": "quiero dormir"
      }
    ]

For now it’s just a matter of cutting and pasting that output into a text
file that you save on your hard drive. Maybe later we will add fancier stuff. 

How to Try This Little App
--------------------------

The simplest way to try this out is to download the zipfile by clicking the 
“Download ZIP” button in the lower right corner of this page. Unzip the folder
somewhere on your hard drive, and then go into your web browser and click
“File > Open” in the browser’s menu. Select `nlsv2json.html` and your browser should
render a simple interface.

Type (or cut and paste) your transcription/translation pairs in the top window
(with a blank line between each pair), and then click `Convert`.

JSON will be output in the lower box.



Credits
-------

* Pat Hall
* Danny Hieber http://danielhieber.com
* Marianne Huijsmans
* Jesse Stewart http://jessestewart.net 
