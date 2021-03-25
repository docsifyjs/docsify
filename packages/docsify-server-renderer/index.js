import { readFileSync } from 'fs';
import { resolve, basename } from 'path';
import resolvePathname from 'resolve-pathname';
import fetch from 'node-fetch';
import debug from 'debug';
import DOMPurify from 'dompurify';
import { AbstractHistory } from '../../src/core/router/history/abstract';
import { Compiler } from '../../src/core/render/compiler';
import { isAbsolutePath } from '../../src/core/router/util';
import * as tpl from '../../src/core/render/tpl';
import { prerenderEmbed } from '../../src/core/render/embed';

function cwd(...args) {
  return resolve(process.cwd(), ...args);
}

function isExternal(url) {
  let match = url.match(
    /^([^:/?#]+:)?(?:\/\/([^/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/
  );
  if (
    typeof match[1] === 'string' &&
    match[1].length > 0 &&
    match[1].toLowerCase() !== location.protocol
  ) {
    return true;
  }
  if (
    typeof match[2] === 'string' &&
    match[2].length > 0 &&
    match[2].replace(
      new RegExp(
        ':(' + { 'http:': 80, 'https:': 443 }[location.protocol] + ')?$'
      ),
      ''
    ) !== location.host
  ) {
    return true;
  }
  return false;
}

function mainTpl(config) {
  let html = `<nav class="app-nav${
    config.repo ? '' : ' no-badge'
  }"><!--navbar--></nav>`;

  if (config.repo) {
    html += tpl.corner(config.repo);
  }

  if (config.coverpage) {
    html += tpl.cover();
  }

  html += tpl.main(config);

  return html;
}

export default class Renderer {
  constructor({ template, config, cache }) {
    this.html = template;
    this.config = config = Object.assign({}, config, {
      routerMode: 'history',
    });
    this.cache = cache;

    this.router = new AbstractHistory(config);
    this.compiler = new Compiler(config, this.router);

    this.router.getCurrentPath = () => this.url;
    this._renderHtml(
      'inject-config',
      `<script>window.$docsify = ${JSON.stringify(config)}</script>`
    );
    this._renderHtml('inject-app', mainTpl(config));

    this.template = this.html;
  }

  _getPath(url) {
    const file = this.router.getFile(url);

    return isAbsolutePath(file) ? file : cwd(`./${file}`);
  }

  async renderToString(url) {
    this.url = url = this.router.parse(url).path;
    this.isRemoteUrl = isExternal(this.url);
    const { loadSidebar, loadNavbar, coverpage } = this.config;

    const mainFile = this._getPath(url);
    this._renderHtml('main', await this._render(mainFile, 'main'));

    if (loadSidebar) {
      const name = loadSidebar === true ? '_sidebar.md' : loadSidebar;
      const sidebarFile = this._getPath(resolve(url, `./${name}`));
      this._renderHtml('sidebar', await this._render(sidebarFile, 'sidebar'));
    }

    if (loadNavbar) {
      const name = loadNavbar === true ? '_navbar.md' : loadNavbar;
      const navbarFile = this._getPath(resolve(url, `./${name}`));
      this._renderHtml('navbar', await this._render(navbarFile, 'navbar'));
    }

    if (coverpage) {
      let path = null;
      if (typeof coverpage === 'string') {
        if (url === '/') {
          path = coverpage;
        }
      } else if (Array.isArray(coverpage)) {
        path = coverpage.indexOf(url) > -1 && '_coverpage.md';
      } else {
        const cover = coverpage[url];
        path = cover === true ? '_coverpage.md' : cover;
      }

      const coverFile = this._getPath(resolve(url, `./${path}`));

      this._renderHtml('cover', await this._render(coverFile), 'cover');
    }

    const html = this.isRemoteUrl
      ? DOMPurify.sanitize(this.html, { ADD_TAGS: ['script'] })
      : this.html;
    this.html = this.template;
    return html;
  }

  _renderHtml(match, content) {
    this.html = this.html.replace(new RegExp(`<!--${match}-->`, 'g'), content);

    return this.html;
  }

  async _render(path, type) {
    let html = await this._loadFile(path);
    const { subMaxLevel, maxLevel } = this.config;
    let tokens;

    switch (type) {
      case 'sidebar':
        html =
          this.compiler.sidebar(html, maxLevel) +
          `<script>window.__SUB_SIDEBAR__ = ${JSON.stringify(
            this.compiler.subSidebar(subMaxLevel)
          )}</script>`;
        break;
      case 'cover':
        html = this.compiler.cover(html);
        break;
      case 'main':
        tokens = await new Promise(r => {
          prerenderEmbed(
            {
              fetch: url => this._loadFile(this._getPath(url)),
              compiler: this.compiler,
              raw: html,
            },
            r
          );
        });
        html = this.compiler.compile(tokens);
        break;
      case 'navbar':
      case 'article':
      default:
        html = this.compiler.compile(html);
        break;
    }

    return html;
  }

  async _loadFile(filePath) {
    debug('docsify')(`load > ${filePath}`);
    let content;
    try {
      if (isAbsolutePath(filePath)) {
        const res = await fetch(filePath);
        if (!res.ok) {
          throw Error();
        }

        content = await res.text();
        this.lock = 0;
      } else {
        content = await readFileSync(filePath, 'utf8');
        this.lock = 0;
      }

      return content;
    } catch (e) {
      this.lock = this.lock || 0;
      if (++this.lock > 10) {
        this.lock = 0;
        return;
      }

      const fileName = basename(filePath);
      const result = await this._loadFile(
        resolvePathname(`../${fileName}`, filePath)
      );

      return result;
    }
  }
}

Renderer.version = '__VERSION__';
