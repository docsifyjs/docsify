/* eslint-env node, chai, mocha */
require = require('esm')(module/*, options*/)
const {expect} = require('chai')
const {resolvePath} = require('../../src/core/router/util')

describe('router/util', function () {
  it('resolvePath', async function () {
    // WHEN
    const result = resolvePath('hello.md')

    // THEN
    expect(result).equal('/hello.md')
  })

  it('resolvePath with dot', async function () {
    // WHEN
    const result = resolvePath('./hello.md')

    // THEN
    expect(result).equal('/hello.md')
  })

  it('resolvePath with two dots', async function () {
    // WHEN
    const result = resolvePath('test/../hello.md')

    // THEN
    expect(result).equal('/hello.md')
  })
})
