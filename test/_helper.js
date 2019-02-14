// load ES6 modules in Node.js on the fly
require = require('esm')(module/*, options*/)

const {expect} = require('chai')

const {JSDOM} = require('jsdom')
const XMLHttpRequest = require('xhr2') // JSDOM doesn't support XMLHttpRequest
// TODO: try to fix tests when using `<div id="app"></div>` in body
const markup = `<!DOCTYPE html>
<html>
  <head></head>
  <body></body>
</html>`
// TODO: this may not work if tests are mutate the DOM, instead a new instance needs to be created
// for every test case but that will slow down the tests
const dom = new JSDOM(markup) 

global.window = dom.window
global.document = dom.window.document
global.navigator = dom.window.navigator
global.location = dom.window.location
global.XMLHttpRequest = XMLHttpRequest

const {initMixin} = require('../src/core/init')
const {routerMixin} = require('../src/core//router')
const {renderMixin} = require('../src/core//render')
const {fetchMixin} = require('../src/core/fetch')
const {eventMixin} = require('../src/core//event')

// mimic src/core/index.js but for Node.js

function Docsify() {
  this._init()
}

const proto = Docsify.prototype

initMixin(proto)
routerMixin(proto)
renderMixin(proto)
fetchMixin(proto)
eventMixin(proto)

function ready(callback) {
  const state = document.readyState

  if (state === 'complete' || state === 'interactive') {
    return setTimeout(callback, 0)
  }

  document.addEventListener('DOMContentLoaded', callback)
}
let docsify = null
module.exports.init = function(callback) {
	return new Promise((resolve, reject) => {
		// return cached version / TODO: see above: this might not scale, new instance of JSDOM is reqiured
		if (docsify != null) {
			return resolve(docsify)
		}
		ready(_ => {
			docsify = new Docsify()
			return resolve(docsify)
		})
		
	})
}
module.exports.expectSameDom = function(actual, expected) {
	const WHITESPACES_BETWEEN_TAGS = />(\s\s+)</g
	function replacer(match, group1) {
		return match.replace(group1, '')
	}
	expect(actual.replace(WHITESPACES_BETWEEN_TAGS, replacer).trim())
	.equal(expected.replace(WHITESPACES_BETWEEN_TAGS, replacer).trim())
}
