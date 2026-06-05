export const tableCellCompiler = ({ renderer }) =>
  (renderer.tablecell = function (token) {
    let content;

    if (token.embedTokenMap && token.tokens?.length) {
      // Preserve mixed content order: render inline tokens, replacing include links by position.
      content = '';
      token.tokens.forEach((inlineToken, inlineIndex) => {
        const embedToken = token.embedTokenMap[inlineIndex];
        if (embedToken?.length) {
          content += this.parser.parse(embedToken);
        } else {
          content += this.parser.parseInline([inlineToken]);
        }
      });
    } else if (token.embedTokens && token.embedTokens.length > 0) {
      content = this.parser.parse(token.embedTokens);
    } else {
      content = this.parser.parseInline(token.tokens);
    }

    const type = token.header ? 'th' : 'td';
    const tag = token.align ? `<${type} align="${token.align}">` : `<${type}>`;

    return tag + content + `</${type}>\n`;
  });
