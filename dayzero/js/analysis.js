var Analysis = Backbone.Collection.extend({
  model: Word
})

var AnalysisView = Backbone.View.extend({
  
  initialize: function(options){
    _.bindAll(this, 'render')
    this.listenTo(this.collection, 'add remove reset', this.render);
  },

  render: function(sentence){
    var self = this;
    var fragment = document.createDocumentFragment();

    this.collection.each(function(word){
      var wordView = new WordView({model: word});
      fragment.appendChild(wordView.render().el);
    })

    this.$el.html(fragment);
    return this;
  }

})

