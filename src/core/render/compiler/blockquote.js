export const blockquoteCompiler = ({ renderer }) =>
  (renderer.blockquote = function ({ tokens }) {
    const calloutData =
      tokens[0].type === 'paragraph' &&
      // 0: Match "[!TIP] My Title"
      // 1: Mark "[!TIP]"
      // 2: Type "TIP"
      tokens[0].raw.match(/^(\[!(\w+)\])/);

    let openTag = '<blockquote>';
    let closeTag = '</blockquote>';

    if (calloutData) {
      const calloutMark = calloutData[1]; // "[!TIP]"
      const calloutType = calloutData[2].toLowerCase(); // "tip"
      const token = tokens[0].tokens[0];

      // Remove callout mark from tokens
      ['raw', 'text'].forEach(key => {
        token[key] = token[key].replace(calloutMark, '').trimStart();
      });

      // Remove empty paragraph
      if (tokens.length > 1 && !token.raw.trim()) {
        tokens = tokens.slice(1);
      }

      openTag = `<div class="callout ${calloutType}">`;
      closeTag = `</div>`;
    }

    const body = this.parser.parse(tokens);
    const html = `${openTag}${body}${closeTag}`;

    return html;
  });
