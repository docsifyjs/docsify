import { stripIndent } from 'common-tags';
import { get } from '../util/ajax.js';

const cached = {};

/**
 * Extracts the content between matching fragment markers in the text.
 *
 * Supported markers:
 * - ### [fragment] ... ### [fragment]
 * - /// [fragment] ... /// [fragment]
 *
 * @param {string} text - The input text that may contain embedded fragments.
 * @param {string} fragment - The fragment identifier to search for.
 * @param {boolean} fullLine - Boolean flag to enable full-line matching of fragment identifiers.
 * @returns {string} - The extracted and demented content, or an empty string if not found.
 */
function extractFragmentContent(text, fragment, fullLine) {
  if (!fragment) {
    return text;
  }
  let fragmentRegex = `(?:###|\\/\\/\\/)\\s*\\[${fragment}\\]`;
  const contentRegex = `[\\s\\S]*?`;
  if (fullLine) {
    // Match full line for fragment
    fragmentRegex = `.*${fragmentRegex}.*\n`;
  }
  const pattern = new RegExp(
    `(?:${fragmentRegex})(${contentRegex})(?:${fragmentRegex})`,
  ); // content is the capture group
  const match = text.match(pattern);
  return stripIndent((match || [])[1] || '').trim();
}

function walkFetchEmbed({ embedTokens, compile, fetch }, cb) {
  let token;
  let step = 0;
  let count = 0;

  if (!embedTokens.length) {
    return cb({});
  }

  while ((token = embedTokens[step++])) {
    const currentToken = token;

    // eslint-disable-next-line no-loop-func
    const next = text => {
      let embedToken;
      if (text) {
        if (currentToken.embed.type === 'markdown') {
          let path = currentToken.embed.url.split('/');
          path.pop();
          path = path.join('/');
          // Resolves relative links to absolute
          text = text.replace(/\[([^[\]]+)\]\(([^)]+)\)/g, x => {
            const linkBeginIndex = x.indexOf('(');
            if (x.slice(linkBeginIndex, linkBeginIndex + 2) === '(.') {
              return (
                x.substring(0, linkBeginIndex) +
                `(${window.location.protocol}//${window.location.host}${path}/` +
                x.substring(linkBeginIndex + 1, x.length - 1) +
                ')'
              );
            }
            return x;
          });

          // This may contain YAML front matter and will need to be stripped.
          const frontMatterInstalled =
            ($docsify.frontMatter || {}).installed || false;
          if (frontMatterInstalled === true) {
            text = $docsify.frontMatter.parseMarkdown(text);
          }

          if (currentToken.embed.fragment) {
            text = extractFragmentContent(
              text,
              currentToken.embed.fragment,
              currentToken.embed.fragmentFullLine,
            );
          }

          embedToken = compile.lexer(text);
        } else if (currentToken.embed.type === 'code') {
          if (currentToken.embed.fragment) {
            text = extractFragmentContent(
              text,
              currentToken.embed.fragment,
              currentToken.embed.fragmentFullLine,
            );
          }

          embedToken = compile.lexer(
            '```' +
              currentToken.embed.lang +
              '\n' +
              text.replace(/`/g, '@DOCSIFY_QM@') +
              '\n```\n',
          );
        } else if (currentToken.embed.type === 'mermaid') {
          embedToken = [
            {
              type: 'html',
              text: /* html */ `<div class="mermaid">\n${text}\n</div>`,
            },
          ];
          embedToken.links = {};
        } else {
          embedToken = [{ type: 'html', text }];
          embedToken.links = {};
        }
      }

      cb({
        token: currentToken,
        embedToken,
        rowIndex: currentToken.rowIndex,
        cellIndex: currentToken.cellIndex,
        tokenRef: currentToken.tokenRef,
      });

      if (++count >= embedTokens.length) {
        cb({});
      }
    };

    if (token.embed.url) {
      get(token.embed.url).then(next);
    } else {
      next(token.embed.html);
    }
  }
}

export function prerenderEmbed({ compiler, raw = '', fetch }, done) {
  const hit = cached[raw];
  if (hit) {
    const copy = hit.slice();
    copy.links = hit.links;
    return done(copy);
  }

  const compile = compiler._marked;
  let tokens = compile.lexer(raw);
  const embedTokens = [];
  const linkRE = compile.Lexer.rules.inline.normal.link;
  const links = tokens.links;

  const linkMatcher = new RegExp(linkRE.source, 'g');

  tokens.forEach((token, index) => {
    if (token.type === 'paragraph') {
      token.text = token.text.replace(
        linkMatcher,
        (src, filename, href, title) => {
          const embed = compiler.compileEmbed(href, title);
          if (embed) {
            embedTokens.push({
              index,
              tokenRef: token,
              embed,
            });
          }
          return src;
        },
      );
    } else if (token.type === 'table') {
      token.rows.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
          cell.text = cell.text.replace(
            linkMatcher,
            (src, filename, href, title) => {
              const embed = compiler.compileEmbed(href, title);
              if (embed) {
                embedTokens.push({
                  index,
                  tokenRef: token,
                  rowIndex,
                  cellIndex,
                  embed,
                });
              }
              return src;
            },
          );
        });
      });
    }
  });

  // keep track of which tokens have been embedded so far
  // so that we know where to insert the embedded tokens as they
  // are returned
  const moves = [];
  walkFetchEmbed(
    { compile, embedTokens, fetch },
    ({ embedToken, token, rowIndex, cellIndex, tokenRef }) => {
      if (token) {
        if (typeof rowIndex === 'number' && typeof cellIndex === 'number') {
          const cell = tokenRef.rows[rowIndex][cellIndex];

          cell.embedTokens = embedToken;
        } else {
          // iterate through the array of previously inserted tokens
          // to determine where the current embedded tokens should be inserted
          let index = token.index;
          moves.forEach(pos => {
            if (index > pos.start) {
              index += pos.length;
            }
          });

          Object.assign(links, embedToken.links);

          tokens = tokens
            .slice(0, index)
            .concat(embedToken, tokens.slice(index + 1));
          moves.push({ start: index, length: embedToken.length - 1 });
        }
      } else {
        cached[raw] = tokens.concat();
        tokens.links = cached[raw].links = links;
        done(tokens);
      }
    },
  );
}
