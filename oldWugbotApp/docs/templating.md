/*

This simple approach to creating "views":

The <template> tag can be populated with empty HTML, like this:


  <template id=sentenceTemplate>
    <div class=sentence>
      <p class=transcription></p>
      <p class=translation></p>
    </div>
  </template>

To "stamp out" a copy of that template as a DOM node, one does:

    var template = document.querySelector(templateSelector);

This template object is a curious beast -- in order to make use
of it you have to use the rather nutty document.import

    var node = document.importNode(template.content, true);

Now node is a DOM node of the same sort that you get if you do 
either of:

    var node = document.createElement(div);

or:

    var node = document.querySelector('div');

In the first instance, you're creating a DOM node from scratch,
in the second, you're using a CSS-style selector to get a reference
to a node that is already in the DOM -- it's either in the HTML
markup you start with, or you've previously dynamically generated it
with code).

var eg = render('#sentenceTemplate', {
  transcription: 'hola',
  translation: 'hi',
})

document.querySelector('#text').appendChild(eg);
*/

