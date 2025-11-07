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

      openTag = `<div class="callout ${calloutType}">`;
      closeTag = `</div>`;
    }

    const body = this.parser.parse(tokens);
    return `${openTag}${body}${closeTag}`;
  });
