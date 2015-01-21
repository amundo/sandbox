// Router
// ------
var Router = Backbone.Router.extend({

  routes : {
    'words/export' 				: 'exportWords',
    'words/load/*path' 				: 'loadWords',
    'sentences/load/*path'			: 'loadSentences',
    '' 						: 'index'
  },

  index: function(){
  },

  loadWords: function(path){
    words.fetch({ url: path }, { remove: true})
  },

  loadSentences: function(path){
    sentences.fetch({ url: path }, { remove: true})
  },

  exportWords: function(){
    console.log(JSON.stringify(words, null, 2))
  }

})

var router = new Router();
Backbone.history.start();

