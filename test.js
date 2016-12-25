'use strict';

var assert = require('assert')

describe('absolutify', function() {
  var absolutify = require('./absolutify')

  // Non-changing string, should not get replaced
  var ok = ''
    + '<a href="ftp://www.foo.com" />'
    + '<a href="mailto:hello@google.com" />'
    + '<img src="http://www.bar.com" />'
    + '<img src="//baz.com" />'
    + '<a href="file:///Users/home/file.txt" />'
    + '<img src="data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCch" />'

  describe('string replace', function() {
    it('ignores valid values', function() {
      assert.strictEqual(
        absolutify(ok, 'http://www.example.com')
      , ok
      )
    })

    it('/url', function() {
      assert.strictEqual(
        absolutify(
          '<a href="/relative">Heyo</a>'
        , 'http://www.example.com'
        )
      , '<a href="http://www.example.com/relative">Heyo</a>'
      )
  })

  it('../url', function() {
      assert.strictEqual(
        absolutify(
          '<a href="../relative">Heyo</a>'
        , 'http://www.example.com'
        )
      , '<a href="http://www.example.com/../relative">Heyo</a>'
      )
    })

    it('/', function() {
      assert.strictEqual(
        absolutify(
          '<a href="/">Heyo</a>'
        , 'http://www.example.com'
        )
      , '<a href="http://www.example.com/">Heyo</a>'
      )
    })

    it(':port/url', function() {
      assert.strictEqual(
        absolutify(
          '<a href="/index.php">Section</a>'
        , 'http://www.example.com:80'
        )
      , '<a href="http://www.example.com:80/index.php">Section</a>'
      )
    })

    it('#anchor', function() {
      assert.strictEqual(
        absolutify(
          '<a href="#section">Section</a>'
        , 'http://www.example.com'
        )
      , '<a href="http://www.example.com/#section">Section</a>'
      )
    })

    it('url.ext', function() {
      assert.strictEqual(
        absolutify(
          '<a href="index.php">Section</a>'
        , 'http://www.example.com'
        )
      , '<a href="http://www.example.com/index.php">Section</a>'
      )
    })

    it('url/dir/file.ext', function() {
      assert.strictEqual(
        absolutify(
          '<a href="nested/dir/index.php">Section</a>'
        , 'http://www.example.com'
        )
      , '<a href="http://www.example.com/nested/dir/index.php">Section</a>'
      )
    })

    it('mailto.ext', function() {
      assert.strictEqual(
        absolutify(
          '<a href="mailtofoobar.ico">Section</a>'
        , 'http://www.example.com'
        )
      , '<a href="http://www.example.com/mailtofoobar.ico">Section</a>'
      )
    })

    it('file.ext', function() {
      assert.strictEqual(
        absolutify(
          '<a href="file.php">Section</a>'
        , 'http://www.example.com'
        )
      , '<a href="http://www.example.com/file.php">Section</a>'
      )
    })

    it('../url (quote test)', function() {
      assert.strictEqual(
        absolutify(
          "<a href='../relative'>Heyo</a>"
        , 'http://www.example.com'
        )
      , "<a href='http://www.example.com/../relative'>Heyo</a>"
      )
    })

    it('multi-replace', function() {
      assert.strictEqual(
        absolutify(
          '<a href="/relative">Heyo</a><form action="/index.php">'
        , 'http://www.example.com'
        )
      , '<a href="http://www.example.com/relative">Heyo</a><form action="http://www.example.com/index.php">'
      )
    })

    it('/url?querystring[]=val', function() {
      assert.strictEqual(
        absolutify(
          '<a archive="/relative?foo[]=bar&cat=meow">Heyo</a>'
        , 'http://www.example.com'
        )
      , '<a archive="http://www.example.com/relative?foo[]=bar&cat=meow">Heyo</a>'
      )
    })
  })

  describe('function replace', function() {
    it('ignores valid urls', function() {
      assert.strictEqual(
        absolutify(ok, function(url, attr) {
          return 'http://www.example.com' + url
        })
      , ok
      )
    })

    it('/url', function() {
      assert.strictEqual(
        absolutify(
          '<a profile="/relative">Heyo</a>'
        , function(url, attr, full) {
            assert.strictEqual(url, 'relative')
            assert.strictEqual(attr, 'profile')
            assert.strictEqual(full, '/relative')
            return 'http://www.example.com/' + url
          }
        )
      , '<a profile="http://www.example.com/relative">Heyo</a>'
      )
    })

    it('/url?querystring[]=val', function() {
      assert.strictEqual(
        absolutify(
          '<a archive="/relative?foo[]=bar&cat=meow">Heyo</a>'
        , function(url, attr, full) {
            assert.strictEqual(url, 'relative?foo[]=bar&cat=meow')
            assert.strictEqual(attr, 'archive')
            assert.strictEqual(full, '/relative?foo[]=bar&cat=meow')
            return 'http://www.example.com/' + url
          }
        )
      , '<a archive="http://www.example.com/relative?foo[]=bar&cat=meow">Heyo</a>'
      )
    })

    it('/', function() {
      assert.strictEqual(
        absolutify(
          '<a profile="/">Heyo</a>'
        , function(url, attr, full) {
            assert.strictEqual(url, '')
            assert.strictEqual(attr, 'profile')
            assert.strictEqual(full, '/')
            return 'http://www.example.com/' + url
          }
        )
      , '<a profile="http://www.example.com/">Heyo</a>'
      )
    })

    it('../url', function() {
      assert.strictEqual(
        absolutify(
          '<img src="../two">'
        , function(url, attr) {
            assert.strictEqual(url, '../two')
            assert.strictEqual(attr, 'src')
            return 'http://www.example.com/public/' + url
          }
        )
      , '<img src="http://www.example.com/public/../two">'
      )
    })

    it('./url', function() {
      assert.strictEqual(
        absolutify(
          '<a href="./three">Heyo</a>'
        , function(url, attr, full) {
            assert.strictEqual(url, './three')
            assert.strictEqual(full, './three')
            assert.strictEqual(attr, 'href')
            return 'http://www.example.com/' + url
          }
        )
      , '<a href="http://www.example.com/./three">Heyo</a>'
      )
    })

    it('#anchor', function() {
      assert.strictEqual(
        absolutify(
          '<a href="#section">Section</a>'
        , function(url, attr, full) {
            assert.strictEqual(url, '#section')
            assert.strictEqual(full, '#section')
            assert.strictEqual(attr, 'href')
            return 'http://www.example.com' + url
          }
        )
      , '<a href="http://www.example.com#section">Section</a>'
      )
    })

    it('url.ext', function() {
      assert.strictEqual(
        absolutify(
          '<a href="index.php">Section</a>'
        , function(url, attr, full) {
            assert.strictEqual(url, 'index.php')
            assert.strictEqual(full, 'index.php')
            assert.strictEqual(attr, 'href')
            return 'http://www.example.com/' + url
          }
        )
      , '<a href="http://www.example.com/index.php">Section</a>'
      )
    })

    it('/url.ext', function() {
      assert.strictEqual(
        absolutify(
          '<a href="/index.php">Section</a>'
        , function(url, attr, full) {
            assert.strictEqual(url, 'index.php')
            assert.strictEqual(full, '/index.php')
            assert.strictEqual(attr, 'href')
            return 'http://www.example.com/' + url
          }
        )
      , '<a href="http://www.example.com/index.php">Section</a>'
      )
    })

    it('url/dir/file.ext', function() {
      assert.strictEqual(
        absolutify(
          '<a href="nested/dir/index.php">Section</a>'
        , function(url, attr) {
            assert.strictEqual(url, 'nested/dir/index.php')
            assert.strictEqual(attr, 'href')
            return 'http://www.example.com/' + url
          }
        )
      , '<a href="http://www.example.com/nested/dir/index.php">Section</a>'
      )
    })

    it('multi-replace', function() {
      assert.strictEqual(
        absolutify(
          '<a href="/relative">Heyo</a><form action="/index.php">'
        , function(url, attr) {
            // assert.strictEqual(url, '/relative')
            // assert.strictEqual(attr, 'href')
            return 'http://www.example.com/' + url
          }
        )
      , '<a href="http://www.example.com/relative">Heyo</a><form action="http://www.example.com/index.php">'
      )
    })
  })
})
