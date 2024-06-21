import { search } from './search.js';
import cssText from './style.css';

let NO_DATA_TEXT = '';
let options;

function tpl(defaultValue = '') {
  const html = /* html */ `
    <div class="input-wrap">
      <input type="search" value="${defaultValue}" required aria-keyshortcuts="/ control+k meta+k" />
      <button class="clear-button">
        <svg width="26" height="24">
          <circle cx="12" cy="12" r="11" fill="#ccc" />
          <path stroke="white" stroke-width="2" d="M8.25,8.25,15.75,15.75" />
          <path stroke="white" stroke-width="2"d="M8.25,15.75,15.75,8.25" />
        </svg>
      </button>
      <div class="kbd-group">
        <kbd title="Press / to search">/</kbd>
        <kbd title="Press Control+K to search">⌃K</kbd>
      </div>
    </div>
    <p class="results-status" aria-live="polite"></p>
    <div class="results-panel"></div>
  `;
  const el = Docsify.dom.create('section', html);
  const aside = Docsify.dom.find('aside');

  Docsify.dom.toggleClass(el, 'search');
  el.setAttribute('role', 'search');
  Docsify.dom.before(aside, el);
}

function doSearch(value) {
  const $search = Docsify.dom.find('.search');
  const $panel = Docsify.dom.find($search, '.results-panel');
  const $sidebarNav = Docsify.dom.find('.sidebar-nav');
  const $status = Docsify.dom.find('.search .results-status');
  const $appName = Docsify.dom.find('.app-name');

  if (!value) {
    $panel.innerHTML = '';
    $status.textContent = '';

    if (options.hideOtherSidebarContent) {
      $sidebarNav && $sidebarNav.classList.remove('hide');
      $appName && $appName.classList.remove('hide');
    }

    return;
  }

  const matches = search(value);

  let html = '';
  matches.forEach((post, i) => {
    html += /* html */ `
      <div class="matching-post" aria-label="search result ${i + 1}">
        <a href="${post.url}">
          <p class="title">${post.title}</p>
          <p class="content">${post.content}</p>
        </a>
      </div>
    `;
  });

  $panel.innerHTML = html || '';
  $status.textContent = matches.length
    ? `Found ${matches.length} results`
    : NO_DATA_TEXT;

  if (options.hideOtherSidebarContent) {
    $sidebarNav && $sidebarNav.classList.add('hide');
    $appName && $appName.classList.add('hide');
  }
}

function bindEvents() {
  const $search = Docsify.dom.find('.search');
  const $input = Docsify.dom.find($search, 'input');
  const $inputWrap = Docsify.dom.find($search, '.input-wrap');

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
  Docsify.dom.on($inputWrap, 'click', e => {
    // Click input outside
    if (e.target.tagName !== 'INPUT') {
      $input.value = '';
      doSearch();
    }
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

function updateOptions(opts) {
  options = opts;
}

export function init(opts, vm) {
  const keywords = vm.router.parse().query.s;

  updateOptions(opts);
  Docsify.dom.style(cssText);
  tpl(keywords);
  bindEvents();
  keywords && setTimeout(_ => doSearch(keywords), 500);
}

export function update(opts, vm) {
  updateOptions(opts);
  updatePlaceholder(opts.placeholder, vm.route.path);
  updateNoData(opts.noData, vm.route.path);
}
