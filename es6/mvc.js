"use strict";

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var View = (function () {
  function View(options) {
    _classCallCheck(this, View);

    this.model = options.model;
    this.template = options.template;
  }

  _createClass(View, {
    render: {
      value: function render() {
        return tmpl(this.template, this.model.toJSON());
      }
    }
  });

  return View;
})();

var Model = (function () {
  function Model(properties) {
    _classCallCheck(this, Model);

    this.properties = properties;
  }

  _createClass(Model, {
    toJSON: {
      value: function toJSON() {
        return this.properties;
      }
    }
  });

  return Model;
})();

var PhraseView = (function (_View) {
  function PhraseView(opts) {
    var _this = this;

    _classCallCheck(this, PhraseView);

    Object.keys(opts).forEach(function (key) {
      _this[key] = opts[key];
    });
  }

  _inherits(PhraseView, _View);

  _createClass(PhraseView, {
    render: {
      value: function render() {
        var compiled = _get(Object.getPrototypeOf(PhraseView.prototype), "render", this).call(this);
        this.el.innerHTML = compiled;
      }
    }
  });

  return PhraseView;
})(View);

var Phrase = (function (_Model) {
  function Phrase(properties) {
    _classCallCheck(this, Phrase);

    if (!("transcription" in properties) || !("translation" in properties)) {
      throw new Error("you need a transcription and a translation");
    }

    this.properties = {};
    this.properties.transcription = properties.transcription;
    this.properties.translation = properties.translation;
    this.properties.words = [];
  }

  _inherits(Phrase, _Model);

  _createClass(Phrase, {
    transcription: {
      set: function (transcription) {
        this.properties.translation = ">" + transcription;
      },
      get: function () {
        return this.properties.transcription;
      }
    },
    translation: {
      get: function () {
        return this.properties.translation;
      }
    },
    tokens: {
      get: function () {
        return this.properties.transcription.split(" ");
      }
    },
    words: {
      get: function () {
        return this.properties.transcription.split(" ");
      }
    }
  });

  return Phrase;
})(Model);

var phrase = new Model({
  transcription: "Me llamo Wugbot",
  translation: "Call me Wugbot."
});

var phraseView = new PhraseView({
  model: phrase,
  template: "<%= transcription %> ‘<%= translation %>’",
  el: document.body
});

phraseView.render();
