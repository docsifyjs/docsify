export const blockquoteCompiler = ({ renderer }) =>
  (renderer.blockquote = function ({ tokens }) {
    let openTag = '<blockquote>';
    let closeTag = '</blockquote>';

    // Find the first paragraph token in the blockquote
    const firstParagraphIndex = tokens.findIndex(t => t.type === 'paragraph');
    const firstParagraph = tokens[firstParagraphIndex];

    if (firstParagraph) {
      // Check if the paragraph starts with a callout like [!TIP] or [!NOTE]
      const calloutData = firstParagraph.raw.match(/^(\[!(\w+)\])/);

      if (calloutData) {
        const calloutMark = calloutData[1]; // "[!TIP]"
        const calloutType = calloutData[2].toLowerCase(); // "tip"

        // Remove the callout mark from the paragraph raw text
        firstParagraph.raw = firstParagraph.raw.replace(calloutMark, '').trimStart();
        if (firstParagraph.tokens && firstParagraph.tokens.length > 0) {
          firstParagraph.tokens.forEach(t => {
            if (t.raw) {t.raw = t.raw.replace(calloutMark, '').trimStart();}
            if (t.text) {t.text = t.text.replace(calloutMark, '').trimStart();}
          });
        }

        // If the first paragraph is now empty after removing [!TIP], remove it
        if (!firstParagraph.raw.trim()) {
          tokens.splice(firstParagraphIndex, 1);
        }

        openTag = `<div class="callout ${calloutType}">`;
        closeTag = `</div>`;
      }
    }

    const body = this.parser.parse(tokens);
    return `${openTag}${body}${closeTag}`;
  });
