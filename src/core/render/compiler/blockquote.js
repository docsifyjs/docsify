export const blockquoteCompiler = ({ renderer, compiler }) =>
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

        // Avoid mutating tokens that may be reused from the Prerender cache.
        tokens = tokens.slice();
        const paragraph = { ...firstParagraph };
        if (firstParagraph.tokens) {
          paragraph.tokens = firstParagraph.tokens.map(t => ({ ...t }));
        }
        tokens[firstParagraphIndex] = paragraph;

        // Remove the callout mark from the paragraph raw text
        paragraph.raw = paragraph.raw.replace(calloutMark, '').trimStart();
        if (paragraph.tokens && paragraph.tokens.length > 0) {
          paragraph.tokens.forEach(t => {
            if (t.raw) {
              t.raw = t.raw.replace(calloutMark, '');
            }
            if (t.text) {
              t.text = t.text.replace(calloutMark, '');
            }
          });
        }

        // If the first paragraph is now empty after removing [!TIP], remove it
        if (!paragraph.raw.trim()) {
          tokens.splice(firstParagraphIndex, 1);
        }

        openTag = `<div class="callout ${calloutType}">`;
        closeTag = `</div>`;
      }
    }

    compiler.blockquoteDepth++;
    let body = '';

    try {
      body = this.parser.parse(tokens);
    } finally {
      compiler.blockquoteDepth--;
    }

    return `${openTag}${body}${closeTag}`;
  });
