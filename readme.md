Relative Replace
================

[![Build Status](https://secure.travis-ci.org/sorensen/relative-replace.png)](http://travis-ci.org/sorensen/relative-replace)
[![devDependency Status](https://david-dm.org/sorensen/relative-replace.png)](https://david-dm.org/sorensen/relative-replace#info=dependencies)
[![NPM version](https://badge.fury.io/js/relative-replace.png)](http://badge.fury.io/js/relative-replace)

Replace relative URLs in a string with absolute URLs. This library is extremely
small and lightweight, and requires no external dependencies.

The primary motivation of this library is to be concise and performant, when
searching for this functionality, the common solution is to use actual DOM
manipulation for finding and replacing URLs, using `jQuery`, `cheerio`, and/or `jsdom`.


Install
-------

With [npm](https://npmjs.org)

```
npm install relative-replace
```


Usage
-----

Node.js

```js
var replace = require('relative-replace')

var html = '<html><a href="/sorensen">Home</a></html>'
var site = 'https://github.com'

var absolute = replace(html, site)
// '<html><a href="https://github.com/sorensen">Home</a></html>'

var byFunction = replace(html, function(url, attrName) {
  // url === '/sorensen'
  // attr === 'href'
  return site + url
})
```


### Supported Attributes

This library searches a given HTML string for the following attribute values that
start with either `/` or any form of `../` pathing.

| Attribute  |
| ---------- |
| href       |
| src        |
| codebase   |
| cite       |
| background |
| action     |
| profile    |
| formaction |
| icon       |
| manifest   |
| archive    |


[License](license)
