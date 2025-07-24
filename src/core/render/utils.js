/**
 * Converts a colon formatted string to a object with properties.
 *
 * This is process a provided string and look for any tokens in the format
 * of `:name[=value]` and then convert it to a object and return.
 * An example of this is ':include :type=code :fragment=demo' is taken and
 * then converted to:
 *
 * ```
 * {
 *  include: '',
 *  type: 'code',
 *  fragment: 'demo'
 * }
 * ```
 *
 * @param {string}   str   The string to parse.
 *
 * @return {{str: string, config: object}} The original string formatted, and parsed object, { str, config }.
 */
export function getAndRemoveConfig(str = '') {
  const config = {};

  if (str) {
    str = str
      .replace(/^('|")/, '')
      .replace(/('|")$/, '')
      .replace(/(?:^|\s):([\w-]+:?)=?([\w-%]+)?/g, (m, key, value) => {
        if (key.indexOf(':') !== -1) {
          return m;
        }

        value = (value && value.replace(/&quot;/g, '')) || true;

        if (value !== true && config[key] !== undefined) {
          if (!Array.isArray(config[key]) && value !== config[key]) {
            config[key] = [config[key]];
          }
          config[key].includes(value) || config[key].push(value);
        } else {
          config[key] = value;
        }
        return '';
      })
      .trim();
  }

  return { str, config };
}

/**
 * Remove the <a> tag from sidebar when the header with link, details see issue 1069
 * @param {string}   str   The string to deal with.
 *
 * @return {string}   The string after delete the <a> element.
 */
export function removeAtag(str = '') {
  return str.replace(/(<\/?a.*?>)/gi, '');
}

/**
 * Remove the docsifyIgnore configs and return the str
 * @param {string}   content   The string to deal with.
 *
 * @return {{content: string, ignoreAllSubs: boolean, ignoreSubHeading: boolean}} The string after delete the docsifyIgnore configs, and whether to ignore some or all.
 */
export function getAndRemoveDocsifyIgnoreConfig(content = '') {
  let ignoreAllSubs, ignoreSubHeading;
  if (/<!-- {docsify-ignore} -->/g.test(content)) {
    content = content.replace('<!-- {docsify-ignore} -->', '');
    ignoreSubHeading = true;
  }

  if (/{docsify-ignore}/g.test(content)) {
    content = content.replace('{docsify-ignore}', '');
    ignoreSubHeading = true;
  }

  if (/<!-- {docsify-ignore-all} -->/g.test(content)) {
    content = content.replace('<!-- {docsify-ignore-all} -->', '');
    ignoreAllSubs = true;
  }

  if (/{docsify-ignore-all}/g.test(content)) {
    content = content.replace('{docsify-ignore-all}', '');
    ignoreAllSubs = true;
  }

  return { content, ignoreAllSubs, ignoreSubHeading };
}

/**
 * Unwraps <p> tags that directly wrap a single <a> tag inside <li> elements at the top level.
 *
 * This function processes an HTML string and removes <p> wrappers inside <li> elements
 * when the <p> contains exactly one <a> element and no other content.
 *
 * It does NOT process nested structures.
 *
 * @see https://github.com/markedjs/marked/issues/1461
 * @param {string} html - The HTML string to transform.
 * @returns {string} - The transformed HTML with <p> removed from <li><p><a></a></p></li> structures.
 */
export function maybeUnwrapTopLevelPWithA(html) {
  // Only unwrap if the pattern <li><p><a exists
  if (!html.includes('<li><p><a')) {
    return html;
  }

  const template = document.createElement('template');
  template.innerHTML = html;

  template.content.querySelectorAll('li').forEach(li => {
    const first = li.firstElementChild;
    if (
      first?.tagName === 'P' &&
      first.children.length === 1 &&
      first.firstElementChild.tagName === 'A' &&
      first.childNodes.length === 1
    ) {
      // Replace the <p> with the <a> inside it
      li.replaceChild(first.firstElementChild, first);
    }
  });

  return template.innerHTML;
}
