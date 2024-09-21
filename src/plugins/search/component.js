import { search } from './search.js';
import cssText from './style.css';

let NO_DATA_TEXT = '';

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
  const insertElm = sidebarElm.querySelector(
    `:scope ${insertAfter || insertBefore || '> :first-child'}`,
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
  const $input = Docsify.dom.find($search, 'input');
  const $clear = Docsify.dom.find($search, '.clear-button');

  let timeId;

  /**
    Prevent to Fold sidebar.

    When searching on the mobile end,
    the sidebar is collapsed when you click the INPUT box,
    making it impossible to search.
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
    timeId = setTimeout(_ => doSearch(e.target.value.trim()), 100);
  });
  Docsify.dom.on($clear, 'click', e => {
    $input.value = '';
    doSearch();
  });
}

function updatePlaceholder(text, path) {
  const $input = Docsify.dom.getNode('.search input[type="search"]');

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

  const keywords = vm.router.parse().query.s;

  Docsify.dom.style(cssText);
  tpl(vm, keywords);
  bindEvents();
  keywords && setTimeout(_ => doSearch(keywords), 500);
}

export function update(opts, vm) {
  updatePlaceholder(opts.placeholder, vm.route.path);
  updateNoData(opts.noData, vm.route.path);
}
