;(function() {
'use strict';

/**
 * Replace all relative urls in a given HTML string with absolute
 *
 * @param {String} html source
 * @param {String} base url
 * @return {String} replaced html source
 */

function replace(str, url) {
  if (typeof url === 'function') return replace.iterate(str, url)
  return str.replace(replace.rx, '$1' + url + '/$4')
}

/*!
 * The magic, find all occurences of `attr="/`, ignoring any `//` found,
 * ensure that the leading `/` of the url is not captured
 *
 * HTML attribute list from: http://stackoverflow.com/questions/2725156/complete-list-of-html-tag-attributes-which-have-a-url-value
 */

replace.rx = /((href|src|codebase|cite|background|cite|action|profile|formaction|icon|manifest|archive)=["'])(([.]+\/)|(?:\/)|(?=#))(?!\/)/g

/*!
 * Match the same as above, but capture the full URL for iteration
 */

replace.captureRx = /((href|src|codebase|cite|background|cite|action|profile|formaction|icon|manifest|archive)=["'])((([.]+\/)|(?:\/)|(?:#))(?!\/)[a-zA-Z0-9._-]+)/g

/**
 * URL replacement using function iteration, this is handled slightly
 * different as the user will be supplied with the full attribute value
 * for replacement, and will be inserted back correctly
 *
 * @param {String} html source
 * @param {Function} url iterator, called with (url, attributeName)
 * @return {String} replaced html source
 */

replace.iterate = function(str, iterator) {
  return str.replace(replace.captureRx, function(full, prefix, prop, url) {
    return prefix + iterator(url, prop)
  })
}

/*!
 * Exports
 */

if (typeof exports !== 'undefined') module.exports = replace
else this.absolutify = replace

}.call(this));
