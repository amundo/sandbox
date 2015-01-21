//  dayzero.js 0.1 

//     (c) 2013 Patrick Hall
//     dayzero may be freely distributed under the MIT license.
//     Documentation coming soon at:
//     http://htlx.info
// 
//     Git repository available at:
//     http://github.com/htlx/dayzero

// (function(){


// Language
// --------  
// 
// Represents metadata about a language. Attach to a `Text` object.
//
// <mark>Add validation</mark>
var Language = Backbone.Model.extend({
  defaults: function(){
    return { 
      name : '',
      iso639 : '',
      alphabet : [],
      punctuationPATTERN : "[\-,\?\.\!\…]",
      letterNames : []
    }
  },

  initialize:  function(options){
    _.bindAll(this, 'phonemize', 'depunctuate', 'tokenize')
  },

  // Split a string into phonemes. 
  //
  // Compare:
  // 
  //     phonemize('ngalan') → ['ng', 'a', 'l', 'a', 'n']
  //     phonemize('namon') → ['n','a','m','o','n']
  //
  // Note that «ng» happens to be treated as a ‘letter’ in Hiligaynon.
  phonemize: function(text){
    var alphabet = this.get('alphabet')
    // we want to match «ng» before «n», so sort by length.
    var letters = alphabet.sort(function(a,b){ return b.length-a.length});
    var phonemeRE = new RegExp('(' + letters.join('|') + ')' );
    return text.match(phonemeRE);
  },

  // Delete punctuation characters. 
  //
  // _Language-specific._
  depunctuate:  function(text){
    var punctuationRE = new RegExp(this.get('punctuationPATTERN'), 'g');
    return text.split(punctuationRE).join(' ');
  },

  // Depunctuate and then split into words
  // 
  // _Language-specific._
  tokenize:  function(text){
    var depunctuated = this.depunctuate(text).trim();
    return depunctuated.split(/[ ]+/);
  }

})

// App 
// --- 
//
// App object for wrapping core elements and providing single point of entry
var App = {};

// Word
// ----
//
// A `Word` is initialized with at least a `token` attribute. It automatically
// looks itself up by that token in the `Lexicon` and populates its other fields.
// 
// `Word`s consist of:
// 1. **token** - the phonetic representation of the Word, e.g. **naglumpat**
// 2. **morphology** - the morphological representation of the Word, e.g. **nag-lumpat**
// 3. **gloss** - the gloss of the Word, e.g. **TRANS.PERFECT-jump**
//
// For information on glossing see [The Leipzig Glossing Rules](http://www.eva.mpg.de/lingua/resources/glossing-rules.php)
//
App.Word = Backbone.Model.extend({

  defaults: {
    token: '',
    morphology: '',
    gloss: ''
  },

  initialize: function(options){
    _.bindAll(this, 'populate', 'update')
    //this.populate();
    this.on('change', this.update, this);
  },

  update : function(){
    console.log(JSON.stringify(this.attributes,null,2));
  },

  populate : function(){
    //var match = text.lexicon.lookup({token: this.get('token')})
    this.set(match.attributes);
  }

})

// Lexicon
// -------
//
// The `Lexicon` is the repository for all lexical information.
// `Word`s look themselves up here via `token` immediately upon instantiation.
App.Lexicon = Backbone.Collection.extend({
   model : App.Word,

   initialize: function(options){
     _.bindAll(this, 'lookup');     
   },

   comparator: function(word){
     return word.get('token').toLowerCase();
   },

   // If the word isn't found in the `Lexicon`, add it.
   lookup: function(attrs){
     if(_.isString(attrs)){
       attrs = {token: attrs};
     }

     // <mark>For now, we don’t support homonymy!</mark>
     var match = this.findWhere(attrs); // returns 1 result

     if(match){
       return match;
     } else { 
       this.add(attrs)
       return this.lookup(attrs);
     }
   }
})



// Sentence
// --------  
// 
// A `Sentence` contains:
// 
// 1. A `transcription` : a transcribed stretch of speech (String)
// 2. A `translation` : a free translation into the description language (String)
// 3. `tokens` : a list of strings (not a collection) derived automatically from `transcription`
//
// The `SentenceView` watches this model for changes to the `tokens` list, which it 
// 
App.Sentence = Backbone.Model.extend({

  defaults: function(){
    return { 
      transcription : '',
      translation : '',
      tokens : [],
    }
  },

  initialize: function(options){
    _.bindAll(this, 'tokenize');
    this.on('change:transcription', this.tokenize, this);
  },

  // Use the `Language.tokenize` to split `Sentence.transcription` into words
  tokenize : function(){
    var tokens = text.language.tokenize(this.get('transcription'));
    this.set('tokens', tokens);
    Backbone.trigger('sentence:tokenize', tokens);
    //var words = tokens.map(function(token){ return {token: token}});
  }
})

