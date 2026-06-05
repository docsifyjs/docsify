import {
  getAndRemoveConfig,
  getAndRemoveDocsifyIgnoreConfig,
  removeAtag,
  escapeHtml,
} from '../../core/render/utils.js';
import {
  getPath,
  getParentPath,
  isAbsolutePath,
} from '../../core/router/util.js';
import { markdownToTxt } from './markdown-to-txt.js';
import Dexie from 'dexie';

let INDEXES = [];

const db = new Dexie('docsify');
db.version(1).stores({
  search: 'slug, title, body, path, indexKey',
  expires: 'key, value',
});

async function saveData(maxAge, expireKey) {
  const records = [];

  Object.values(INDEXES).forEach(entry => {
    if (!entry || typeof entry !== 'object') {
      return;
    }

    // Entry may already be a flat record read from IndexedDB.
    if ('slug' in entry) {
      records.push(entry);
      return;
    }

    // Entry may be a per-path map of slug -> record produced by genIndex().
    Object.values(entry).forEach(item => {
      if (item && typeof item === 'object' && 'slug' in item) {
        records.push(item);
      }
    });
  });

  INDEXES = records;
  await /** @type {any} */ (db).search.bulkPut(records);
  await /** @type {any} */ (db).expires.put({
    key: expireKey,
    value: Date.now() + maxAge,
  });
}

async function getData(key, isExpireKey = false) {
  if (isExpireKey) {
    const item = await /** @type {any} */ (db).expires.get(key);
    return item ? item.value : 0;
  }

  const item = await /** @type {any} */ (db).search
    .where({ indexKey: key })
    .toArray();
  return item ? item : null;
}

const LOCAL_STORAGE = {
  EXPIRE_KEY: 'docsify.search.expires',
  INDEX_KEY: 'docsify.search.index',
};

function resolveExpireKey(namespace) {
  return namespace
    ? `${LOCAL_STORAGE.EXPIRE_KEY}/${namespace}`
    : LOCAL_STORAGE.EXPIRE_KEY;
}

function resolveIndexKey(namespace) {
  return namespace
    ? `${LOCAL_STORAGE.INDEX_KEY}/${namespace}`
    : LOCAL_STORAGE.INDEX_KEY;
}

function getAllPaths(router) {
  const paths = [];

  Docsify.dom
    .findAll('.sidebar-nav a:not(.section-link):not([data-nosearch])')
    .forEach(node => {
      const href = /** @type {HTMLAnchorElement} */ (node).href;
      const originHref = /** @type {HTMLAnchorElement} */ (node).getAttribute(
        'href',
      );
      const path = router.parse(href).path;

      if (
        path &&
        paths.indexOf(path) === -1 &&
        !Docsify.util.isAbsolutePath(originHref)
      ) {
        paths.push(path);
      }
    });

  return paths;
}

function getTableData(token) {
  if (!token.text && token.type === 'table') {
    token.rows.unshift(token.header);
    token.text = token.rows
      .map(columns => columns.map(r => r.text).join(' | '))
      .join(' |\n ');
  }
  return token.text;
}

function getListData(token) {
  if (!token.text && token.type === 'list') {
    token.text = token.raw;
  }
  return token.text;
}

function extractFragmentContent(text, fragment, fullLine) {
  if (!fragment) {
    return text;
  }

  let fragmentRegex = `(?:###|\\/\\/\\/)\\s*\\[${fragment}\\]`;
  if (fullLine) {
    fragmentRegex = `.*${fragmentRegex}.*\n`;
  }

  const pattern = new RegExp(
    `(?:${fragmentRegex})([\\s\\S]*?)(?:${fragmentRegex})`,
  );
  const match = text.match(pattern);
  return ((match || [])[1] || '').trim();
}

