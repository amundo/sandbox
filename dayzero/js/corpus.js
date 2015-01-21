var Corpus = Backbone.Collection.extend({
})

var corpusInfoView = Backbone.View.extend({
  events: {
    'dblclick header .info h1.title': 'edit',
  },

  className: 'corpus',

  initialize : function(options){
    _.bindAll(this, 'render', 'edit');
    this.render();
  },

  edit: function(){
  },

  render: function(){
    var template = _.template($('#corpusInfoTemplate').html());
    this.$el.html( template(this.model.toJSON())); 
    this.delegateEvents();
  }
});

var CorpusInfo = Backbone.Model.extend({ 
  defaults : { 
  }
})

var corpusInfo = new CorpusInfo({ 
});

var corpusInfoView = new CorpusInfoView({ 
  model : corpusInfo,
  el : 'section#corpus > header'
});

