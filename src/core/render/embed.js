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
 * @returns {string} - The extracted and dedented content, or an empty string if not found.
 */
function extractFragmentContent(text, fragment, fullLine) {
  if (!fragment) {
    return text;
  }
  let fragmentRegex = `(?:###|\\/\\/\\/)\\s*\\[${fragment}\\]`;
  const contentRegex = `[\\s\\S]*?`;
  if (fullLine) {
    // Match full line containing fragment identifier (e.g. /// [demo])
    fragmentRegex = `.*${fragmentRegex}.*\n`;
  }
  const pattern = new RegExp(
    `(?:${fragmentRegex})(${contentRegex})(?:${fragmentRegex})`,
  ); // content is the capture group
  const match = text.match(pattern);
  return stripIndent((match || [])[1] || '').trim();
}

function walkFetchEmbed({ embedTokens, compile, fetch, frontMatter }, cb) {
  if (!embedTokens.length) {
    return cb({});
  }

  const processStep = step => {
    const currentToken = embedTokens[step];

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
          const frontMatterInstalled = frontMatter?.installed;
          if (frontMatterInstalled) {
            text = frontMatter?.parseMarkdown(text);
          }

          if (currentToken.embed.fragment) {
            text = extractFragmentContent(
              text,
              currentToken.embed.fragment,
              currentToken.embed.omitFragmentLine,
            );
          }

          embedToken = compile.lexer(text);
        } else if (currentToken.embed.type === 'code') {
          if (currentToken.embed.fragment) {
            text = extractFragmentContent(
              text,
              currentToken.embed.fragment,
              currentToken.embed.omitFragmentLine,
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
          /** @type {any} */ (embedToken).links = {};
        } else {
          embedToken = [{ type: 'html', text }];
          /** @type {any} */ (embedToken).links = {};
        }
      }

      cb({
        token: currentToken,
        embedToken,
        rowIndex: currentToken.rowIndex,
        cellIndex: currentToken.cellIndex,
        tokenRef: currentToken.tokenRef,
      });

      if (step + 1 >= embedTokens.length) {
        cb({});
      } else {
        processStep(step + 1);
      }
    };

    if (currentToken.embed.url) {
      get(currentToken.embed.url).then(next, () => next());
    } else {
      next(currentToken.embed.html);
    }
  };

  processStep(0);
}

export function prerenderEmbed({ compiler, raw = '', fetch }, done) {
  const hit = cached[raw];
  if (hit) {
    const copy = hit.slice();
    copy.links = hit.links;
    return done(copy);
  }

  const compile = compiler._marked;
  const frontMatter = compiler.config.frontMatter;
  let tokens = compile.lexer(raw);
  const embedTokens = [];
  const links = tokens.links;

  tokens.forEach((token, index) => {
    if (token.type === 'paragraph') {
      (token.tokens || []).forEach(
        (
          /** @type {{ type: string; href: any; title: any; }} */ inlineToken,
          inlineIndex,
        ) => {
          if (inlineToken.type !== 'link') {
            return;
          }

          const embed = compiler.compileEmbed(
            inlineToken.href,
            inlineToken.title,
          );
          if (embed) {
            embedTokens.push({
              index,
              tokenRef: token,
              inlineIndex,
              embed,
            });
          }
        },
      );
    } else if (token.type === 'table') {
      token.rows.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
          (cell.tokens || []).forEach((inlineToken, inlineIndex) => {
            if (inlineToken.type !== 'link') {
              return;
            }

            const embed = compiler.compileEmbed(
              inlineToken.href,
              inlineToken.title,
            );
            if (embed) {
              embedTokens.push({
                index,
                tokenRef: token,
                rowIndex,
                cellIndex,
                inlineIndex,
                embed,
              });
            }
          });
        });
      });
    }
  });

  // keep track of which tokens have been embedded so far
  // so that we know where to insert the embedded tokens as they
  // are returned
  const moves = [];
  const tokenInsertState = new WeakMap();
  walkFetchEmbed(
    { compile, embedTokens, fetch, frontMatter },
    ({ embedToken, token, rowIndex, cellIndex, tokenRef }) => {
      if (token && embedToken) {
        Object.assign(links, embedToken.links);

        if (typeof rowIndex === 'number' && typeof cellIndex === 'number') {
          const cell = tokenRef.rows[rowIndex][cellIndex];
          if (typeof token.inlineIndex === 'number') {
            cell.embedTokenMap ||= {};
            const existing = cell.embedTokenMap[token.inlineIndex];
            cell.embedTokenMap[token.inlineIndex] = existing
              ? existing.concat(embedToken)
              : embedToken;
          }

          // Keep the flattened array for backward compatibility with older render paths.
          if (cell.embedTokens && cell.embedTokens.length) {
            cell.embedTokens = cell.embedTokens.concat(embedToken);
          } else {
            cell.embedTokens = embedToken;
          }
        } else if (tokenRef.type === 'paragraph') {
          if (typeof token.inlineIndex === 'number') {
            tokenRef.embedTokenMap ||= {};
            const existing = tokenRef.embedTokenMap[token.inlineIndex];
            tokenRef.embedTokenMap[token.inlineIndex] = existing
              ? existing.concat(embedToken)
              : embedToken;
          }

          // Keep a flattened form as a fallback for custom renderers.
          if (tokenRef.embedTokens && tokenRef.embedTokens.length) {
            tokenRef.embedTokens = tokenRef.embedTokens.concat(embedToken);
          } else {
            tokenRef.embedTokens = embedToken;
          }
        } else {
          const state = tokenInsertState.get(tokenRef);

          if (state) {
            const insertAt = state.nextIndex;

            tokens = tokens
              .slice(0, insertAt)
              .concat(embedToken, tokens.slice(insertAt));
            moves.push({ start: insertAt, delta: embedToken.length });
            state.nextIndex = insertAt + embedToken.length;
          } else {
            // iterate through the array of previously inserted tokens
            // to determine where the current embedded tokens should be inserted
            let index = token.index;
            moves.forEach(pos => {
              if (index > pos.start) {
                index += pos.delta;
              }
            });

            tokens = tokens
              .slice(0, index)
              .concat(embedToken, tokens.slice(index + 1));
            moves.push({ start: index, delta: embedToken.length - 1 });
            tokenInsertState.set(tokenRef, {
              nextIndex: index + embedToken.length,
            });
          }
        }
      } else if (!token) {
        cached[raw] = tokens.concat();
        tokens.links = cached[raw].links = links;
        done(tokens);
      }
    },
  );
}
