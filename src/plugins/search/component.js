import { search } from './search.js';
import cssText from './style.css';
import { escapeHtml } from '../../core/render/utils.js';

let NO_DATA_TEXT = '';
let RESULT_SOURCE = 'none';

// Strip emoji (pictographs, flags, variation selectors, ZWJ, keycaps) from
// sidebar labels and page titles so source labels stay plain text.
function stripEmoji(text) {
  return (text || '')
    .replace(
      /(?:[\uD83C-\uD83E][\uDC00-\uDFFF])|[\u2600-\u27BF\u2B00-\u2BFF]|\uFE0E|\uFE0F|\u200D|\u20E3/g,
      '',
    )
    .replace(/\s+/g, ' ')
    .trim();
}

// User-authored links may contain malformed percent-encoding, on which
// decodeURIComponent() throws.
function safeDecode(uri) {
  try {
    return decodeURIComponent(uri);
  } catch {
    return uri;
  }
}

function findSidebarLink(url) {
  const base = safeDecode((url || '').split('?')[0]);

  return Docsify.dom
    .findAll('.sidebar-nav a')
    .find(
      a => safeDecode((a.getAttribute('href') || '').split('?')[0]) === base,
    );
}

// Label of a sidebar list item: its own text or link text, without the text
// of the nested list of children.
function groupLabel(li) {
  for (const node of li.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      return node.textContent.trim();
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'UL') {
        break;
      }

      const text = node.textContent.trim();

      if (text) {
        return text;
      }
    }
  }

  return '';
}

// Walk the sidebar tree from the link matching the result URL up to the
// root, collecting section labels along the way.
function getBreadcrumb(url) {
  const link = findSidebarLink(url);

  if (!link) {
    return null;
  }

  const parts = [link.textContent.trim()];
  let li = link.closest('li');

  while (li) {
    const parentLi = li.parentElement ? li.parentElement.closest('li') : null;

    if (parentLi) {
      const label = groupLabel(parentLi);

      if (label) {
        parts.unshift(label);
      }
    }

    li = parentLi;
  }

  return parts;
}

function resultSourceHtml(post) {
  if (RESULT_SOURCE === 'breadcrumb') {
    const parts = getBreadcrumb(post.url);

    if (parts && parts.length) {
      const crumbs = parts
        .map((part, i) => {
          const label = escapeHtml(stripEmoji(part));
          // The page itself (last segment) stands out from its sections.
          return i === parts.length - 1 ? `<strong>${label}</strong>` : label;
        })
        .join(' › ');

      return /* html */ `<p class="search-breadcrumb clamp-1">${crumbs}</p>`;
    }

    // The page is not in the sidebar: fall back to its page title.
    return post.page
      ? /* html */ `<p class="search-breadcrumb clamp-1"><strong>${stripEmoji(post.page)}</strong></p>`
      : '';
  }

  if (RESULT_SOURCE === 'page') {
    // Skip the label when the matched title is the page title itself.
    const page = post.page && post.page !== post.title ? post.page : '';

    return page
      ? /* html */ `<p class="search-breadcrumb clamp-1"><strong>${stripEmoji(page)}</strong></p>`
      : '';
  }

  return '';
}

function tpl(vm, defaultValue = '') {
  const { insertAfter, insertBefore } = vm.config?.search || {};
  const html = /* html */ `
    <div class="input-wrap">
      <input type="search" value="${defaultValue}" required aria-keyshortcuts="/ control+k meta+k" />
      <button class="clear-button" title="Clear search">
        <span class="visually-hidden">Clear search</span>
      </button>
      <div class="kbd-group">
        <kbd title="Press / to search">/</kbd>
        <kbd title="Press Control+K to search">⌃K</kbd>
      </div>
    </div>
    <p class="results-status" aria-live="polite"></p>
    <div class="results-panel"></div>
  `;
  const sidebarElm = Docsify.dom.find('.sidebar');
  const searchElm = Docsify.dom.create('section', html);
  const insertElm = /** @type {HTMLElement} */ (
    sidebarElm.querySelector(
      `:scope ${insertAfter || insertBefore || '> :first-child'}`,
    )
  );

  searchElm.classList.add('search');
  searchElm.setAttribute('role', 'search');
  sidebarElm.insertBefore(
    searchElm,
    insertAfter ? insertElm.nextSibling : insertElm,
  );
}

function doSearch(value) {
  const $search = Docsify.dom.find('.search');
  const $panel = Docsify.dom.find($search, '.results-panel');
  const $status = Docsify.dom.find('.search .results-status');

  if (!value) {
    $panel.innerHTML = '';
    $status.textContent = '';

    return;
  }

  const matches = search(value);

  let html = '';
  matches.forEach((post, i) => {
    const content = post.content ? `...${post.content}...` : '';
    const title = (post.title || '').replace(/<[^>]+>/g, '');
    html += /* html */ `
      <div class="matching-post" aria-label="search result ${i + 1}">
        <a href="${post.url}" title="${title}">
          <p class="title clamp-1">${post.title}</p>
          <p class="content clamp-2">${content}</p>
          ${resultSourceHtml(post)}
        </a>
      </div>
    `;
  });

  $panel.innerHTML = html || '';
  $status.textContent = matches.length
    ? `Found ${matches.length} results`
    : NO_DATA_TEXT;
}

function bindEvents() {
  const $search = Docsify.dom.find('.search');
  const $input = /** @type {HTMLInputElement} */ (
    Docsify.dom.find($search, 'input')
  );
  const $clear = Docsify.dom.find($search, '.clear-button');

  let timeId;

  /**
   * Prevent to Fold sidebar.
   *
   * When searching on the mobile end,
   * the sidebar is collapsed when you click the INPUT box,
   * making it impossible to search.
   */
  Docsify.dom.on(
    $search,
    'click',
    e =>
      ['A', 'H2', 'P', 'EM'].indexOf(e.target.tagName) === -1 &&
      e.stopPropagation(),
  );
  Docsify.dom.on($input, 'input', e => {
    clearTimeout(timeId);
    timeId = setTimeout(
      _ => doSearch(/** @type {HTMLInputElement} */ (e.target).value.trim()),
      100,
    );
  });
  Docsify.dom.on($clear, 'click', e => {
    $input.value = '';
    doSearch();
  });
}

function updatePlaceholder(text, path) {
  const $input = /** @type {HTMLInputElement | null} */ (
    Docsify.dom.getNode('.search input[type="search"]')
  );

  if (!$input) {
    return;
  }

  if (typeof text === 'string') {
    $input.placeholder = text;
  } else {
    const match = Object.keys(text).filter(key => path.indexOf(key) > -1)[0];
    $input.placeholder = text[match];
  }
}

function updateNoData(text, path) {
  if (typeof text === 'string') {
    NO_DATA_TEXT = text;
  } else {
    const match = Object.keys(text).filter(key => path.indexOf(key) > -1)[0];
    NO_DATA_TEXT = text[match];
  }
}

export function init(opts, vm) {
  const sidebarElm = Docsify.dom.find('.sidebar');

  if (!sidebarElm) {
    return;
  }

  const keywords = vm.router.parse().query.s || '';

  RESULT_SOURCE = opts.resultSource || RESULT_SOURCE;
  Docsify.dom.style(cssText);
  tpl(vm, escapeHtml(keywords));
  bindEvents();
  keywords && setTimeout(_ => doSearch(keywords), 500);
}

export function update(opts, vm) {
  RESULT_SOURCE = opts.resultSource || RESULT_SOURCE;
  updatePlaceholder(opts.placeholder, vm.route.path);
  updateNoData(opts.noData, vm.route.path);
}
