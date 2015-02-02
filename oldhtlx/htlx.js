app = {};

Backbone.Model.prototype.match = function(test) {
}

app.Utterance = Backbone.Model.extend({

  defaults: function () {
      return {
          id: '',
          selected: false,
          tags: [
          ]
      }
  },

  initialize: function () {
      _.bindAll(this, 'tag', 'untag', 'match');
  },
  
  match: function(test){
    return _.any(this.attributes, function(attr) {
        return _.isRegExp(test) ? test.test(attr) : attr == test
    })
  },
  
  tag: function (tags) {
      var tags = _.unique(this.get('tags').concat(tags));
      this.set('tags', tags);
      this.trigger('change:tags');
  },

  untag: function (nixTags) {
      var tags = _.without(this.get('tags'), nixTags);
      this.set('tags', tags);
      this.trigger('change:tags');
  }

})



app.Word = Backbone.Model.extend({

  defaults : { 

  },

  initialize : { 

  },
  


})


app.Lexicon = Backbone.Collection.extend({

  model : app.Word,

  initialize : function(){
    _.bindAll(this, 'search', 'loadURL');
  },

  /* load an external URL into the collection */
  loadURL : function(url){
 
    this.originalUrl = this.url;
    this.url = url;
    this.fetch(); // or maybe just this.fetch({ url: url }); ? 
    this.url = this.originalUrl;

  },  

  search : function(query){
    return  
  }  


})


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

