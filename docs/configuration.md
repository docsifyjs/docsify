# Configuration

**docsify** supports two different ways of configuration. You can configure the `window.$docsify` or write configuration on the script tag via `data-*` attributes.

```html
<!-- by $docsify -->
<script>
  window.$docsify = {
    repo: 'QingWei-Li/docsify',
    maxLevel: 3,
    coverpage: true
  }
</script>

<!-- or data-* -->
<script
  src="//unpkg.com/docsify"
  data-repo="QingWei-Li/docsify"
  data-max-level="3"
  data-coverpage>
</script>
```

Both ways are compatible. However, the first way is recommended. It is clear and can be configured in a separate file.

!> In `window.$docsfiy`, the options should be written by camelCase.

## el

- Type: `String`
- Default: `#app`

The DOM element to be mounted on initialization. It can be a CSS selector string or an actual HTMLElement.

```js
window.$docsify = {
  el: '#app'
}
```

## repo

- Type: `String`
- Default: `null`

Configure the repository url or a string of `username/repo` can add the [GitHub Corner](http://tholman.com/github-corners/) widget in the top right corner of the site.

```js
window.$docsify = {
  repo: 'QingWei-Li/docsify',
  // or
  repo: 'https://github.com/QingWei-Li/docsify/'
}
```

## max-level

- Type: `Number`
- Default: `6`

Maximum Table of content level.

```js
window.$docsify = {
  maxLevel: 4
}
```

## load-navbar

- Type: `Boolean|String`
- Default: `false`

Loads navbar from the Markdown file `_navbar.md` if **true**, or else from the path specified.

```js
window.$docsify = {
  // load from _navbar.md
  loadNavbar: true,

  // load from nav.md
  loadNavbar: 'nav.md'
}
```

## load-sidebar

- Type: `Boolean|String`
- Default: `false`

Loads sidebar from the Markdown file `_sidebar.md` if **true**, or else from the path specified.

```js
window.$docsify = {
  // load from _sidebar.md
  loadSidebar: true,

  // load from summary.md
  loadSidebar: 'summary.md'
}
```

## sub-max-level

- Type: `Number`
- Default: `0`

Add table of contents (TOC) in custom sidebar.

```js
window.$docsify = {
  subMaxLevel: 2
}
```

## auto2top

- Type: `Boolean`
- Default: `false`

Scrolls to the top of the screen when the route is changed.

```js
window.$docsify = {
  auto2top: true
}
```

## homepage

- Type: `String`
- Default: `README.md`

`README.md` in your docs folder will be treated as homepage for your website, but sometimes you may need to serve another file as your homepage.

```js
window.$docsify = {
  // Change to /home.md
  homepage: 'home.md',

  // Or use the readme in your repo
  homepage: 'https://raw.githubusercontent.com/QingWei-Li/docsify/master/README.md'
}
```

## base-path

- Type: `String`

Base path of the website. You can set it to another directory or another domain name.

```js
window.$docsify = {
  basePath: '/path/',

  // Load the files from another site
  basePath: 'https://docsify.js.org/',

  // Even can load files from other repo
  basePath: 'https://raw.githubusercontent.com/ryanmcdermott/clean-code-javascript/master/'
}
```

## coverpage

- Type: `Boolean|String`
- Default: `false`

Activate the [cover feature](cover.md). If true, it will load from `_coverpage.md`.

```js
window.$docsify = {
  coverpage: true,

  // Custom file name
  coverpage: 'cover.md'
}
```

## name

- Type: `String`

Website name as it appears in the sidebar.

```js
window.$docsify = {
  name: 'docsify'
}
```

## name-link

- Type: `String`
- Default: `window.location.pathname`

The name of the link.

```js
window.$docsify = {
  nameLink: '/',

  // For each route
  nameLink: {
    '/zh-cn/': '/zh-cn/',
    '/': '/'
  }
}
```

## markdown

- Type: `Function`

See [Markdown configuration](markdown.md).

```js
window.$docsify = {
  // object
  markdown: {
    smartypants: true,
    renderer: {
      link: function() {
        // ...
      }
    }
  },

  // function
  markdown: function (marked, renderer) {
    // ...
    return marked
  }
}
```

## theme-color

- Type: `String`

Customize the theme color. Use [CSS3 variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables) feature and polyfill in old browser.

```js
window.$docsify = {
  themeColor: '#3F51B5'
}
```

## alias

- Type: `Object`

Set the route alias. You can freely manage routing rules. Supports RegExp.

```js
window.$docsify = {
  alias: {
    '/foo/(+*)': '/bar/$1', // supports regexp
    '/zh-cn/changelog': '/changelog',
    '/changelog': 'https://raw.githubusercontent.com/QingWei-Li/docsify/master/CHANGELOG',
    '/.*/_sidebar.md': '/_sidebar.md' // See #301
  }
}
```

## auto-header

- type: `Boolean`

If `loadSidebar` and `autoHeader` are both enabled, for each link in `_sidebar.md`, prepend a header to the page before converting it to html. Compare [#78](https://github.com/QingWei-Li/docsify/issues/78).

```js
window.$docsify = {
  loadSidebar: true,
  autoHeader: true
}
```

## execute-script

- type: `Boolean`

Execute the script on the page. Only parse the first script tag([demo](themes)).  If Vue is present, it is turned on by default.

```js
window.$docsify = {
  executeScript: true
}
```

```markdown
## This is test

<script>
  console.log(2333)
</script>
```

Note that if you are running an external script, e.g. an embedded jsfiddle demo, make sure to include the [external-script](plugins.md?id=external-script) plugin.

## no-emoji

- type: `Boolean`

Disabled emoji parse.

```js
window.$docsify = {
  noEmoji: true
}
```

## merge-navbar

- type: `Boolean`

Navbar will be merged with the sidebar on smaller screens.

```js
window.$docsify = {
  mergeNavbar: true
}
```

## format-updated

- type: `String|Function`

We can display the file update date through **{docsify-updated<span>}</span>** variable. And format it by `formatUpdated`.
See https://github.com/lukeed/tinydate#patterns
```js
window.$docsify = {
  formatUpdated: '{MM}/{DD} {HH}:{mm}',

  formatUpdated: function (time) {
    // ...

    return time
  }
}
```

## external-link-target

- type: `String`
- default: `_blank`

Target to open external links. Default `'_blank'` (new window/tab)

```js
window.$docsify = {
  externalLinkTarget: '_self' // default: '_blank'
}
```

## router-mode

- type: `String`
- default: `history`

```js
window.$docsify = {
  routerMode: 'history' // default: 'hash'
}
```

## noCompileLinks

- type: `Array`


Sometimes we do not want docsify to handle our links. See [#203](https://github.com/QingWei-Li/docsify/issues/203)


```js
window.$docsify = {
  noCompileLinks: [
    '/foo',
    '/bar/.*'
  ]
}
```

