var Sentence = Backbone.Model.extend({
    defaults: function () {
        return {
            transcription: '',
            translation: '',
            analysis: [
            ]
        }
    },
    initialize: function (options) {
        this.on('change:transcription', function(){ console.log(this.get('transcription'))}, this)
        this.analysis = new Words(this.get('analysis'))
    }
});
                
var Word = Backbone.Model.extend({
  defaults: function () {
        return {
            token: '',
            morphemes: '',
            gloss: ''
        }
    }
});
                
var Words = Backbone.Collection.extend({
    model: Word
});
                
m = new Sentence({
    transcription: 'Amo na ya',
    translation: 'That’s it!',
    analysis: [
      {token:'kumusta',gloss:'how.are.you',morphemes:'kumusta'},
      {token:'ka',gloss:'2.SG.ERG',morphemes:'ka'}
    ]
});
        
m.analysis.pluck('token').join(',')
