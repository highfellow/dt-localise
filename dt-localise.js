(function() {
  var EVENTS, EventEmitter, LocaliseAdapter, METHODS, makeListener, makeMethod, webL10n, _,
    __slice = Array.prototype.slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  EventEmitter = require('events').EventEmitter;

  webL10n = require('./lib/webL10n/l10n.js');

  _ = document.webL10n.get;

  EVENTS = ['add', 'end', 'show', 'hide', 'attr', 'text', 'raw', 'remove', 'replace'];

  METHODS = ['register', 'remove', 'end', 'ready', 'show', 'hide'];

  makeListener = function(event) {
    var _this = this;
    return function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      console.log.apply(console, ["event: ", event].concat(__slice.call(args)));
      return _this.emit.apply(_this, [event].concat(__slice.call(args)));
    };
  };

  makeMethod = function(method) {
    return function() {
      var args, _ref;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      console.log.apply(console, ["method: ", method].concat(__slice.call(args)));
      return (_ref = this.template)[method].apply(_ref, args);
    };
  };

  LocaliseAdapter = (function(_super) {

    __extends(LocaliseAdapter, _super);

    function LocaliseAdapter(template, opts) {
      var method, _i, _len;
      this.template = template;
      if (opts == null) opts = {};
      this.onother = __bind(this.onother, this);
      this.ontext = __bind(this.ontext, this);
      this.xml = this.template.xml;
      for (_i = 0, _len = METHODS.length; _i < _len; _i++) {
        method = METHODS[_i];
        this[method] = makeMethod.call(this, method);
      }
      this.listen();
      return this;
    }

    LocaliseAdapter.prototype.toString = function() {
      return "[Object LocaliseAdapter]";
    };

    LocaliseAdapter.prototype.listen = function() {
      var event, listener, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = EVENTS.length; _i < _len; _i++) {
        event = EVENTS[_i];
        listener = event === 'text' ? this.ontext : makeListener.call(this, event);
        _results.push(this.template.on(event, listener.bind(this)));
      }
      return _results;
    };

    LocaliseAdapter.prototype.ontext = function(el, text) {
      var l10nId, tr, _ref;
      console.log("event: text", el, text);
      l10nId = el != null ? (_ref = el.attrs) != null ? _ref['data-dt-l10n-id'] : void 0 : void 0;
      if (l10nId != null) {
        tr = _(l10nId);
        console.log("l10nId:", l10nId, tr);
        return this.emit('text', el, tr);
      } else {
        return this.emit('text', el, text);
      }
    };

    LocaliseAdapter.prototype.onother = function() {
      var args, event;
      event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    };

    return LocaliseAdapter;

  })(EventEmitter);

  module.exports = {
    _: document.webL10n.get,
    localise: function(opts, tpl) {
      var _ref;
      if (tpl == null) _ref = [opts, null], tpl = _ref[0], opts = _ref[1];
      return new LocaliseAdapter(tpl, opts);
    },
    setLocaleCallback: function(callback) {
      return window.addEventListener('localized', function() {
        var newLang;
        newLang = document.documentElement.lang = document.webL10n.getLanguage();
        document.documentElement.dir = document.webL10n.getDirection();
        console.log("Locale loaded", newLang);
        return callback();
      }, false);
    },
    loadLocale: function(locale) {
      return document.webL10n.setLanguage(locale);
    }
  };

}).call(this);
