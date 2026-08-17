/**
 * Fork https://github.com/egoist/docute/blob/master/src/utils/front-matter.js
 */
/* eslint-disable */
import parser from './yaml.js';

const optionalByteOrderMark = '\\ufeff?';
const pattern =
  '^(' +
  optionalByteOrderMark +
  '(= yaml =|---)' +
  '$([\\s\\S]*?)' +
  '(?:\\2|\\.\\.\\.)' +
  '$' +
  '' +
  '(?:\\n)?)';
// NOTE: If this pattern uses the 'g' flag the `regex` variable definition will
// need to be moved down into the functions that use it.
const regex = new RegExp(pattern, 'm');

function extractor(string) {
  string = string || '';

  const lines = string.split(/(\r?\n)/);
  if (lines[0] && /= yaml =|---/.test(lines[0])) {
    return parse(string);
  } else {
    return { attributes: {}, body: string };
  }
}

function parse(string) {
  const match = regex.exec(string);

  if (!match) {
    return {
      attributes: {},
      body: string,
    };
  }

  const yaml = match[match.length - 1].replace(/^\s+|\s+$/g, '');
  const attributes = parser(yaml) || {};
  const body = string.replace(match[0], '');

  return { attributes: attributes, body: body, frontmatter: yaml };
}

export default extractor;
