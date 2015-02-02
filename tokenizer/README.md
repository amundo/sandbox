tokenizer
=========

One simple approach to javascript tokenization.

Tokenization boils down to a series of string transformations: removing delimiters, and splitting into tokens.

Just what the delimiters should be configurable. 

One simple approach to this is to represent each transformation as a function, and then to compose those functions “onto” a string.

That’s the approach taken in this very simple library, which provides one public function, `tokenize(text)`. 
