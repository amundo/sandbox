FERN
====

![fern](/https://openclipart.org/image/300px/svg_to_png/171185/farn.png)

i named this directory fern because i looked up and saw a fern.

this is an experiment to find a solution to the data/view conundrum: how are we to make data objects and (i.e., Javascript objects) and Views (which are associated with DOM nodes) communicate with each other without passing around object references everywhere? (Blech!)

1.html sets up the problem. When we submit a new word in `EditorView`, how should we inform both `WordListView` and `WordCountView` about the change, so that they re-render?

`2.html` offers a solution with a small “PubSub” library. 


For more see: [Pub/Sub JavaScript Object](http://davidwalsh.name/pubsub-javascript). The code I’ve used here is from a gist:

http://jsfiddle.net/3PNtR/
