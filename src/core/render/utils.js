/**
 * Converts a colon formatted string to a object with properties.
 *
 * This is process a provided string and look for any tokens in the format
 * of `:name[=value]` and then convert it to a object and return.
 * An example of this is ':include :type=code :fragment=demo' is taken and
 * then converted to:
 *
 * Specially the extra values following a key, such as `:propKey=propVal additinalProp1 additinalProp2`
 * or `:propKey propVal additinalProp1 additinalProp2`, those additional values will be appended to the key with `_appened_props` suffix
 * as the additional props for the key.
 * the example above, its result will be `{ propKey: propVal, propKey_appened_props: 'additinalProp1 additinalProp2' }`
 *
 * ```
 * [](_media/example.html ':include :type=code text :fragment=demo :class=foo bar bee')
 * {
 *  include: '',
 *  type: 'code',
 *  type_appened_props: 'text',
 *  fragment: 'demo',
 *  class: 'foo',
 *  class_appened_props: 'bar bee'
 * }
 * ```
 *
 * Any invalid config keys will be logged warning to the console intead of swallow them silently.
 *
 * @param {string}   str   The string to parse.
 *
 * @return {{str: string, config: object}} The string after parsed the config, and the parsed configs.
 */
export function getAndRemoveConfig(str = '') {
  const config = {};

  if (str) {
    return lexer(str.trim());
  }

  return { str, config };
}

const lexer = function (str) {
  const FLAG = ':';
  const EQUIL = '=';
  const tokens = str.split('');
  const configs = {};
  let cur = 0;
  let startConfigsStringQuote = '';
  let startConfigsStringIndex = -1;
  let endConfigsStringIndex = -1;

  const scanner = function (token) {
    if (isAtEnd()) {
      return;
    }

    if (isBlank(token)) {
      return;
    }
    if (token !== FLAG) {
      return;
    }

    let curToken = '';
    const start = cur - 1;

    // Eat the most close start '/" if it exists.
    // The special case is the :id config in heading, which is without quotes wrapped.
    if (startConfigsStringIndex === -1) {
      const possibleStartQuoteIndex = findPossiableStartQuote(start);
      const possibleStartQuote = tokens[possibleStartQuoteIndex];

      if (possibleStartQuoteIndex !== -1) {
        const possibleEndQuoteIndex = findPossiableEndQuote(
          start,
          possibleStartQuote,
        );

        if (!possibleStartQuote) {
          return;
        }

        const possibleEndQuote = tokens[possibleEndQuoteIndex];
        if (possibleStartQuote !== possibleEndQuote) {
          return;
        }
        endConfigsStringIndex = possibleEndQuoteIndex;
      }

      startConfigsStringIndex = possibleStartQuoteIndex;
      startConfigsStringQuote = possibleStartQuote;
    }

    while (
      !isBlank(peek()) &&
      !(peek() === startConfigsStringQuote) &&
      !(peek() === EQUIL) &&
      !(peek() === FLAG)
    ) {
      curToken += advance();
    }

    let match = true;

    switch (curToken) {
      // Customise ID for headings  #Docsify :id=heading .
      case 'id':
        configs.id = findValuePair();
        break;
      case 'type':
        configs.type = findValuePair();
        findAdditionalPropsIfExist('type');
        break;
      // Ignore to compile link, e.g. :ignore , :ignore title.
      case 'ignore':
        configs.ignore = true;
        findAdditionalPropsIfExist('ignore');
        break;
      // Include
      case 'include':
        configs.include = true;
        break;
      // Embedded code fragments e.g. :fragment=demo'.
      case 'fragment':
        configs.fragment = findValuePair();
        break;
      // Disable link :disabled
      case 'disabled':
        configs.disabled = true;
        break;
      // Link target config, e.g. target=_blank.
      case 'target':
        configs.target = findValuePair();
        break;
      // Image size config, e.g. size=100, size=WIDTHxHEIGHT.
      case 'size':
        configs.size = findValuePair();
        break;
      case 'class':
        configs.class = findValuePair();
        findAdditionalPropsIfExist('class');
        break;
      case 'no-zoom':
        configs['no-zoom'] = true;
        break;
      default:
        // Although it start with FLAG (:), it is an invalid config token for docsify.
        match = false;
    }

    if (match) {
      for (let i = start; i < cur; i++) {
        tokens[i] = '';
      }
    }
  };

  const isAtEnd = function () {
    return cur >= tokens.length;
  };

  const findValuePair = function () {
    if (peek() === EQUIL) {
      // Skip the EQUIL
      advance();
      let val = '';
      // Find the value until the end of the string or next FLAG
      while (!isBlank(peek()) && !peek().match(/['"]/)) {
        val += advance();
      }

      return val.trim().replace(/&quot;/g, '');
    }

    return '';
  };

  const findAdditionalPropsIfExist = function (configKey) {
    while (isBlank(peek())) {
      advance();
      if (isAtEnd()) {
        break;
      }
    }

    let val = '';
    while (!peek().match(/['"]/) && peek() !== FLAG && !isAtEnd()) {
      val += advance();
    }

    val && (configs[configKey + '_appened_props'] = val.trimEnd());
  };

  const findPossiableStartQuote = function (current) {
    for (let i = current - 1; i >= 0; i--) {
      if (tokens[i].match(/['"]/)) {
        return i;
      }
      if (!isBlank(tokens[i])) {
        return -1;
      }
    }
    return -1;
  };

  const findPossiableEndQuote = function (current, possibleStartQuote) {
    for (let i = current + 1; i < tokens.length; i++) {
      if (tokens[i] === possibleStartQuote) {
        return i;
      }
    }
    return -1;
  };

  const peek = function () {
    if (isAtEnd()) {
      return '';
    }
    return tokens[cur];
  };

  const advance = function () {
    return tokens[cur++];
  };

  const isBlank = str => {
    return !str || /^\s*$/.test(str);
  };

  while (!isAtEnd()) {
    scanner(advance());
  }

  for (let i = startConfigsStringIndex; i <= endConfigsStringIndex; i++) {
    tokens[i] = '';
  }

  const content = tokens.join('').trim();
  return { str: content, config: configs };
};
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
