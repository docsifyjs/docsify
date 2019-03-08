const path = require('path')

const {expect} = require('chai')

const {init, expectSameDom} = require('../_helper')

describe('full docsify initialization', function() {
	it('TODO: check generated markup', async function() {
		const {docsify, dom} = await init('simple', {loadSidebar: true})
  		console.log(dom.window.document.body.innerHTML)
  		// TODO: add some expectations
	})

})
