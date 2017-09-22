/**
 * Fork https://github.com/egoist/docute/blob/master/src/utils/front-matter.js
 */
/* eslint-disable */
import parser from './yaml'

var optionalByteOrderMark = '\\ufeff?'
var pattern =
  '^(' +
  optionalByteOrderMark +
  '(= yaml =|---)' +
  '$([\\s\\S]*?)' +
  '(?:\\2|\\.\\.\\.)' +
  '$' +
  '' +
  '(?:\\n)?)'
// NOTE: If this pattern uses the 'g' flag the `regex` variable definition will
// need to be moved down into the functions that use it.
var regex = new RegExp(pattern, 'm')

function extractor(string) {
  string = string || ''

  var lines = string.split(/(\r?\n)/)
  if (lines[0] && /= yaml =|---/.test(lines[0])) {
    return parse(string)
  } else {
    return { attributes: {}, body: string }
  }
}

function parse(string) {
  var match = regex.exec(string)

  if (!match) {
    return {
      attributes: {},
      body: string
    }
  }

  var yaml = match[match.length - 1].replace(/^\s+|\s+$/g, '')
  var attributes = parser(yaml) || {}
  var body = string.replace(match[0], '')

  return { attributes: attributes, body: body, frontmatter: yaml }
}

function test(string) {
  string = string || ''

  return regex.test(string)
}

export default extractor
