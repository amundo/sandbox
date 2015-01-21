var Text = Backbone.Model.extend({
  defaults : function(){
    return { 
      createdAt: Number(new Date()) 
    }
  },
  
  initialize: function(options){
  },

  toJSON: function(){
    var json = Backbone.Model.prototype.toJSON.call(this);
    //json.  = this.analysis.toJSON();
    return json;
  }

})


var TextInfoView = Backbone.View.extend({
  events: {
    'dblclick header .info h1.title': 'edit',
  },

  className: 'texts',

  initialize : function(options){
    _.bindAll(this, 'render');
    this.render();
  },

  render: function(){
    var template = _.template($('#textInfoTemplate').html());
    this.$el.html( template(this.model.toJSON())); 
    this.delegateEvents();
  }
});

var TextInfo = Backbone.Model.extend({ 
  defaults : { 
    code: '', 
    date: '', 
    language: '', 
    linguist: '', 
    speaker: '', 
    title: '', 
  }
})

var textInfo = new TextInfo({ 
    code: 'ur', 
    date: 'December 30, 2013', 
    language: 'Urdu', 
    linguist: 'Patrick Hall', 
    speaker: 'Azra Dawood', 
    title: 'Some Urdu', 
});

var textInfo = new TextInfo({ 
    code: 'hil', 
    date: 'January 1, 2013', 
    language: 'Hiligaynon', 
    linguist: 'Patrick Hall', 
    speaker: 'Joshua De Leon', 
    title: 'Some Hiligaynon', 
});

var textInfoView = new TextInfoView({ 
  model : textInfo,
  el : 'section#text > header'
});

