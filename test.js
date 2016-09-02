'use strict';

var assert = require('assert')

describe('absolutify', function() {
  var absolutify = require('./absolutify')

  // Non-changing string, should not get replaced
  var ok = ''
    + '<img src="www.foo.com" />'
    + '<img src="google.com" />'
    + '<img src="http://www.bar.com" />'
    + '<img src="//baz.com" />'

  it('string replace', function() {
    assert.strictEqual(
      absolutify(
        '<a href="/relative">Heyo</a>' + ok
      , 'http://www.example.com'
      )
    , '<a href="http://www.example.com/relative">Heyo</a>' + ok
    )

    assert.strictEqual(
      absolutify(
        '<a href="../relative">Heyo</a>' + ok
      , 'http://www.example.com'
      )
    , '<a href="http://www.example.com/../relative">Heyo</a>' + ok
    )

    assert.strictEqual(
      absolutify(
        '<a href="/">Heyo</a>' + ok
      , 'http://www.example.com'
      )
    , '<a href="http://www.example.com/">Heyo</a>' + ok
    )
  })

  it('string replace single quote', function() {
    assert.strictEqual(
      absolutify(
        "<a href='../relative'>Heyo</a>" + ok
      , 'http://www.example.com'
      )
    , "<a href='http://www.example.com/../relative'>Heyo</a>" + ok
    )
  })

  it('string multi-replace', function() {
    assert.strictEqual(
      absolutify(
        '<a href="/relative">Heyo</a><form action="/index.php">' + ok
      , 'http://www.example.com'
      )
    , '<a href="http://www.example.com/relative">Heyo</a><form action="http://www.example.com/index.php">' + ok
    )
  })

  it('string replace anchor', function() {
    assert.strictEqual(
      absolutify(
        '<a href="#section">Section</a>' + ok
      , 'http://www.example.com'
      )
    , '<a href="http://www.example.com/#section">Section</a>' + ok
    )
  })

  it('function replace', function() {
    assert.strictEqual(
      absolutify(
        '<a href="/relative">Heyo</a>' + ok
      , function(url, attr) {
          return 'http://www.example.com' + url
        }
      )
    , '<a href="http://www.example.com/relative">Heyo</a>' + ok
    )

    assert.strictEqual(
      absolutify(
        '<a href="../two">Heyo</a>' + ok
      , function(url, attr) {
          return 'http://www.example.com/public/' + url
        }
      )
    , '<a href="http://www.example.com/public/../two">Heyo</a>' + ok
    )

    assert.strictEqual(
      absolutify(
        '<a href="./three">Heyo</a>' + ok
      , function(url, attr) {
          return 'http://www.example.com/' + url
        }
      )
    , '<a href="http://www.example.com/./three">Heyo</a>' + ok
    )
  })

  it('function replace anchor', function() {
    assert.strictEqual(
      absolutify(
        '<a href="#section">Section</a>' + ok
      , function(url, attr) {
          return 'http://www.example.com' + url
        }
      )
    , '<a href="http://www.example.com#section">Section</a>' + ok
    )
  })

  it('function multi-replace', function() {
    assert.strictEqual(
      absolutify(
        '<a href="/relative">Heyo</a><form action="/index.php">' + ok
      , function(url, attr) {
          return 'http://www.example.com' + url
        }
      )
    , '<a href="http://www.example.com/relative">Heyo</a><form action="http://www.example.com/index.php">' + ok
    )
  })
})
