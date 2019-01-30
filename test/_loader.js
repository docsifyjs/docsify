require = require('esm')(module/*, options*/)
const {JSDOM} = require('jsdom')
const dom = new JSDOM('<!DOCTYPE html><body></body>')

global.window = dom.window
global.document = dom.window.document
global.navigator = dom.window.navigator
global.location = dom.window.location

require('../src/core')
