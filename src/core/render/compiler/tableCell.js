export const tableCellCompiler = ({ renderer }) =>
  (renderer.tablecell = function (token) {
    let content;

    if (token.embedTokens && token.embedTokens.length > 0) {
      content = this.parser.parse(token.embedTokens);
    } else {
      content = this.parser.parseInline(token.tokens);
    }

    const type = token.header ? 'th' : 'td';
    const tag = token.align ? `<${type} align="${token.align}">` : `<${type}>`;

    return tag + content + `</${type}>\n`;
  });
