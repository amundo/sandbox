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