// Sentences 
// --------- 
//
// Container to add to `Text` object.
App.Sentences = Backbone.Collection.extend({
  model: App.Sentence
})

// Text
// ----
//
// A `Text` is the top-level model (until we build a `Corpus` model). It contains 
// references to the `Lexicon` collection, the `Language`, and the `Sentences` 
// collection. 
// 
// A `Text` consists of:
//
// 1. An optional title
// 2. A collection of `Sentence` models
// 3. A reference to a `Language` model instance, which contains language-specific information
// 4. A reference to a `Lexicon` model instance, which lexical information in the `Language`. 
//
// Depends on `Lexicon` &gt; `Word`, `Sentences`, `Language`
App.Text = Backbone.Model.extend({
  initialize: function(options){
    _.bindAll(this, 'addSentence', 'log');

    this.sentences = new Sentences(),
    this.language = new Language(options.language);
    this.lexicon = new Lexicon(options.lexicon);

  },

  log: function(){
    console.log(JSON.stringify(this.toJSON(),null, 2));
  },

  addSentence: function(sentence){
    this.sentences.add(sentence);
  }

})


// Analysis 
// -------- 
//
// Collection of `Word`s. Can be thought of as a small subset of 
// `Lexicon`. These are not stored with the `Sentence` objects; 
// rather, they are populated as needed from the `Lexicon`. 
//
// <mark>Inefficient</mark>: we need to cache these objects onto the
// `Sentence` down the road..
App.Analysis = Backbone.Collection.extend({
  model: App.Word
})

// AnalysisView 
// ------------
// 
// Edit apparatus of words with lexical information, wraps `WordView`s.
//
App.AnalysisView = Backbone.View.extend({

  events: { 
  },

  initialize: function(options){
    _.bindAll(this, 'render')
    this.el.innerHTML = '';
  },

  render: function(sentence){
    var self = this;
    var fragment = document.createDocumentFragment();

    this.collection.each(function(word){
      var wordView = new WordView({model: word});
      fragment.appendChild(wordView.el);
    })

    this.$('#analysis').append(fragment);
    return this;
    
    return this;
  }

})


// SentenceView 
// --------  
// 
// Index view of `Sentence` object
// (subview of `TextView`)
//
App.SentenceView = Backbone.View.extend({

  events: { 
    'click': function(){ console.log(JSON.stringify(this.model.attributes))}
  },

  className: 'sentence',

  model: App.Sentence,

  initialize: function(options){
    _.bindAll(this, 'render')
    this.template = _.template($('#sentenceTemplate').html());
  },

  // `Sentence`s  are responsible for rendering themselves 
  render: function(sentence){
    var self = this;
    this.$el.html(self.template(this.model.toJSON()));
    return this;
  }

})

// TextView
// --------  
// 
// Index view of `Text` object
//
App.TextView = Backbone.View.extend({

  el: $('#text'),

  initialize: function(options){
    _.bindAll(this, 'render')
    this.template = _.template($('#sentenceTemplate').html());
    this.listenTo(this.model.sentences, 'add', this.render);
  },

  // Responsible for rendering `Sentences` collection. 
  render: function(){
    var self = this;
    var fragment = document.createDocumentFragment();
    this.el.innerHTML = '';

    this.model.sentences.each(function(sentence){
      var sentence = new SentenceView({model: sentence}).render().el;
      fragment.appendChild(sentence);
      //self.$el.find('#sentences').append(self.template(sentence.toJSON()));
    })
    this.el.appendChild(fragment);
    return this;
  }
})


// WordView
// ----
App.WordView = Backbone.View.extend({
  tagName: 'li',

  events : {
    'keyup input.morphology' : 'keyupMorphology',
    'keyup input.gloss' : 'keyupGloss',
    'keyup input' : 'keyup',
    'click' : function(){ console.log(JSON.stringify(this.model.attributes))}
  }, 
 
  initialize : function(options){
    _.bindAll(this, 'keyupGloss', 'keyupMorphology', 'readAll');
    this.listenTo(this.model, 'change', this.render);
    this.render();
  },

  // collect all 
  readAll: function(ev){
    var morphology = this.$('input.morphology').val().trim();
    var gloss = this.$('input.gloss').val().trim();
    var token = this.model.get('token');
    return { 
      morphology: morphology,
      token: token,
      gloss: gloss
    }
  },

  keyupGloss: function(ev){
    switch(ev.which){
     case 13: // ENTER
       var values = this.readAll();
       this.model.set(values);
       text.lexicon.add(this.model);
       break;
     case 40: // DOWN ARROW
       ev.target.value = this.model.get('token')
       break;
    }
  },

  keyupMorphology: function(ev){
    switch(ev.which){
     case 13: // ENTER
       var morphology = this.$('input.morphology').val().trim();
       this.model.set('morphology', morphology);
       text.lexicon.add(this.model);
       break;
     case 40: // DOWN ARROW
       ev.target.value = this.model.get('token')
       break;
    }
  },

  render: function(){
    var template  = _.template($('#wordTemplate').html());
    this.$el.html(template(this.model.toJSON())); 
    return this;
  }
})