function collectEmbedRequests(raw = '', path, vm) {
  const tokens = window.marked.lexer(raw);
  const requests = [];

  const maybePushEmbed = inlineToken => {
    if (
      !inlineToken ||
      (inlineToken.type !== 'link' && inlineToken.type !== 'image')
    ) {
      return;
    }

    const { config } = getAndRemoveConfig(inlineToken.title || '');
    if (!config.include || !inlineToken.href) {
      return;
    }

    const href = isAbsolutePath(inlineToken.href)
      ? inlineToken.href
      : getPath(vm.router.getBasePath(), getParentPath(path), inlineToken.href);

    let type = 'code';
    if (/\.(md|markdown)/.test(href)) {
      type = 'markdown';
    } else if (/\.mmd/.test(href)) {
      type = 'mermaid';
    }

    requests.push({
      url: href,
      type,
      fragment: config.fragment,
      omitFragmentLine: config.omitFragmentLine,
    });
  };

  tokens.forEach(token => {
    if (token.type === 'paragraph') {
      (token.tokens || []).forEach(maybePushEmbed);
    } else if (token.type === 'table') {
      (token.header || []).forEach(cell => {
        (cell.tokens || []).forEach(maybePushEmbed);
      });
      (token.rows || []).forEach(row => {
        row.forEach(cell => {
          (cell.tokens || []).forEach(maybePushEmbed);
        });
      });
    }
  });

  return requests;
}

async function getEmbeddedContent(raw = '', path, vm) {
  const requests = collectEmbedRequests(raw, path, vm);
  if (!requests.length) {
    return '';
  }

  const results = await Promise.all(
    requests.map(
      request =>
        new Promise(resolve => {
          Docsify.get(request.url, false, vm.config.requestHeaders).then(
            text => {
              let content = text || '';
              if (request.fragment) {
                content = extractFragmentContent(
                  content,
                  request.fragment,
                  request.omitFragmentLine,
                );
              }

              resolve(
                request.type === 'markdown' ? content : markdownToTxt(content),
              );
            },
            () => resolve(''),
          );
        }),
    ),
  );

  return results.filter(Boolean).join('\n');
}

export function genIndex(path, content = '', router, depth, indexKey) {
  const tokens = window.marked.lexer(content);
  const slugify = window.Docsify.slugify;
  /** @type {Record<string, any>} */
  const index = {};
  let slug;
  let title = '';

  tokens.forEach((token, tokenIndex) => {
    if (token.type === 'heading' && token.depth <= depth) {
      const { str, config } = getAndRemoveConfig(token.text);

      slug = router.toURL(path, { id: slugify(config.id || token.text) });

      if (str) {
        title = getAndRemoveDocsifyIgnoreConfig(str).content;
        title = removeAtag(title.trim());
      }

      index[slug] = {
        slug,
        title: title,
        body: '',
        path: path,
        indexKey: indexKey,
      };
    } else {
      if (tokenIndex === 0) {
        slug = router.toURL(path);
        index[slug] = {
          slug,
          title: path !== '/' ? path.slice(1) : 'Home Page',
          body: markdownToTxt(/** @type {any} */ (token).text || ''),
          path: path,
          indexKey: indexKey,
        };
      }

      if (!slug) {
        return;
      }

      if (!index[slug]) {
        index[slug] = { slug, title: '', body: '' };
      } else if (index[slug].body) {
        // @ts-expect-error
        token.text = getTableData(token);
        // @ts-expect-error
        token.text = getListData(token);

        // @ts-expect-error
        index[slug].body += '\n' + markdownToTxt(token.text || '');
      } else {
        // @ts-expect-error
        token.text = getTableData(token);
        // @ts-expect-error
        token.text = getListData(token);

        // @ts-expect-error
        index[slug].body = markdownToTxt(token.text || '');
      }

      index[slug].path = path;
      index[slug].indexKey = indexKey;
    }
  });
  slugify.clear();
  return index;
}

