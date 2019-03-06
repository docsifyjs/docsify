const path = require('path')

const {expect} = require('chai')

const {init, expectSameDom} = require('../_helper')

describe('router', function() {
	it('TODO: trigger to load another page', async function() {
		const {docsify} = await init()
  		window.location = '/?foo=bar'
  		// TODO: add some expectations
	})

})
