var Word = Backbone.Model.extend({
  defaults : { 
    token : '', 
    morphemes: '', 
    gloss: ''
  },

  initialize: function(options){
    _.bindAll(this, 'populate');
  },

  complete: function(){
    return this.get('token').length > 0 &&  this.get('morphemes').length > 0 &&  this.get('gloss').length > 0 
  },

  populate: function(){
    var match = words.lookup(this.get('token'));
    this.set(match);
  },

  validate: function(attrs, options) {
  }
})

var Words = Backbone.Collection.extend({
  model: Word,

  initialize : function(options){
    _.bindAll(this, 'lookup', 'contains');
    this.listenTo(this, 'add remove reset change', this.sort);
    this.deferred = this.fetch({url: 'data/hil/lexicon.json'})
  },

  comparator: function(word){
    return word.get('token').toLowerCase()
  },

  contains: function(query){
    return this.lookup(query).length > 0;
  },

  lookup: function(word){
    var query;
    if (_.isObject(word)){
      query = word;
    } else  {
      query = {token: word}
    }
    return this.where(query)
  }

})

var WordView = Backbone.View.extend({
  className: 'word',

  tagName: 'ol',
  
  events: {
    'dblclick': 'edit',
    'click .destroy': 'destroy',
    'keyup input.morphemes' : 'keyupMorphemes',
    'keyup input.gloss' : 'keyupGloss',
    'keyup input' : 'keyup'

  },

  initialize : function(options){
    _.bindAll(this, 'edit', 'destroy', 'save', 'render', 'keyup', 'keyupGloss', 'keyupMorphemes');
    this.template = _.template($('#showWordTemplate').html());
    this.editTemplate = _.template($('#editWordTemplate').html());
  },


  // read inputs and return as key-value pairs 
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

  save: function(){
    var self = this;
    this.model.set({
      'token': 		this.$('input[name="token"]').val(),
      'morphemes': 	this.$('input[name="morphemes"]').val(),
      'gloss': 		this.$('input[name="gloss"]').val()
    })

    this.render();
  },

  keyup: function(ev){
    switch(ev.which){
     case 13: // ENTER
       this.save();
       break;
    }
  },

  keyupGloss: function(ev){
    switch(ev.which){
     case 13: // ENTER
       var values = this.readAll();
       this.model.set(values);
       break;
    }
  },

  keyupMorphemes: function(ev){
    switch(ev.which){
     case 40: // DOWN ARROW
       ev.target.value = this.model.get('token')
       break;
    }
  },

  destroy: function(){
    this.model.destroy();
    this.remove();
    return this;
  },

  edit: function(ev){
    this.$el.html( this.editTemplate(this.model.toJSON()) );
    this.$el.addClass('editing');
    this.delegateEvents();
    this.$('input:first').focus();
    return this;
  },

  render: function(){
    this.$el.html( this.template(this.model.toJSON()) );
    this.$el.removeClass('editing');
    this.delegateEvents();
    return this;
  }
})

var WordsView = Backbone.View.extend({
  defaults: {
    editing: false
  },

  events: {
    'click .add': 'add'
  },

  className: 'words',

  initialize : function(options){
    _.bindAll(this, 'render');
    this.listenTo(this.collection, 'all', this.render);
    this.collection.deferred.done(this.render);
  },

  add: function(){
    this.collection.add(new Word( ));
  },

  render: function(){
    var fragment = document.createDocumentFragment();

    var self = this;
    this.collection.each(function(word){ 
      var view = new WordView({ model : word });
      fragment.appendChild(view.render().el);
    })
    self.$('#list').html(fragment);
    this.delegateEvents();
  }
})



var words = new Words();
//words.fetch({url: 'data/hil/lexicon.js'});

//var wordsView = new WordsView({ 
//  collection: words, 
//  el : '#words'
//});
//
//wordsView.render();
