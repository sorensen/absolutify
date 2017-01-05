;(function() {
'use strict';

/**
 * Replace all relative urls in a given HTML string with absolute
 *
 * @param {String} html source
 * @param {String} base url
 * @return {String} replaced html source
 */

function absolutify(str, url) {
  if (typeof url === 'function') return absolutify.iterate(str, url)
  return str
    .replace(absolutify.rx, '$1' + url + '/$6')      // Inject the URL into the attribute
    .replace(new RegExp(url + '//', 'g'), url + '/') // Fix `attr="/"` edgecase causing a `//` issue
}

/*!
 * The magic, find all occurences of `attr="/`, ignoring any `//` found,
 * ensure that the leading `/` of the url is not captured
 *
 * HTML attribute list from: http://stackoverflow.com/questions/2725156/complete-list-of-html-tag-attributes-which-have-a-url-value

   1. find any possible element containing a url: `prop="`
   2. ignore leading protocols: `prop="http:`
   3. ignore protocol skips `prop="//`
   4. find and omit leading slash to normalize: `prop="/url`
   5.
 */

absolutify.rx = /((href|src|codebase|cite|background|action|profile|formaction|icon|manifest|archive)=["'])(?!(http|https|ftp|file|filesystem|gopher|ws|wss|about|blob|data|mailto):|(\/\/))((?:\/)?([^'"]+))/g // jshint ignore:line

/**
 * URL replacement using function iteration, this is handled slightly
 * different as the user will be supplied with the full attribute value
 * for replacement, and will be inserted back correctly
 *
 * @param {String} html source
 * @param {Function} url iterator, called with (url, attributeName)
 * @return {String} replaced html source
 */

absolutify.iterate = function(str, iterator) {
  return str.replace(absolutify.rx, function() {
    var url = arguments[6]

    return arguments[1] + iterator(
      url === '/' ? '' : url // URL without leading `/` (check for `attr="/"` edgecase)
    , arguments[2]           // HTML attribute
    , arguments[5]           // Contains leading `/` if found
    )
  })
}

/*!
 * Exports
 */

if (typeof exports !== 'undefined') module.exports = absolutify
else this.absolutify = absolutify

}.call(this));