export function ignoreDiacriticalMarks(keyword) {
  if (keyword && keyword.normalize) {
    return keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  return keyword;
}

/**
 * @param {String} query Search query
 * @returns {Array} Array of results
 */
export function search(query) {
  const matchingResults = [];

  query = query.trim();
  let keywords = query.split(/[\s\-，\\/]+/);
  if (keywords.length !== 1) {
    keywords = [query, ...keywords];
  }

  for (const post of INDEXES) {
    let matchesScore = 0;
    let resultStr = '';
    let handlePostTitle = '';
    let handlePostContent = '';
    const postTitle = post.title && post.title.trim();
    const postContent = post.body && post.body.trim();
    const postUrl = post.slug || '';

    if (postTitle) {
      keywords.forEach(keyword => {
        // From https://github.com/sindresorhus/escape-string-regexp
        const regEx = new RegExp(
          escapeHtml(ignoreDiacriticalMarks(keyword)).replace(
            /[|\\{}()[\]^$+*?.]/g,
            '\\$&',
          ),
          'gi',
        );
        handlePostTitle = postTitle
          ? escapeHtml(ignoreDiacriticalMarks(postTitle))
          : postTitle;
        handlePostContent = postContent
          ? escapeHtml(ignoreDiacriticalMarks(postContent))
          : postContent;

        const indexTitle = postTitle ? handlePostTitle.search(regEx) : -1;
        let indexContent = postContent ? handlePostContent.search(regEx) : -1;

        if (indexTitle >= 0 || indexContent >= 0) {
          matchesScore += indexTitle >= 0 ? 3 : indexContent >= 0 ? 2 : 0;
          if (indexContent < 0) {
            indexContent = 0;
          }

          const start = indexContent < 11 ? 0 : indexContent - 10;
          let end = start === 0 ? 100 : indexContent + keyword.length + 90;

          if (handlePostContent && end > handlePostContent.length) {
            end = handlePostContent.length;
          }

          const matchContent =
            handlePostContent &&
            handlePostContent
              .substring(start, end)
              .replace(regEx, word => /* html */ `<mark>${word}</mark>`);

          resultStr += matchContent;
        }
      });

      if (matchesScore > 0) {
        const matchingPost = {
          title: handlePostTitle,
          content: postContent ? resultStr : '',
          url: postUrl,
          score: matchesScore,
        };

        matchingResults.push(matchingPost);
      }
    }
  }

  return matchingResults.sort((r1, r2) => r2.score - r1.score);
}

export async function init(config, vm) {
  const isAuto = config.paths === 'auto';
  const paths = isAuto ? getAllPaths(vm.router) : config.paths;

  let namespaceSuffix = '';

  // only in auto mode
  if (paths.length && isAuto && config.pathNamespaces) {
    const path = paths[0];

    if (Array.isArray(config.pathNamespaces)) {
      namespaceSuffix =
        config.pathNamespaces.filter(
          prefix => path.slice(0, prefix.length) === prefix,
        )[0] || namespaceSuffix;
    } else if (config.pathNamespaces instanceof RegExp) {
      const matches = path.match(config.pathNamespaces);

      if (matches) {
        namespaceSuffix = matches[0];
      }
    }
    const isExistHome = paths.indexOf(namespaceSuffix + '/') === -1;
    const isExistReadme = paths.indexOf(namespaceSuffix + '/README') === -1;
    if (isExistHome && isExistReadme) {
      paths.unshift(namespaceSuffix + '/');
    }
  } else if (paths.indexOf('/') === -1 && paths.indexOf('/README') === -1) {
    paths.unshift('/');
  }

  const expireKey = resolveExpireKey(config.namespace) + namespaceSuffix;
  const indexKey = resolveIndexKey(config.namespace) + namespaceSuffix;

  const isExpired = (await getData(expireKey, true)) < Date.now();

  INDEXES = await getData(indexKey);

  if (isExpired) {
    INDEXES = [];
  } else if (!isAuto) {
    return;
  }

  const len = paths.length;
  let count = 0;

  const markComplete = async () => {
    if (len === ++count) {
      await saveData(config.maxAge, expireKey);
    }
  };

  paths.forEach(path => {
    const pathExists = Array.isArray(INDEXES)
      ? INDEXES.some(obj => obj.path === path)
      : false;
    if (pathExists) {
      void markComplete();
      return;
    }

    Docsify.get(vm.router.getFile(path), false, vm.config.requestHeaders).then(
      async result => {
        const embeddedContent = await getEmbeddedContent(result, path, vm);
        const contentToIndex = embeddedContent
          ? `${result}\n${embeddedContent}`
          : result;
        INDEXES[path] = genIndex(
          path,
          contentToIndex,
          vm.router,
          config.depth,
          indexKey,
        );
        return markComplete();
      },
      () => {
        return markComplete();
      },
    );
  });
}
