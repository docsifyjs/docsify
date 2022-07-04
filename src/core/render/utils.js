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
 * @return {object}  The original string and parsed object, { str, config }.
 */
export function getAndRemoveConfig(str = '') {
  const config = {};

  if (str) {
    str = str
      .replace(/&quot;/g, '"')
      .replace(
        /(?:^|\s):([\w-]+:?)=?([\w-%]+|"[^"]*")?/g, // Note: because the provided `str` argument has been html-escaped, with backslashes stripped, we cannot support escaped characters in quoted strings :-(
        (m, key, value) => {
          if (key.indexOf(':') === -1) {
            config[key] = (value && value.replace(/"/g, '')) || true;
            return '';
          }

          return m;
        }
      )
      .replace(/^('|")|('|")$/g, '')
      .replace(/"/g, '&quot;')
      .trim();
  }

  return { str, config };
}

/**
 * Remove the <a> tag from sidebar when the header with link, details see issue 1069
 * @param {string}   str   The string to deal with.
 *
 * @return {string}   str   The string after delete the <a> element.
 */
export function removeAtag(str = '') {
  return str.replace(/(<\/?a.*?>)/gi, '');
}
