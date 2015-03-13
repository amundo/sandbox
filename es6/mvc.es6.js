
class View {
  constructor(options) {
    this.model = options.model;
    this.template = options.template;
  }

  render() {
    return tmpl(this.template, this.model.toJSON());
  }
}

class Model {
  constructor(properties) {
    this.properties = properties;
  }

  toJSON() {
    return this.properties;
  }
}

class PhraseView extends View {
  constructor(opts){
    Object.keys(opts).forEach(key => {
      this[key] =  opts[key]
    }) 
  }

  render(){
    var compiled = super.render();
    this.el.innerHTML = compiled;
  }
}

class Phrase extends Model {
  constructor(properties){
    if(!('transcription' in properties) ||  !('translation' in properties)){
      throw new Error('you need a transcription and a translation')
    }

    this.properties = {};
    this.properties.transcription = properties.transcription;
    this.properties.translation = properties.translation;
    this.properties.words = [];

  }

  set transcription(transcription) {
    this.properties.translation = '>' + transcription;
  }

  get transcription() {
    return this.properties.transcription
  }

  get translation() {
    return this.properties.translation
  }

  get tokens() {
    return this.properties.transcription.split(' ')
  }

  get words() {
    return this.properties.transcription.split(' ')
  }

}

var phrase = new Model({
  transcription: 'Me llamo Wugbot',
  translation: 'Call me Wugbot.'
});

var phraseView = new PhraseView({
  model: phrase,
  template: '<%= transcription %> ‘<%= translation %>’',
  el: document.body
});

phraseView.render();
