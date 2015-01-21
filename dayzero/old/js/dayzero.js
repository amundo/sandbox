//  dayzero.js 0.1 

//     (c) 2013 Patrick Hall
//     dayzero may be freely distributed under the MIT license.
//     Documentation coming soon at:
//     http://htlx.info
// 
//     Git repository available at:
//     http://github.com/htlx/dayzero

//(function(){
var show = function(o){ console.log(JSON.stringify(o,null,2))};

// Word
// ----
//
// A `Word` is initialized with at least a `token` attribute. 
//
// <mark>It should populate itself from the `Lexicon`.</mark>
// 
// `Word`s consist of:
// 1. **token** - the phonetic representation of the Word, e.g. **naglumpat**
// 2. **morphemes** - the morphological representation of the Word, e.g. **nag-lumpat**
// 3. **gloss** - the gloss of the Word, e.g. **TRANS.PERFECT-jump**
//
// For information on glossing see [The Leipzig Glossing Rules](http://www.eva.mpg.de/lingua/resources/glossing-rules.php)
//
var Word = Backbone.Model.extend({

  defaults: {
    token: '',
    morphemes: '',
    gloss: ''
  }

})

// Lexicon
// -------
//
// The `Lexicon` is the repository for all lexical information.
// `Word`s look themselves up here via `token` (and subsequently, if necessary,
//  to disambiguate homonyms, via `gloss` <mark>todo</mark>) immediately upon instantiation.
//
var Lexicon = Backbone.Collection.extend({
  model : Word,

  initialize: function(options){
    _.bindAll(this, 'lookup');     
    this.listenTo(Backbone, 'word:update', this.add); // triggered from WordView
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
// 3. An `analysis` : a collection of `Word`s
//
// Because the `token` in a given `Word` may be homonymous with that of another `Word`,
// and because the choice of homonyms is specific to the `Sentence`, disambiguation is
// carried out here and stored as an `Analysis`.
var Sentence = Backbone.Model.extend({

  defaults: function(){
    return { 
      transcription : '',
      translation : '',
      createdAt : new Date().getTime()
    }
  },

  initialize: function(options){
    _.bindAll(this, 'tokenize', 'toJSON');
    this.analysis = new Analysis();
    this.set('createdAt', new Date().getTime());
    this.on('change:transcription', this.tokenize, this);

  },

  toJSON: function(options){
    var attributes = _.clone(this.attributes);
    attributes.analysis = this.analysis.toJSON();
    return attributes;
  },

  // Use the `Language.tokenize` to split `Sentence.transcription` into words
  tokenize : function(){
    var tokens = text.language.tokenize(this.get('transcription'));
    var words = tokens.map(function(token){ return {token: token}});
    this.analysis.add(words);
  }
})

// Sentences 
// --------- 
//
// Container to add to `Text` object.
var Sentences = Backbone.Collection.extend({
  model: Sentence,

  initialize: function(){
    this.listenTo(Backbone, 'sentence:announce', this.add);  // triggered from `EditorView`
  },

  comparator: function(sentence){
    return -sentence.get('createdAt');
  }

})

// Text
// ----
//
// A `Text` is the top-level model (until we build a `Corpus` model). It contains 
// references to the `Lexicon` collection, the `Language` model, and the `Sentences` 
// collection. 
// 
// 1. An optional title
// 2. A collection of `Sentence` models
// 3. A reference to linguistic configuration data, which is instantiated as a `Language` model instance.
// 4. A reference to an array of word models, which is instantiated as a `Lexicon` collection. 
//
// Depends on `Lexicon` &gt; `Word`, `Sentences`, `Language`
var Text = Backbone.Model.extend({
  initialize: function(options){

    this.sentences = new Sentences(options.sentences),
    this.language = new Language(options.language);
    this.lexicon = new Lexicon(options.lexicon);

  },

  toJSON: function(attributes){
    var attributes = _.clone(this.attributes);
    attributes.sentences = this.sentences.toJSON();
    return attributes;
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
// `Sentence` down the road: in a given `Sentence`, a `Word` that is
// a homonym must have its token disambiguated.
var Analysis = Backbone.Collection.extend({
  model: Word,
  initialize: function(){
  }
})

// AnalysisView 
// ------------
// 
// Edit apparatus of words with lexical information, wraps `WordView`s.
//
// The `AnalysisView` is a subview of `EditorView`. It is not instantiated
// externally.
var AnalysisView = Backbone.View.extend({

  initialize: function(options){
    _.bindAll(this, 'render')
//this.$el.css({backgroundColor:'blue', minHeight: '10px'});
    this.analysis = this.collection
    this.listenTo(this.collection, 'add', this.render);
    this.setElement(options.el);
  },

  render: function(sentence){
    var self = this;
    var fragment = document.createDocumentFragment();

    this.collection.each(function(word){
      var wordView = new WordView({model: word});
      fragment.appendChild(wordView.el);
    })

    this.$el.html(fragment);
    return this;
    
  }

})

// SentenceView 
// --------  
// 
// Index view of `Sentence` object
// (subview of `SentencesView`)
//
var SentenceView = Backbone.View.extend({

  className: 'sentence',
 
  events: { 
    'click': function(){ console.log(JSON.stringify(this.model.attributes))}
  },

  className: 'sentence',

  model: Sentence,

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

// SentencesView
// --------  
// 
// Index view of `Text` object
//
var SentencesView = Backbone.View.extend({

  el: $('#text'),

  initialize: function(options){
    _.bindAll(this, 'render')
    this.template = _.template($('#sentenceTemplate').html());
    this.listenTo(this.collection, 'add remove reset', this.render);
    this.render();
  },

  render: function(){
    this.$('#sentences').empty();
    this.$('#sentencesCount').html(this.collection.length);

    var fragment = document.createDocumentFragment();
    this.collection.each(function(sentence){
      var view = new SentenceView({model: sentence});
      fragment.appendChild(view.render().el);
    })
    this.$('#sentences').append(fragment);

    return this;
  }
})

// WordView
// ----
var WordView = Backbone.View.extend({
  tagName: 'li',

  events : {
    'keyup input.morphemes' : 'keyupMorphemes',
    'keyup input.gloss' : 'keyupGloss',
    'keyup input' : 'keyup',
    'click' : function(){ console.log(JSON.stringify(this.model.attributes))}
  }, 
 
  initialize : function(options){
    _.bindAll(this, 'keyupGloss', 'keyupMorphemes', 'readAll');
    this.listenTo(this.model, 'change', this.render);
    this.render();
  },

  // collect all 
  readAll: function(ev){
    var morphemes = this.$('input.morphemes').val().trim();
    var gloss = this.$('input.gloss').val().trim();
    var token = this.model.get('token');
    return { 
      morphemes: morphemes,
      token: token,
      gloss: gloss
    }
  },

  keyupGloss: function(ev){
    switch(ev.which){
     case 13: // ENTER
       var values = this.readAll();
       this.model.set(values);
       // triggers on Lexicon collection
       Backbone.trigger('word:update', this.model);
       break;
    }
  },

  keyupMorphemes: function(ev){
    switch(ev.which){
     case 13: // ENTER
       var morphemes = this.$('input.morphemes').val().trim();
       this.model.set('morphemes', morphemes);
       //text.lexicon.add(this.model);
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
// Interface for editing, glossing, and adding `Sentence` models
// to the `Sentences` collection.
var EditorView = Backbone.View.extend({
  events: {
    'keyup #transcription' : 'keyupTranscription',
    'keyup #translation' : 'keyupTranslation',
    'click #announceSentence' : 'announceSentence'
  },

  el : '#editor',

  initialize: function(options){
    _.bindAll(this, 'keyupTranscription', 'keyupTranslation', 'announceSentence');

    this.render();

    this.analysisView = new AnalysisView({
      collection: this.model.analysis,
      el: this.$('#analysis')
    })

    this.listenTo(this.analysisView.analysis, 'add remove', this.analysisView.render); 

  },

  keyupTranscription: function(ev){
    if(ev.which == 13){
      var transcription = this.$('#transcription').val().trim();
      this.model.set('transcription', transcription);
      this.$('#analysis input:first').focus();
    }
  },

  keyupTranslation: function(ev){
    if(ev.which == 13){ // ENTER
      var translation = this.$('#translation').val().trim();
      this.model.set('translation', translation);
      this.$('#translation').focus().val('').val(translation);
    }
  },

  remove: function() {
    this.$el.empty();
    //this.model.stopListening();
    this.stopListening();
    return this;
  },
 
  announceSentence: function(){ // maybe
    Backbone.trigger('sentence:announce', this.model);  //maybe
  },

  render: function(options){
    var template = _.template($('#editorTemplate').html());
    this.$el.html(template(this.model.toJSON()));
    return this;
  } 
})

// LexiconView
// -----------
//
// A searchable view of the `Lexicon`.
var LexiconView = Backbone.View.extend({
  initialize: function(options){
    _.bindAll(this, 'render');
    this.$ol = this.$el.find('ol');
    this.render();
    this.listenTo(this.collection, 'add remove reset', this.render);
    //this.listenTo(Backbone, 'analyze:sentence', this.render);
  },

  render : function(){
    var self = this;
    var inlineWordTemplate =  $('#inlineWordTemplate').html(); //'<li><%- token %></li>';
    this.$ol.empty();
    this.collection.each(function(word){
      self.$ol.append(_.template(inlineWordTemplate, word.toJSON()));
    })
    return this;
  }
})

// text instance
// -------------
//
// Hiligaynon sample text.
var text = new Text({
  sentences : [], /*[
    { transcription: 'Kumusta ka?',  translation: 'How are you?', analysis: 
      [
        {token:'kumusta',gloss:'how.are.you',morphemes:'kumusta'},
        {token:'ka',gloss:'2.SG.ERG',morphemes:'ka'}
      ] 
    },
    { transcription: 'Amo na ya!',  translation: 'That’s it!', analysis:
      [
        {token:'amo',gloss:'how.are.you',morphemes:'kumusta'},
        {token:'na',gloss:'LINK',morphemes:'na'},
        {token:'ya',gloss:'EMPH',morphemes:'ya'}
      ] 
    },
  ],*/
  lexicon : [
    { token: 'kumusta',  morphemes: 'kumusta', gloss: 'how.are.you' },
    { token: 'ka',  morphemes: 'ka', gloss: '2.ERG.SG' },
    { token: 'ang',  morphemes: 'ang', gloss: 'the' }
  ],
  title: 'A Wicked Hiligaynon Production',
  language: {
    name: 'Hiligaynon',
    code: 'hil',
    punctuationPATTERN : '[\,\?\.\!\…]',
    alphabet: 'a b k d e g h i l m n ng o p r s t u w y'.split(' '),
    letterNames : "a ba ka da e ga ha i la ma na nga o pa ra sa ta u wa ya".split(' ')
  }
});

// MainView
// --------
//
// The MainView is the top-level interface. It holds references to:
//
// #### Views
//
// * `editorView`
// * `lexiconView`
// * `sentencesView`
//
// #### Data
//
// * `text`
// * `lexicon`
//
var MainView = Backbone.View.extend({
  el: $('main'),

  initialize: function(options){
    _.bindAll(this, 'resetEditor');

    this.text = options.text;

    // whenever a new sentence is "announced", we reset the editor
    // with a new `Sentence` model.
    this.listenTo(Backbone, 'sentence:announce', this.resetEditor);

    this.sentencesView = new SentencesView({
      el: '#text',
      collection: this.text.sentences //new Sentences() 
    }),

    this.initEditor();

    this.lexiconView = new LexiconView({
      el: '#lexicon',
      collection: this.text.lexicon 
    })

  }, 

  resetEditor: function(sentence){
    console.log(this.editorView.cid);
    console.log(this.editorView.model.cid);
    this.editorView.stopListening();
    this.editorView.remove();

    this.initEditor();
    console.log(this.editorView.cid);
    console.log(this.editorView.model.cid);
  },

  initEditor: function(){
    this.editorView = new EditorView({
      model : new Sentence(),
      el: '#editor'
    })
  }
})

// Router
// ------
var Router = Backbone.Router.extend({

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

var router = new Router();
Backbone.history.start();

// app
// ---
//
// ### Events:
// * `sentence:announce` 
// * `word:update`
var app = new MainView({
   text : text
});

// }).call(this)

