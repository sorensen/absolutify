Absolutify
==========

[![Build Status](https://secure.travis-ci.org/sorensen/absolutify.png)](http://travis-ci.org/sorensen/absolutify)
[![devDependency Status](https://david-dm.org/sorensen/absolutify.png)](https://david-dm.org/sorensen/absolutify#info=dependencies)
[![NPM version](https://badge.fury.io/js/absolutify.png)](http://badge.fury.io/js/absolutify)

Replace relative URLs in a string with absolute URLs. This library is extremely
small and lightweight, and requires no external dependencies.

The primary motivation of this library is to be concise and performant, when
searching for this functionality, the common solution is to use actual DOM
manipulation for finding and replacing URLs, using `jQuery`, `cheerio`, and/or `jsdom`.


Install
-------

```
npm install absolutify
```


Usage
-----

```js
var absolutify = require('absolutify')

var html = '<html><a href="/sorensen">Home</a></html>'
var site = 'https://github.com'

var parsed = absolutify(html, site)
// '<html><a href="https://github.com/sorensen">Home</a></html>'

var byFunction = absolutify(html, function(url, attrName) {
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
