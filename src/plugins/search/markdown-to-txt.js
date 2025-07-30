/**
 * This is a function to convert markdown to txt based on markedjs v13+.
 * Copies the escape/unescape functions from [lodash](https://www.npmjs.com/package/lodash) instead import to reduce the size.
 */
import { marked } from 'marked';

const reEscapedHtml = /&(?:amp|lt|gt|quot|#(0+)?39);/g;
const reHasEscapedHtml = RegExp(reEscapedHtml.source);
const htmlUnescapes = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
};

function unescape(string) {
  return string && reHasEscapedHtml.test(string)
    ? string.replace(reEscapedHtml, entity => htmlUnescapes[entity] || "'")
    : string || '';
}

const reUnescapedHtml = /[&<>"']/g;
const reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
const htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escape(string) {
  return string && reHasUnescapedHtml.test(string)
    ? string.replace(reUnescapedHtml, chr => htmlEscapes[chr])
    : string || '';
}

function helpersCleanup(string) {
  return string && string.replace('!>', '').replace('?>', '');
}

const markdownToTxtRenderer = {
  space() {
    return '';
  },

  code({ text }) {
    const code = text.replace(/\n$/, '');
    return escape(code);
  },

  blockquote({ tokens }) {
    return this.parser?.parse(tokens) || '';
  },

  html() {
    return '';
  },

  heading({ tokens }) {
    return this.parser?.parseInline(tokens) || '';
  },

  hr() {
    return '';
  },

  list(token) {
    let body = '';
    for (let j = 0; j < token.items.length; j++) {
      const item = token.items[j];
      body += this.listitem?.(item);
    }

    return body;
  },

  listitem(item) {
    let itemBody = '';
    if (item.task) {
      const checkbox = this.checkbox?.({ checked: !!item.checked });
      if (item.loose) {
        if (item.tokens.length > 0 && item.tokens[0].type === 'paragraph') {
          item.tokens[0].text = checkbox + ' ' + item.tokens[0].text;
          if (
            item.tokens[0].tokens &&
            item.tokens[0].tokens.length > 0 &&
            item.tokens[0].tokens[0].type === 'text'
          ) {
            item.tokens[0].tokens[0].text =
              checkbox + ' ' + item.tokens[0].tokens[0].text;
          }
        } else {
          item.tokens.unshift({
            type: 'text',
            raw: checkbox + ' ',
            text: checkbox + ' ',
          });
        }
      } else {
        itemBody += checkbox + ' ';
      }
    }

    itemBody += this.parser?.parse(item.tokens, !!item.loose);

    return `${itemBody || ''}`;
  },

  checkbox() {
    return '';
  },

  paragraph({ tokens }) {
    return this.parser?.parseInline(tokens) || '';
  },

  table(token) {
    let header = '';

    let cell = '';
    for (let j = 0; j < token.header.length; j++) {
      cell += this.tablecell?.(token.header[j]);
    }
    header += this.tablerow?.({ text: cell });

    let body = '';
    for (let j = 0; j < token.rows.length; j++) {
      const row = token.rows[j];

      cell = '';
      for (let k = 0; k < row.length; k++) {
        cell += this.tablecell?.(row[k]);
      }

      body += this.tablerow?.({ text: cell });
    }

    return header + ' ' + body;
  },

  tablerow({ text }) {
    return text;
  },

  tablecell(token) {
    return this.parser?.parseInline(token.tokens) || '';
  },

  strong({ text }) {
    return text;
  },

  em({ tokens }) {
    return this.parser?.parseInline(tokens) || '';
  },

  codespan({ text }) {
    return text;
  },

  br() {
    return ' ';
  },

  del({ tokens }) {
    return this.parser?.parseInline(tokens);
  },

  link({ tokens, href, title }) {
    // Remain the href and title attributes for searching, so is the image
    // e.g. [filename](_media/example.js ':include :type=code :fragment=demo')
    // Result: filename _media/example.js :include :type=code :fragment=demo
    return `${this.parser?.parseInline(tokens) || ''} ${href || ''} ${title || ''}`;
  },

  image({ title, text, href }) {
    return `${text || ''} ${href || ''} ${title || ''}`;
  },

  text(token) {
    return token.tokens
      ? this.parser?.parseInline(token.tokens) || ''
      : token.text || '';
  },
};
const _marked = marked.setOptions({ renderer: markdownToTxtRenderer });

export function markdownToTxt(markdown) {
  const unmarked = _marked.parse(markdown);
  const unescaped = unescape(unmarked);
  const helpersCleaned = helpersCleanup(unescaped);
  return helpersCleaned.trim();
}

export default markdownToTxt;
