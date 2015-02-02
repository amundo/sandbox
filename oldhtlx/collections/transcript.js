app.Transcript = Backbone.Collection.extend({

  initialize: function(options){
    this.url = options.url;
    this.deferred = this.fetch();
  },

  search: function(test){
    return this.filter(function(model) {
      return model.match(test)
    })
  },

  url: function(){ return this.url },

  model: app.Utterance,

  parse: function(data){
    return data;
  }

})
