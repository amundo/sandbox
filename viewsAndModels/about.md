# Views and Models

## What’s Data, Anyway?

A characteristic of the web which is pretty tricky is the relationship
between _data_ and the way the browser _presents_ the data.
The browser creates an internal representation from HTML (the stuff in the web page) 
so that Javascript can do stuff with that representation — manipulate it, 
change it, add to it, extract or add information to it, and so on.

The thing is, when you’re building an application that has what might be
called <em>domain knowledge</em> in it — that is, knowledge about the 
world — then you don’t want HTML to be place that you actually <em>save</em>
the data. What does this mean?

Well, let’s take a simple example. Suppose you’re carrying out the simplest of
linguistic tasks, collecting a wordlist. Perhaps you’ve got a few words in 
Mixtec (we’re not even talking about translations yet, let’s imagine you just
transcribed a few words you heard):

<ul>
<li>veʔe</li>
<li>naní</li>
<li>xiʔín  </li>
</ul>

Three words, no big deal. Now, you <em>could</em> store these “in” markup, 
like this:

<pre>
&lt;ul&gt;
  &lt;li&gt;veʔe&lt;/li&gt;
  &lt;li&gt;naní&lt;/li&gt;
  &lt;li&gt;xiʔín  &lt;/li&gt;
&lt;/ul&gt;
</pre>

In this approach, you would save your linguistic data as an <code>.html</code>
file. That would be a bad idea. Why? Well, what happens when you decide you 
<em>do</em> want to add the translations to these words? Do you add more markup?

<pre>
&lt;dl&gt;
  &lt;dt&gt;veʔe&lt;/dt&gt;
  &lt;dd&gt;‘house’&lt;/dd&gt;
  &lt;dt&gt;naní&lt;/dt&gt;
  &lt;dd&gt;‘to be named’&lt;/dd&gt;
  &lt;dt&gt;xiʔín  &lt;/dt&gt;
  &lt;dd&gt;‘with’&lt;/dd&gt;
&lt;/dl&gt;
</pre>

What’s the problem? This doesn’t look too bad. It renders readably enough:

<dl>
  <dt>veʔe</dt>
  <dd>‘house’</dd>
  <dt>naní</dt>
  <dd>‘to be named’</dd>
  <dt>xiʔín  </dt>
  <dd>‘with’</dd>
</dl>

Hey, a few more thousand of these <code>dd</code> & <code>dt</code>  tags and I’ll 
have a whole dictionary!

Well yeah, you will. But the problem is you’d be missing the goose for the golden 
egg: this arrangement is just <em>one way</em> to represent this data. 
You could easily imagine wanting to render it “inline”, say, in a paper: like this: 
<strong>veʔe</strong> <span>‘house’</span>;
<strong>naní</strong> <span>‘to be named’</span>;
<strong>xiʔín  </strong> <span>‘with’</span>.

Or, you might want it in a table:

<table>
<thead>
  <tr>
    <th>Word</th>
    <th>Part of Speech</th>
    <th>Definition</th>
  </tr>
</thead>
  <tbody>
    <tr>
      <td>veʔe</td>
      <td>noun</td>
      <td>‘house’</td>
    </tr>
    <tr>
      <td>naní</td>
      <td>verb</td>
      <td>‘to be named’</td>
    </tr>
    <tr>
      <td>xiʔín  </td>
      <td>relational noun</td>
      <td>‘with’</td>
    </tr>
  </tbody>
</table>

<aside>This little demo makes use of the <code><a title="<datalist> - HTML (HyperText Markup Language) | MDN" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist">datalist</a> </code> HTML element.</aside>

What about an autocomplete box?


<datalist id=words>
  <option value=veʔe>
  <option value=naní>
  <option value=xiʔín>
</datalist>


<blockquote>
<input type=text placeholder="type the letter n" list=words />
</blockquote>


The point is, even a list of three words constitutes <em>data</em>, and the whole point
of data is to be able to interact with it in lots of ways, not just <em>find</em>
it in a file, or <em>read</em> it in a single format.

<aside>There is another, more accessible, tool for interacting with data, and that tool
is a **user interface** — a “front end” or “client-side” application — of the sort we can build with web applications. Not everyone needs to
learn to be a programmer to benefit from well-structured data!</aside>

There is a very powerful tool for which will allow you to <em>repurpose</em> your data
in any of these ways and a zillion more, and that tool is
a programming language. On the web platform, the default programming language
is Javascript. If we want to take advantage of the power of the programming 
language, we should represent our data in a format that Javascript understands.

A list of words could be represented as an array of strings:

<pre>
<code>
['veʔe', 'naní', 'xiʔín']
</code>
</pre>

Here we are speaking Javascript. Javascript can handle this information quite directly.
For instance, we can assign it to a variable: 

<pre>
<code>
var words = ['veʔe', 'naní', 'xiʔín']
</code>
</pre>

And now we can query the data. For instance, what is the second word?

<pre>
<code>
console.log(words[1])
</code>
</pre>

This will output <code>'naní'</code> to the console. Or, we could sort 
it, since Javascript has a built-in <code>.sort()</code> method:

<aside>In Javascript, sorting happens “in place” — you don’t have to reassign
the array to a new variable.</aside>

<pre>
<code>
words.sort();
</code>
</pre>

Now we could <code>console.log(words)</code> and we’ll see: 

<pre>
<code>
[ "naní", "veʔe", "xiʔín" ]
</code>
</pre>

Hey, wait a second — the tone on the first syllable of the last word is 
high, not mid… it should be **xíʔín**, not **xiʔín**.

<pre>
<code>
words[2] = 'xíʔín'
</code>
</pre>

<code>console.log(words)</code> now says: 

<pre>
<code>
[ "naní", "veʔe", "xíʔín" ]
</code>
</pre>

Great.

<aside>On the difference between coding and modeling, see <q><a title="Chris Granger - Coding is not the new literacy" href="http://www.chris-granger.com/2015/01/26/coding-is-not-the-new-literacy/">Coding is not the new literacy</a></q>.</aside>

This sort of thing is just scratching the surface of we mean when we say that 
this representation of our wordlist is a _model_ of data. 
Through the power of a programming language, a model of data can be made much
more useful. A model of data makes it:

* Editable
* Searchable
* Sortable
* Subset-able
* Countable

…and whatever other “-ables” we can dream up and implement.

## The Data/View Conundrum

So, you could do a lot of linguistics with just a programming language. You could just
live in  “data world” all the time, and write code that does whatever you want,
and have it spit out formats you like.

But the web platform offers linguists another golden goose, and one which is at least as
consequential as the power of a programming language.
That is the opportunity to create <em>interactive</em> data through the use of _interfaces_
or _applications_. Creating interfaces is more important than  one might at first presume. For instance, the question of ergonomics — how
hard it is on our bodies to input data — is no laughing matter when you’re talking about 
documenting (in principle) a _whole language_. It had better be as painless as possible to add, edit, and use the
data, or it’ll never get done. Simple as that. 

Javascript is _event driven_. That’s how users get data into the system.










