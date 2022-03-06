/* eslint-disable no-unused-vars */
import { search } from './search';

let NO_DATA_TEXT = '';
let options;

function style() {
  const code = `
.sidebar {
  padding-top: 0;
}

.search {
  margin-bottom: 20px;
  padding: 6px;
  border-bottom: 1px solid #eee;
}

.search .input-wrap {
  display: flex;
  align-items: center;
}

.search .results-panel {
  display: none;
}

.search .results-panel.show {
  display: block;
}

.search input {
  outline: none;
  border: none;
  width: 100%;
  padding: 0.6em 7px;
  font-size: inherit;
  border: 1px solid transparent;
}

.search input:focus {
  box-shadow: 0 0 5px var(--theme-color, #42b983);
  border: 1px solid var(--theme-color, #42b983);
}

.search input::-webkit-search-decoration,
.search input::-webkit-search-cancel-button,
.search input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.search input::-ms-clear {
  display: none;
  height: 0;
  width: 0;
}

.search .clear-button {
  cursor: pointer;
  width: 36px;
  text-align: right;
  display: none;
}

.search .clear-button.show {
  display: block;
}

.search .clear-button svg {
  transform: scale(.5);
}

.search h2 {
  font-size: 17px;
  margin: 10px 0;
}

.search a {
  text-decoration: none;
  color: inherit;
}

.search .matching-post {
  border-bottom: 1px solid #eee;
}

.search .matching-post:last-child {
  border-bottom: 0;
}

.search p {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.search p.empty {
  text-align: center;
}

.app-name.hide, .sidebar-nav.hide {
  display: none;
}`;

  Docsify.dom.style(code);
}

function tpl(defaultValue = '') {
  const html = `<div class="input-wrap">
      <input type="search" value="${defaultValue}" aria-label="Search text" />
      <div class="clear-button">
        <svg width="26" height="24">
          <circle cx="12" cy="12" r="11" fill="#ccc" />
          <path stroke="white" stroke-width="2" d="M8.25,8.25,15.75,15.75" />
          <path stroke="white" stroke-width="2"d="M8.25,15.75,15.75,8.25" />
        </svg>
      </div>
    </div>
    <div class="results-panel"></div>
    </div>`;
  const el = Docsify.dom.create('div', html);
  const aside = Docsify.dom.find('aside');

  Docsify.dom.toggleClass(el, 'search');
  Docsify.dom.before(aside, el);
}

function doSearch(value) {
  const $search = Docsify.dom.find('div.search');
  const $panel = Docsify.dom.find($search, '.results-panel');
  const $clearBtn = Docsify.dom.find($search, '.clear-button');
  const $sidebarNav = Docsify.dom.find('.sidebar-nav');
  const $appName = Docsify.dom.find('.app-name');

  if (!value) {
    $panel.classList.remove('show');
    $clearBtn.classList.remove('show');
    $panel.innerHTML = '';

    if (options.hideOtherSidebarContent) {
      $sidebarNav && $sidebarNav.classList.remove('hide');
      $appName && $appName.classList.remove('hide');
    }

    return;
  }

  const matchs = search(value);

  let html = '';
  matchs.forEach(post => {
    html += `<div class="matching-post">
<a href="${post.url}">
<h2>${post.title}</h2>
<p>${post.content}</p>
</a>
</div>`;
  });

  $panel.classList.add('show');
  $clearBtn.classList.add('show');
  $panel.innerHTML = html || `<p class="empty">${NO_DATA_TEXT}</p>`;
  if (options.hideOtherSidebarContent) {
    $sidebarNav && $sidebarNav.classList.add('hide');
    $appName && $appName.classList.add('hide');
  }
}

function bindEvents() {
  const $search = Docsify.dom.find('div.search');
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
      e.stopPropagation()
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
  style();
  tpl(keywords);
  bindEvents();
  keywords && setTimeout(_ => doSearch(keywords), 500);
}

export function update(opts, vm) {
  updateOptions(opts);
  updatePlaceholder(opts.placeholder, vm.route.path);
  updateNoData(opts.noData, vm.route.path);
}
