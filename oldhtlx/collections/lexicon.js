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
