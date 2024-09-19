import {
  getAndRemoveConfig,
  getAndRemoveDocsifyIgnoreConfig,
} from '../../core/render/utils.js';
import { markdownToTxt } from './markdown-to-txt.js';
import Dexie from 'dexie';

let INDEXES = {};

const db = new Dexie('docsify');
db.version(1).stores({
  search: 'slug, title, body, path, indexKey',
  expires: 'key, value',
});

async function saveData(maxAge, expireKey) {
  INDEXES = Object.values(INDEXES).flatMap(innerData =>
    Object.values(innerData),
  );
  await db.search.bulkPut(INDEXES);
  await db.expires.put({ key: expireKey, value: Date.now() + maxAge });
}

async function getData(key, isExpireKey = false) {
  if (isExpireKey) {
    const item = await db.expires.get(key);
    return item ? item.value : 0;
  }

  const item = await db.search.where({ indexKey: key }).toArray();
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

function escapeHtml(string) {
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  return String(string).replace(/[&<>"']/g, s => entityMap[s]);
}

function getAllPaths(router) {
  const paths = [];

  Docsify.dom
    .findAll('.sidebar-nav a:not(.section-link):not([data-nosearch])')
    .forEach(node => {
      const href = node.href;
      const originHref = node.getAttribute('href');
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

export function genIndex(path, content = '', router, depth, indexKey) {
  const tokens = window.marked.lexer(content);
  const slugify = window.Docsify.slugify;
  const index = {};
  let slug;
  let title = '';

  tokens.forEach((token, tokenIndex) => {
    if (token.type === 'heading' && token.depth <= depth) {
      const { str, config } = getAndRemoveConfig(token.text);

      const text = getAndRemoveDocsifyIgnoreConfig(token.text).content;

      if (config.id) {
        slug = router.toURL(path, { id: slugify(config.id) });
      } else {
        slug = router.toURL(path, { id: slugify(escapeHtml(text)) });
      }

      if (str) {
        title = getAndRemoveDocsifyIgnoreConfig(str).content;
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
          body: markdownToTxt(token.text || ''),
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
        token.text = getTableData(token);
        token.text = getListData(token);

        index[slug].body += '\n' + markdownToTxt(token.text || '');
      } else {
        token.text = getTableData(token);
        token.text = getListData(token);

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
        let indexTitle = -1;
        let indexContent = -1;
        handlePostTitle = postTitle
          ? escapeHtml(ignoreDiacriticalMarks(postTitle))
          : postTitle;
        handlePostContent = postContent
          ? escapeHtml(ignoreDiacriticalMarks(postContent))
          : postContent;

        indexTitle = postTitle ? handlePostTitle.search(regEx) : -1;
        indexContent = postContent ? handlePostContent.search(regEx) : -1;

        if (indexTitle >= 0 || indexContent >= 0) {
          matchesScore += indexTitle >= 0 ? 3 : indexContent >= 0 ? 2 : 0;
          if (indexContent < 0) {
            indexContent = 0;
          }

          let start = 0;
          let end = 0;

          start = indexContent < 11 ? 0 : indexContent - 10;
          end = start === 0 ? 100 : indexContent + keyword.length + 90;

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
    INDEXES = {};
  } else if (!isAuto) {
    return;
  }

  const len = paths.length;
  let count = 0;

  paths.forEach(path => {
    const pathExists = Array.isArray(INDEXES)
      ? INDEXES.some(obj => obj.path === path)
      : false;
    if (pathExists) {
      return count++;
    }

    Docsify.get(vm.router.getFile(path), false, vm.config.requestHeaders).then(
      async result => {
        INDEXES[path] = genIndex(
          path,
          result,
          vm.router,
          config.depth,
          indexKey,
        );
        if (len === ++count) {
          await saveData(config.maxAge, expireKey);
        }
      },
    );
  });
}
