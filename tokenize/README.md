Let’s Build a Simple Tokenizer
==============================

In our thread about counting things, we ended up discussing _tokenization_
quite a bit. If you’re not familiar with the process, here’s a very brief
introduction, together with a few very basic Javascript concepts for review.

Ideas mentioned in this tutorial:

* **strings**
* **arrays**
* **variables**
* **functions**
* **test harnesses**

Let’s start with a couple very simple data structures: **strings** and
**arrays**. You can think of a string as “some text,” which might contain
anywhere between a single character to, say, _Moby Dick_. Happily, Javascript
supports (almost) all of Unicode, which means that you can put text in a 
whole bunch of languages into a string. Javascript doesn’t care. To Javascript,
a string is a string is a string.

Here’s a string:

```javascript
'hello world'
```

And here’s an **array**, which in this case is just a list of two strings:


```javascript
['hello', 'world']
```

So, these two data structures (a string and an array) can be used as a simple 
way to model the process of breaking text into words. In Natural Language Processing
and Computational Linguistics that process is referred to as _tokenization_.

Note that the process of tokenization is writing-system specific.

Imagine if we had put some other language in the string:

```javascript
'ハロー・ワールド'
```

That’s Japanese for “Hello World”.

And here’s the two-word array:

```javascript
['ハロー', 'ワールド']
```

If you look closely, you’ll notice that the character `・` can serve the same purpose 
that a space serves in English: it’s a _delimiter_. 

## Splitting <code>string</code>s into <code>array</code>s

So, in order to go from a **string** representing some text to an **array** of <code>string</code>s
representing a list of words, we need to figure out how to break up the text at each 
instance of the _delimiter_. 

Happily, Javascript knew we’d want to do that, and every string already knows how carry
out that process! (At least, a basic version of that process…) 

Javascript calls this process of splitting strings into arrays of strings, sensibly enough,  
_split_. Here’s how you make it happen:

```javascript
'hello world'.split(' ')
``` 

If we run that at the Javascript console, we will see the expected result:

```javascript
['hello', 'world']
```

## A Function for Tokenizing

There’s much, much more to the process of tokenizing. But this very simple process we’ve seen
is the heart of the process. Now here’s something interesting about programming: when we find
that we’re going to be doing some procedure over and over, it’s helpful to give a _name_ to 
that process. There are many benefits of giving it a name, but the one that might not be 
obvious is actually the most important: 

> Naming a procedure allows us to improve how we’re carrying out the procedure incremetally.

A procedure with a name is a **function**. Here’s one way to make a function in Javascript:

```javascript
function tokenize(text){
  return text.split(' ');
}
```

This is not too far from what we’ve already seen. What’s changed? Well, we see the `function` 
keyword. You use that, unsurprisingly, whenever you define a function in Javascript. Then 
we see the word `tokenize`. I picked that word. I could have named it `jane` if I wanted, but
that would make whatever programmer has to read my programmer dislike me. Unless their name is
Jane, I guess.

Then we see some parentheses: these contain what we’re handing to the function as raw material.
We also get to pick a name for what that “raw material” is: in this case I chose to call it `text`.
This is what’s going to contain our input string. (Like `'hello world'`.)

Next up is a curly bracket:  `{`. This means “Look out, here comes all the steps that constitute
the procedure we’re naming. Unsurprisingly, the end of the function is going to be a matching curly
bracket, `}`.

It’s in between `{` and `}` that the actual processing takes place. Ignoring the `return` for the moment,
we can see `text.split(' ')`, which looks more or less like what we saw above, where we were directly
<code>split</code>ting a <code>string</code>. Our function is still going to do that, but it’s 
going to carry it out on whatever string the programmer wants. 

Once that’s done, the function <code>return</code>s the result. And what will the result be? An 
array of strings, just like before. 


Okay, we’ve written our function, how do we make it go? We `call` it. Like this:

```javascript
tokenize('hello world')
``` 

And if we do that at the Javascript console, we’ll see see the console reply to our “call” with 
the result we expect:

```Javascript
['hello', 'world']
```

Now, the difference between 

```javascript
'hello world'.split(' ')
``` 

…and…

```javascript
tokenize('hello world')
``` 

…might seem like more trouble than it’s worth. Actually, this is probably the most important
technique in programming. Why? _Because now you can stop thinking about how your tokenization
function works._ The word _tokenize_ is meaningful to you as a human being.  

Once you have a good tokenization function, you can start thinking about an `array` of <code>string</code>s
as _a list of words_. This is great! Now you’ve created something that gets you one step closer to 
_doing linguistics with a computer_.

## A Tokenization Testing Harness

Well, that sounds fancy. But as you’ve probably guess given our previous discussion, this is actually
a pretty crummy definition of tokenization. We’re going to want to improve it  and make it more capable.
I’m not going to go into the details of how that happens just yet, but I am going to show you a little
tool I threw together to test 