// EditorView
// ----------
//
// Interface for editing, glossing, and saving `Sentence`s.
App.EditorView = Backbone.View.extend({

  events: {
    'keyup textarea' : 'keyup',
    'click #addSentence' : 'addSentence'
  },

  el : '#editor',

  model : new App.Sentence(),

  initialize: function(options){
    _.bindAll(this, 'keyup', 'updateParallelText', 'clear');


    this.$('.transcription').attr('lang',  text.language.get('iso639'));
    this.$('.translation').attr('lang',  options.translationLang);

    this.model.on('change', this.render, this);

    this.analysisView = new AnalysisView({
      collection: new Analysis(),
      el: this.$('#analysis')
    })
  },

  // When the
  keyup: function(ev){
    if(ev.which == 13){ // ENTER
      this.updateParallelText();
    }
  },

  // Edit the `transcription` and `translation` attributes on the current `Sentence`. 
  updateParallelText: function(){
    var transcription = this.$('textarea.transcription').val().trim();
    var translation = this.$('textarea.translation').val().trim();

    this.model.set({
      'transcription': transcription,
      'translation': translation
    });

    this.$('textarea.transcription').val(transcription);
    this.$('textarea.translation').val(translation);

    this.$('.transcription').focus();

  },

  clear: function(){
    this.$('textarea.transcription').val('');
    this.$('textarea.translation').val('');
    this.analysisView.el.innerHTML = '';
    this.analysisView = new AnalysisView({
      collection: new Analysis(),
      el: this.$('#analysis')
    })

    this.model = new Sentence();

    this.$('.transcription').focus();
  },

  addSentence: function(){
    text.sentences.add(this.model);
    this.clear();
  },

  log: function(options){
    console.log(JSON.stringify(this.model.toJSON(), null, 2))
  },

  render: function(options){
    var fragment = document.createDocumentFragment();

    this.model.get('tokens').forEach(function(token){
      var word = new Word({token: token});
      var wordView = new WordView({model: word});
      fragment.appendChild(wordView.el);
    })

    this.$('#analysis').html(fragment);
    return this;
  } 
})

// LexiconView
// -----------
//
// A searchable view of the `Lexicon`.
App.LexiconView = Backbone.View.extend({
  initialize: function(options){
    _.bindAll(this, 'render');
    this.$ol = this.$el.find('ol');
    this.render();
    this.listenTo(this.collection, 'add remove', this.render);
    this.listenTo(Backbone, 'analyze:sentence', this.render);
  },

  render : function(){
    var self = this;
    var inlineWordTemplate =  $('#inlineWordTemplate').html(); //'<li><%- token %></li>';
    this.$ol.html('');
    this.collection.each(function(word){
      self.$ol.append(_.template(inlineWordTemplate, word.toJSON()));
    })
    return this;
  }
})

// text instance
// -------------
//
// <mark>refactor to init</mark>
App.text = new Text({
  lexicon : [
    { token: 'kumusta',  morphology: 'kumusta', gloss: 'how.are.you' },
    { token: 'ka',  morphology: 'ka', gloss: '1.ERG.SG' },
    { token: 'ang',  morphology: 'ang', gloss: 'the' }
  ],
  title: 'A Wicked Hiligaynon Production',
  language: {
    name: 'Hiligaynon',
    iso639: 'hil',
    punctuationPATTERN : '[\,\?\.\!\…]',
    alphabet: 'a b k d e g h i l m n ng o p r s t u w y'.split(' '),
    letterNames : "a ba ka da e ga ha i la ma na nga o pa ra sa ta u wa ya".split(' ')
  }
}),
    
    
// textView instance
// -----------------
//
// <mark>refactor to init</mark>
App.textView = new App.TextView({model: App.text});


// editorView instance
// -----------------
//
// <mark>refactor to init</mark>
App.editorView = new App.EditorView({

   translationLang : 'en'

});

// lexiconView instance
// -----------------
//
// <mark>refactor to init</mark>
App.lexiconView = new App.LexiconView({
  el: '#lexicon',
  collection: text.lexicon
})

// Router
// ------
App.Router = Backbone.Router.extend({

  routes : {
    '' : 'index',
    'text' : 'text',
    'sentences/:id' : 'showSentence',
    'sentences/search/:query' : 'searchSentences',
    'words/search/:query' : 'searchWords'
  },

  initialize: function(options){
    _.bindAll(this, 'index', 'text', 'showSentence', 'searchWords',  'searchSentences' )
  },

  index: function(){
    alert('index');
    App.textView.render();
  },

  text: function(){
  },

  showSentence: function(id){
  },

  searchWords: function(query){
  },

  searchSentences: function(query){
  }

})

app.router = new Router();
Backbone.history.start();


// }).call(this)

