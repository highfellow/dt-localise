{ EventEmitter } = require 'events'
webL10n = require './lib/webL10n/l10n.js'
_ = document.webL10n.get

# events on template to listen for
EVENTS = [
  'add', 'end'
  'show', 'hide'
  'attr','text', 'raw'
  'remove', 'replace'
]

# template methods to reproduce.
METHODS = [
  'register', 'remove'
  'end', 'ready'
  'show', 'hide'
]

makeListener = (event) ->
  return (args...) =>
    console.log "event: ", event, args...
    @emit event, args...

makeMethod = (method) ->
  return (args...) ->
    console.log "method: ", method, args...
    @template[method] args...
     
class LocaliseAdapter extends EventEmitter
  constructor: (@template, opts = {}) ->
    @xml = @template.xml
    # pass methods back to template.
    for method in METHODS
      this[method] = makeMethod.call(this,method)
    @listen()
    return this
  toString: () ->
    "[Object LocaliseAdapter]"
  listen: () ->
    for event in EVENTS
      listener = if event is 'text' then @ontext else makeListener.call(this, event)
      @template.on(event, listener.bind(this))
  ontext: (el, text) =>
    console.log "event: text", el, text
    l10nId = el?.attrs?['data-dt-l10n-id']
    if l10nId?
      tr = _(l10nId)
      console.log "l10nId:", l10nId, tr
      @emit 'text', el, tr
    else
      @emit 'text', el, text
  onother: (event, args...) =>

# exports
#
#localise.fn = defaultfn

module.exports = {
  _: document.webL10n.get,
  localise: (opts, tpl) ->
    [tpl, opts] = [opts, null] unless tpl?
    return new LocaliseAdapter(tpl, opts)
  setLocaleCallback: (callback) ->
    window.addEventListener 'localized', ->
      newLang = document.documentElement.lang = document.webL10n.getLanguage()
      document.documentElement.dir = document.webL10n.getDirection()
      console.log "Locale loaded", newLang
      callback()
    , false
  loadLocale: (locale) ->
    document.webL10n.setLanguage locale
}
 
