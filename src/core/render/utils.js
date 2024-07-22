/**
 * Converts a colon formatted string to a object with properties.
 *
 * This is process a provided string and look for any tokens in the format
 * of `:name[=value]` and then convert it to a object and return.
 * An example of this is ':include :type=code :fragment=demo' is taken and
 * then converted to:
 *
 * Specially the exitra values following a key, such as `:propKey=propVal additinalProp1 additinalProp2`
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
    str = str
      .replace(/^('|")/, '')
      .replace(/('|")$/, '')
      .trim();
    return lexer(str);
  }

  return { str, config };
}

const lexer = function (str) {
  const FLAG = ':';
  const EQUIL = '=';
  const tokens = str.split('');
  let cur = 0;
  const configs = {};
  const invalidConfigKeys = [];

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
    let start = cur - 1;

    // eat start '/" if it exists
    if (tokens[start - 1] && tokens[start - 1].match(/['"]/)) {
      start--;
    }

    while (!isBlank(peek()) && !(peek() === EQUIL) && !peek().match(/['"]/)) {
      curToken += advance();
    }

    let match = true;
    // Check for the currentToken and process it with our keywords
    switch (curToken) {
      // customise ID for headings or #id
      case 'id':
        configs.id = findValuePair();
        break;
      // customise class for headings
      case 'type':
        configs.type = findValuePair();
        findAdditionalPropsIfExist('type');
        break;
      // ignore to compile link, e.g. ':ignore' , ':ignore title'
      case 'ignore':
        configs.ignore = true;
        findAdditionalPropsIfExist('ignore');
        break;
      // include
      case 'include':
        configs.include = true;
        break;
      // Embedded code fragments e.g. :fragment=demo'
      case 'fragment':
        configs.fragment = findValuePair();
        break;
      // Disable link :disabled
      case 'disabled':
        configs.disabled = true;
        break;
      // Link target config, e.g. target=_blank
      case 'target':
        configs.target = findValuePair();
        break;
      // Image size config, e.g. size=100, size=WIDTHxHEIGHT
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
        // Although it start with FLAG (:), it is an invalid config token for docsify
        if (curToken.endsWith(FLAG)) {
          // okay, suppose it should be a emoji, skip it to make all happy
        } else {
          invalidConfigKeys.push(FLAG + curToken);
        }
        match = false;
    }

    if (match) {
      for (let i = start; i < cur; i++) {
        tokens[i] = '';
      }

      // eat the end '/" if it exists
      if (peek().match(/['"]/)) {
        tokens[cur] = '';
        advance();
      }
      match = false;
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
      return val.trim();
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

  if (invalidConfigKeys.length > 0) {
    const msg = invalidConfigKeys.join(', ');
    console.warn(
      `May find docsify doesn't support config keys: [${msg}], please recheck it.`,
    );
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
