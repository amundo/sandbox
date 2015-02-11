var cleanData = function() {
  delete rawData.corpora;
  delete rawData.delimiters;
  delete rawData.lexica;
  delete rawData.orthographies;
  delete rawData.preferences;
  delete rawData.tags;
  var rawTexts = rawData.texts;
  
  rawTexts.forEach(function(text) {
    delete text.abbreviation;
    delete text.access;
    delete text.dateCreated;
    delete text.dateModified;
    delete text.dateRecorded;
    delete text.title;
    delete text.type;
    delete text.activityID;
    delete text.cityID;
    delete text.countryID;
    delete text.genreID;
    delete text.localeID;
    delete text.regionID;
    delete text.tags;
    delete text.GISLocationID;
    
    text.phrases.forEach(function(phrase) {
      delete phrase.paragraphNum;
      delete phrase.tags;
      
      phrase.words.forEach(function(word) {
        delete word.tags;
      });
    });
  });  
};

cleanData();