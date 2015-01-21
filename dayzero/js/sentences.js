var Sentence = Backbone.Model.extend({
  defaults : function(){
    return { 
      transcription: '', 
      translation: '', 
      analysis: [],
      comments: [],
      createdAt: Number(new Date()) 
    }
  },
  
  initialize: function(options){
    _.bindAll(this, 'tokenize');

    this.analysis = new Analysis();

    if(this.get('analysis').length > 0){
      this.analysis.reset(this.get('analysis'));
    }

    this.on('change:transcription', this.tokenize, this);
    this.trigger('change:transcription'); // @@
  },

  tokenize: function(){
    //console.log(JSON.stringify(this.analysis.toJSON()));
    if(this.analysis.length === 0){
      var tokens = Languages.hil.tokenize(this.get('transcription'));
      var words = tokens.map(function(token){ return {token: token}});
      this.analysis.reset(words);
    }
  },

  parse: function(data){
    console.log(data);
    return data;
  },

  toJSON: function(){
    var json = Backbone.Model.prototype.toJSON.call(this);
    json.analysis = this.analysis.toJSON();
    return json;
  }

})

var Sentences = Backbone.Collection.extend({
  model: Sentence,

  comparator : function(sentence){
    return -sentence.get('createdAt');
  },

  parse : function(data){
    // @@ this is a hack to handle preexisting JSON format; fix!
    if(data[0].translations.en){
      var fixed = [];
      data.forEach(function(s){
        s.translation = s.translations.en;
        fixed.push(s);
      })
      return fixed;
    } else { 
      return data;
    } 
  },
})

var SentenceView = Backbone.View.extend({
  className: 'showing sentence',

  tagName: 'div',

  events: {
    'click .edit': 'edit',
    'click .destroy': 'destroy',
    'click .save': 'save',
    'dblclick .transcription': 'edit',
    'dblclick .translation': 'edit'
  },

  initialize : function(options){
    _.bindAll(this, 'edit', 'destroy', 'save', 'render', 'renderAnalysis');

    this.template     = _.template($('#showSentenceTemplate').html());
    this.editTemplate = _.template($('#editSentenceTemplate').html());

  },

  save: function(){
    var self = this;
    this.model.set('transcription', this.$('textarea.transcription').val());
    this.model.set('translation', this.$('textarea.translation').val());

    this.render();
  },

  destroy: function(){
    this.model.destroy();
    this.remove();
    return this;
  },

  edit: function(ev){
    this.$el.html( this.editTemplate(this.model.toJSON()) );
    this.delegateEvents();
    this.$el.removeClass('showing');
    this.$el.addClass('editing');
    this.$('textarea:first').focus();

    this.renderAnalysis();
    this.delegateEvents();
    return this;
  },

  renderAnalysis: function(){
    this.analysisView = new AnalysisView({
      collection: this.model.analysis,
      el: this.$('article .analysis')
    })
    this.analysisView.render();  
  },

  render: function(){
    this.$el.html( this.template(this.model.toJSON()) );

    this.$el.removeClass('editing');
    this.$el.addClass('showing');

    //this.analysisView.render();

    this.renderAnalysis();
    this.delegateEvents();
    return this;
  },

  parse: function(data){
    return data;
  }
})

var SentencesView = Backbone.View.extend({
  events: {
    'click .add': 'add'
  },

  className: 'sentences',

  initialize : function(options){
    _.bindAll(this, 'render');
    this.listenTo(this.collection, 'all', this.render);
  },

  add: function(){
    this.collection.add(new Sentence());
  },

  render: function(){
    var fragment = document.createDocumentFragment();

    var self = this;
    this.collection.each(function(sentence){ 
      var view = new SentenceView({ model : sentence });
      fragment.appendChild(view.render().el);
    })
    self.$('#sentences').html(fragment);
    this.delegateEvents();
  }
});

/*
var sentences = [
  {
    transcription: 'Kumusta ka?',  
    translation: 'How are you?', 
    analysis: [
      {token:'kumusta',gloss:'how.are.you',morphemes:'kumusta'},
      {token:'ka',gloss:'2.SG.ERG',morphemes:'ka'}
    ] 
  },
  { 
    transcription: 'Amo na ya!',  
    translation: 'That’s it!', 
    analysis: [
      {token:'amo',gloss:'what',morphemes:'amo'},
      {token:'na',gloss:'LINK',morphemes:'na'},
      {token:'ya',gloss:'EMPH',morphemes:'ya'}
    ] 
  }
];
*/

var sentences = new Sentences(sentences);

var sentencesView = new SentencesView({ 
  collection: sentences, 
  el : '#text'
});

sentencesView.render();
