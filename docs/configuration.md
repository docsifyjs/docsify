# Configuration

You can configure Docsify by defining `window.$docsify` as an object:

```html
<script>
  window.$docsify = {
    repo: 'docsifyjs/docsify',
    maxLevel: 3,
    coverpage: true,
  };
</script>
```

The config can also be defined as a function, in which case the first argument is the Docsify `vm` instance. The function should return a config object. This can be useful for referencing `vm` in places like the markdown configuration:

```html
<script>
  window.$docsify = function (vm) {
    return {
      markdown: {
        renderer: {
          code(code, lang) {
            // ... use `vm` ...
          },
        },
      },
    };
  };
</script>
```

## alias

- Type: `Object`

Set the route alias. You can freely manage routing rules. Supports RegExp.
Do note that order matters! If a route can be matched by multiple aliases, the one you declared first takes precedence.

```js
window.$docsify = {
  alias: {
    '/foo/(.*)': '/bar/$1', // supports regexp
    '/zh-cn/changelog': '/changelog',
    '/changelog':
      'https://raw.githubusercontent.com/docsifyjs/docsify/master/CHANGELOG',

    // You may need this if you use routerMode:'history'.
    '/.*/_sidebar.md': '/_sidebar.md', // See #301
  },
};
```

> **Note** If you change [`routerMode`](#routermode) to `'history'`, you may
> want to configure an alias for your `_sidebar.md` and `_navbar.md` files.

## auto2top

- Type: `Boolean`
- Default: `false`

Scrolls to the top of the screen when the route is changed.

```js
window.$docsify = {
  auto2top: true,
};
```

## autoHeader

- Type: `Boolean`
- Default: `false`

If `loadSidebar` and `autoHeader` are both enabled, for each link in `_sidebar.md`, prepend a header to the page before converting it to HTML. See [#78](https://github.com/docsifyjs/docsify/issues/78).

```js
window.$docsify = {
  loadSidebar: true,
  autoHeader: true,
};
```

## basePath

- Type: `String`

Base path of the website. You can set it to another directory or another domain name.

```js
window.$docsify = {
  basePath: '/path/',

  // Load the files from another site
  basePath: 'https://docsify.js.org/',

  // Even can load files from other repo
  basePath:
    'https://raw.githubusercontent.com/ryanmcdermott/clean-code-javascript/master/',
};
```

## catchPluginErrors

- Type: `Boolean`
- Default: `true`

Determines if Docsify should handle uncaught _synchronous_ plugin errors automatically. This can prevent plugin errors from affecting docsify's ability to properly render live site content.

## cornerExternalLinkTarget

- Type: `String`
- Default: `'_blank'`

Target to open external link at the top right corner. Default `'_blank'` (new window/tab)

```js
window.$docsify = {
  cornerExternalLinkTarget: '_self', // default: '_blank'
};
```

## coverpage

- Type: `Boolean|String|String[]|Object`
- Default: `false`

Activate the [cover feature](cover.md). If true, it will load from `_coverpage.md`.

```js
window.$docsify = {
  coverpage: true,

  // Custom file name
  coverpage: 'cover.md',

  // multiple covers
  coverpage: ['/', '/zh-cn/'],

  // multiple covers and custom file name
  coverpage: {
    '/': 'cover.md',
    '/zh-cn/': 'cover.md',
  },
};
```

## el

- Type: `String`
- Default: `'#app'`

The DOM element to be mounted on initialization. It can be a CSS selector string or an actual [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement).

```js
window.$docsify = {
  el: '#app',
};
```

## executeScript

- Type: `Boolean`
- Default: `null`

Execute the script on the page. Only parses the first script tag ([demo](themes)). If Vue is detected, this is `true` by default.

```js
window.$docsify = {
  executeScript: true,
};
```

```markdown
## This is test

<script>
  console.log(2333)
</script>
```

Note that if you are running an external script, e.g. an embedded jsfiddle demo, make sure to include the [external-script](plugins.md?id=external-script) plugin.

## ext

- Type: `String`
- Default: `'.md'`

Request file extension.

```js
window.$docsify = {
  ext: '.md',
};
```

## externalLinkRel

- Type: `String`
- Default: `'noopener'`

Default `'noopener'` (no opener) prevents the newly opened external page (when [externalLinkTarget](#externallinktarget) is `'_blank'`) from having the ability to control our page. No `rel` is set when it's not `'_blank'`. See [this post](https://mathiasbynens.github.io/rel-noopener/) for more information about why you may want to use this option.

```js
window.$docsify = {
  externalLinkRel: '', // default: 'noopener'
};
```

## externalLinkTarget

- Type: `String`
- Default: `'_blank'`

Target to open external links inside the markdown. Default `'_blank'` (new window/tab)

```js
window.$docsify = {
  externalLinkTarget: '_self', // default: '_blank'
};
```

## fallbackLanguages

- Type: `Array<string>`

List of languages that will fallback to the default language when a page is requested and it doesn't exist for the given locale.

Example:

- try to fetch the page of `/de/overview`. If this page exists, it'll be displayed.
- then try to fetch the default page `/overview` (depending on the default language). If this page exists, it'll be displayed.
- then display the 404 page.

```js
window.$docsify = {
  fallbackLanguages: ['fr', 'de'],
};
```

## formatUpdated

- Type: `String|Function`

We can display the file update date through **{docsify-updated<span>}</span>** variable. And format it by `formatUpdated`.
See https://github.com/lukeed/tinydate#patterns

```js
window.$docsify = {
  formatUpdated: '{MM}/{DD} {HH}:{mm}',

  formatUpdated(time) {
    // ...

    return time;
  },
};
```

## hideSidebar

- Type : `Boolean`
- Default: `true`

This option will completely hide your sidebar and won't render any content on the side.

```js
window.$docsify = {
  hideSidebar: true,
};
```

## homepage

- Type: `String`
- Default: `'README.md'`

`README.md` in your docs folder will be treated as the homepage for your website, but sometimes you may need to serve another file as your homepage.

```js
window.$docsify = {
  // Change to /home.md
  homepage: 'home.md',

  // Or use the readme in your repo
  homepage:
    'https://raw.githubusercontent.com/docsifyjs/docsify/master/README.md',
};
```

## keyBindings

- Type: `Boolean|Object`
- Default: `Object`
  - <kbd>\\</kbd> Toggle the sidebar menu
  - <kbd>/</kbd> Focus on [search](plugins#full-text-search) field. Also supports <kbd>alt</kbd>&nbsp;/&nbsp;<kbd>ctrl</kbd>&nbsp;+&nbsp;<kbd>k</kbd>.

Binds key combination(s) to a custom callback function.

Key `bindings` are defined as case insensitive string values separated by `+`. Modifier key values include `alt`, `ctrl`, `meta`, and `shift`. Non-modifier key values should match the keyboard event's [key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) or [code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) value.

The `callback` function receive a [keydown event](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event) as an argument.

!> Let site visitors know your custom key bindings are available! If a binding is associated with a DOM element, consider inserting a `<kbd>` element as a visual cue (e.g., <kbd>alt</kbd> + <kbd>a</kbd>) or adding [title](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title) and [aria-keyshortcuts](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-keyshortcuts) attributes for hover/focus hints.

```js
window.$docsify = {
  keyBindings: {
    // Custom key binding
    myCustomBinding: {
      bindings: ['alt+a', 'shift+a'],
      callback(event) {
        alert('Hello, World!');
      },
    },
  },
};
```

Key bindings can be disabled entirely or individually by setting the binding configuration to `false`.

```js
window.$docsify = {
  // Disable all key bindings
  keyBindings: false,
};
```

```js
window.$docsify = {
  keyBindings: {
    // Disable individual key bindings
    focusSearch: false,
    toggleSidebar: false,
  },
};
```

## loadNavbar

- Type: `Boolean|String`
- Default: `false`

Loads navbar from the Markdown file `_navbar.md` if **true**, else loads it from the path specified.

```js
window.$docsify = {
  // load from _navbar.md
  loadNavbar: true,

  // load from nav.md
  loadNavbar: 'nav.md',
};
```

## loadSidebar

- Type: `Boolean|String`
- Default: `false`

Loads sidebar from the Markdown file `_sidebar.md` if **true**, else loads it from the path specified.

```js
window.$docsify = {
  // load from _sidebar.md
  loadSidebar: true,

  // load from summary.md
  loadSidebar: 'summary.md',
};
```

## logo

- Type: `String`

Website logo as it appears in the sidebar. You can resize it using CSS.

!> Logo will only be visible if `name` prop is also set. See [name](#name) configuration.

```js
window.$docsify = {
  logo: '/_media/icon.svg',
};
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
      link() {
        // ...
      },
    },
  },

  // function
  markdown(marked, renderer) {
    // ...
    return marked;
  },
};
```

## maxLevel

- Type: `Number`
- Default: `6`

Maximum Table of content level.

```js
window.$docsify = {
  maxLevel: 4,
};
```

## mergeNavbar

- Type: `Boolean`
- Default: `false`

Navbar will be merged with the sidebar on smaller screens.

```js
window.$docsify = {
  mergeNavbar: true,
};
```

## name

- Type: `String`

Website name as it appears in the sidebar.

```js
window.$docsify = {
  name: 'docsify',
};
```

The name field can also contain custom HTML for easier customization:

```js
window.$docsify = {
  name: '<span>docsify</span>',
};
```

## nameLink

- Type: `String`
- Default: `'window.location.pathname'`

The URL that the website `name` links to.

```js
window.$docsify = {
  nameLink: '/',

  // For each route
  nameLink: {
    '/zh-cn/': '#/zh-cn/',
    '/': '#/',
  },
};
```

## nativeEmoji

- Type: `Boolean`
- Default: `false`

Render emoji shorthand codes using GitHub-style emoji images or platform-native emoji characters.

```js
window.$docsify = {
  nativeEmoji: true,
};
```

```markdown
:smile:
:partying_face:
:joy:
:+1:
:-1:
```

GitHub-style images when `false`:

<output data-lang="output">
  <img class="emoji" src="https://github.githubassets.com/images/icons/emoji/unicode/1f604.png" alt="smile">
  <img class="emoji" src="https://github.githubassets.com/images/icons/emoji/unicode/1f973.png" alt="partying_face">
  <img class="emoji" src="https://github.githubassets.com/images/icons/emoji/unicode/1f602.png" alt="joy">
  <img class="emoji" src="https://github.githubassets.com/images/icons/emoji/unicode/1f44d.png" alt="+1">
  <img class="emoji" src="https://github.githubassets.com/images/icons/emoji/unicode/1f44e.png" alt="-1">
</output>

Platform-native characters when `true`:

<output data-lang="output">
  <span class="emoji">😄︎</span>
  <span class="emoji">🥳︎</span>
  <span class="emoji">😂︎</span>
  <span class="emoji">👍︎</span>
  <span class="emoji">👎︎</span>
</output>

To render shorthand codes as text, replace `:` characters with the `&colon;` HTML entity.

```markdown
&colon;100&colon;
```

<output data-lang="output">

&colon;100&colon;

</output>

## noCompileLinks

- Type: `Array<string>`

Sometimes we do not want docsify to handle our links. See [#203](https://github.com/docsifyjs/docsify/issues/203). We can skip compiling of certain links by specifying an array of strings. Each string is converted into to a regular expression (`RegExp`) and the _whole_ href of a link is matched against it.

```js
window.$docsify = {
  noCompileLinks: ['/foo', '/bar/.*'],
};
```

## noEmoji

- Type: `Boolean`
- Default: `false`

Disabled emoji parsing and render all emoji shorthand as text.

```js
window.$docsify = {
  noEmoji: true,
};
```

```markdown
:100:
```

<output data-lang="output">

&colon;100&colon;

</output>

To disable emoji parsing of individual shorthand codes, replace `:` characters with the `&colon;` HTML entity.

```markdown
:100:

&colon;100&colon;
```

<output data-lang="output">

:100:

&colon;100&colon;

</output>

## notFoundPage

- Type: `Boolean` | `String` | `Object`
- Default: `false`

Display default "404 - Not Found" message:

```js
window.$docsify = {
  notFoundPage: false,
};
```

Load the `_404.md` file:

```js
window.$docsify = {
  notFoundPage: true,
};
```

Load the customized path of the 404 page:

```js
window.$docsify = {
  notFoundPage: 'my404.md',
};
```

Load the right 404 page according to the localization:

```js
window.$docsify = {
  notFoundPage: {
    '/': '_404.md',
    '/de': 'de/_404.md',
  },
};
```

> Note: The options for fallbackLanguages don't work with the `notFoundPage` options.

## onlyCover

- Type: `Boolean`
- Default: `false`

Only coverpage is loaded when visiting the home page.

```js
window.$docsify = {
  onlyCover: false,
};
```

## relativePath

- Type: `Boolean`
- Default: `false`

If **true**, links are relative to the current context.

For example, the directory structure is as follows:

```text
.
└── docs
    ├── README.md
    ├── guide.md
    └── zh-cn
        ├── README.md
        ├── guide.md
        └── config
            └── example.md
```

With relative path **enabled** and current URL `http://domain.com/zh-cn/README`, given links will resolve to:

```text
guide.md              => http://domain.com/zh-cn/guide
config/example.md     => http://domain.com/zh-cn/config/example
../README.md          => http://domain.com/README
/README.md            => http://domain.com/README
```

```js
window.$docsify = {
  // Relative path enabled
  relativePath: true,

  // Relative path disabled (default value)
  relativePath: false,
};
```

## repo

- Type: `String`

Configure the repository url, or a string of `username/repo`, to add the [GitHub Corner](http://tholman.com/github-corners/) widget in the top right corner of the site.

```js
window.$docsify = {
  repo: 'docsifyjs/docsify',
  // or
  repo: 'https://github.com/docsifyjs/docsify/',
};
```

## requestHeaders

- Type: `Object`

Set the request resource headers.

```js
window.$docsify = {
  requestHeaders: {
    'x-token': 'xxx',
  },
};
```

Such as setting the cache

```js
window.$docsify = {
  requestHeaders: {
    'cache-control': 'max-age=600',
  },
};
```

## routerMode

Configure the URL format that the paths of your site will use.

- Type: `String`
- Default: `'hash'`

```js
window.$docsify = {
  routerMode: 'history', // default: 'hash'
};
```

For statically-deployed sites (f.e. on GitHub Pages) hash-based routing is
simpler to set up. For websites that can re-write URLs, the history-based format
is better (especially for search-engine optimization, hash-based routing is not
so search-engine friendly)

Hash-based routing means all URL paths will be prefixed with `/#/` in the
address bar. This is a trick that allows the site to load `/index.html`, then it
uses the path that follows the `#` to determine what markdown files to load. For
example, a complete hash-based URL may look like this:
`https://example.com/#/path/to/page`. The browser will actually load
`https://example.com` (assuming your static server serves
`index.html` by default, as most do), and then the Docsify JavaScript code will
look at the `/#/...` and determine the markdown file to load and render.
Additionally, when clicking on a link, the Docsify router will change the
content after the hash dynamically. The value of `location.pathname` will still be
`/` no matter what. The parts of a hash path are _not_ sent to the server when
visiting such a URL in a browser.

On the other hand, history-based routing means the Docsify JavaScript will use
the [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
to dynamically change the URL without using a `#`. This means that all URLs will
be considered "real" by search engines, and the full path will be sent to the
server when visiting the URL in your browser. For example, a URL may look like
`https://example.com/path/to/page`. The browser will try to load that full URL
directly from the server, not just `https://example.com`. The upside of this is
that these types of URLs are much more friendly for search engines, and can be
indexed (yay!). The downside, however, is that your server, or the place where
you host your site files, has to be able to handle these URLs. Various static
website hosting services allow "rewrite rules" to be configured, such that a
server can be configured to always send back `/index.html` no matter what path
is visited. The value of `location.pathname` will show `/path/to/page`, because
it was actually sent to the server.

TLDR: start with `hash` routing (the default). If you feel adventurous, learn
how to configure a server, then switch to `history` mode for better experience
without the `#` in the URL and SEO optimization.

> **Note** If you use `routerMode: 'history'`, you may want to add an
> [`alias`](#alias) to make your `_sidebar.md` and `_navbar.md` files always be
> loaded no matter which path is being visited.
>
> ```js
> window.$docsify = {
>   routerMode: 'history',
>   alias: {
>     '/.*/_sidebar.md': '/_sidebar.md',
>     '/.*/_navbar.md': '/_navbar.md',
>   },
> };
> ```

## routes

- Type: `Object`

Define "virtual" routes that can provide content dynamically. A route is a map between the expected path, to either a string or a function. If the mapped value is a string, it is treated as markdown and parsed accordingly. If it is a function, it is expected to return markdown content.

A route function receives up to three parameters:

1. `route` - the path of the route that was requested (e.g. `/bar/baz`)
2. `matched` - the [`RegExpMatchArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match) that was matched by the route (e.g. for `/bar/(.+)`, you get `['/bar/baz', 'baz']`)
3. `next` - this is a callback that you may call when your route function is async

Do note that order matters! Routes are matched the same order you declare them in, which means that in cases where you have overlapping routes, you might want to list the more specific ones first.

```js
window.$docsify = {
  routes: {
    // Basic match w/ return string
    '/foo': '# Custom Markdown',

    // RegEx match w/ synchronous function
    '/bar/(.*)'(route, matched) {
      return '# Custom Markdown';
    },

    // RegEx match w/ asynchronous function
    '/baz/(.*)'(route, matched, next) {
      fetch('/api/users?id=12345')
        .then(response => {
          next('# Custom Markdown');
        })
        .catch(err => {
          // Handle error...
        });
    },
  },
};
```

Other than strings, route functions can return a falsy value (`null` \ `undefined`) to indicate that they ignore the current request:

```js
window.$docsify = {
  routes: {
    // accepts everything other than dogs (synchronous)
    '/pets/(.+)'(route, matched) {
      if (matched[0] === 'dogs') {
        return null;
      } else {
        return 'I like all pets but dogs';
      }
    }

    // accepts everything other than cats (asynchronous)
    '/pets/(.*)'(route, matched, next) {
      if (matched[0] === 'cats') {
        next();
      } else {
        // Async task(s)...
        next('I like all pets but cats');
      }
    }
  }
}
```

Finally, if you have a specific path that has a real markdown file (and therefore should not be matched by your route), you can opt it out by returning an explicit `false` value:

```js
window.$docsify = {
  routes: {
    // if you look up /pets/cats, docsify will skip all routes and look for "pets/cats.md"
    '/pets/cats'(route, matched) {
      return false;
    }

    // but any other pet should generate dynamic content right here
    '/pets/(.+)'(route, matched) {
      const pet = matched[0];
      return `your pet is ${pet} (but not a cat)`;
    }
  }
}
```

## skipLink

- Type: `Boolean|String|Object`
- Default: `'Skip to main content'`

Determines if/how the site's [skip navigation link](https://webaim.org/techniques/skipnav/) will be rendered.

```js
// Render skip link for all routes (default)
window.$docsify = {
  skipLink: 'Skip to main content',
};
```

```js
// Render localized skip links based on route paths
window.$docsify = {
  skipLink: {
    '/es/': 'Saltar al contenido principal',
    '/de-de/': 'Ga naar de hoofdinhoud',
    '/ru-ru/': 'Перейти к основному содержанию',
    '/zh-cn/': '跳到主要内容',
  },
};
```

```js
// Do not render skip link
window.$docsify = {
  skipLink: false,
};
```

## subMaxLevel

- Type: `Number`
- Default: `0`

Add table of contents (TOC) in custom sidebar.

```js
window.$docsify = {
  subMaxLevel: 2,
};
```

If you have a link to the homepage in the sidebar and want it to be shown as active when accessing the root url, make sure to update your sidebar accordingly:

```markdown
- Sidebar
  - [Home](/)
  - [Another page](another.md)
```

For more details, see [#1131](https://github.com/docsifyjs/docsify/issues/1131).

## themeColor ⚠️

!> Deprecated as of v5. Use the `--theme-color` [theme property](themes#theme-properties) to [customize](themes#customization) your theme color.

- Type: `String`

Customize the theme color.

```js
window.$docsify = {
  themeColor: '#3F51B5',
};
```

## topMargin ⚠️

!> Deprecated as of v5. Use the `--scroll-padding-top` [theme property](themes#theme-properties) to specify a scroll margin when using a sticky navbar.

- Type: `Number|String`
- Default: `0`

Adds scroll padding to the top of the viewport. This is useful when you have added a sticky or "fixed" element and would like auto scrolling to align with the bottom of your element.

```js
window.$docsify = {
  topMargin: 90, // 90, '90px', '2rem', etc.
};
```

## vueComponents

- Type: `Object`

Creates and registers global [Vue](https://vuejs.org/guide/essentials/component-basics.html). Components are specified using the component name as the key with an object containing Vue options as the value. Component `data` is unique for each instance and will not persist as users navigate the site.

```js
window.$docsify = {
  vueComponents: {
    'button-counter': {
      template: `
        <button @click="count += 1">
          You clicked me {{ count }} times
        </button>
      `,
      data() {
        return {
          count: 0,
        };
      },
    },
  },
};
```

```markdown
<button-counter></button-counter>
```

<output data-lang="output">
  <button-counter></button-counter>
</output>

## vueGlobalOptions

- Type: `Object`

Specifies global Vue options for use with Vue content not explicitly mounted with [vueMounts](#mounting-dom-elements), [vueComponents](#components), or a [markdown script](#markdown-script). Changes to global `data` will persist and be reflected anywhere global references are used.

```js
window.$docsify = {
  vueGlobalOptions: {
    data() {
      return {
        count: 0,
      };
    },
  },
};
```

```markdown
<p>
  <button @click="count -= 1">-</button>
  {{ count }}
  <button @click="count += 1">+</button>
</p>
```

<output data-lang="output">
  <p>
    <button @click="count -= 1">-</button>
    {{ count }}
    <button @click="count += 1">+</button>
  </p>
</output>

## vueMounts

- Type: `Object`

Specifies DOM elements to mount as Vue instances and their associated options. Mount elements are specified using a [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) as the key with an object containing Vue options as their value. Docsify will mount the first matching element in the main content area each time a new page is loaded. Mount element `data` is unique for each instance and will not persist as users navigate the site.

```js
window.$docsify = {
  vueMounts: {
    '#counter': {
      data() {
        return {
          count: 0,
        };
      },
    },
  },
};
```

```markdown
<div id="counter">
  <button @click="count -= 1">-</button>
  {{ count }}
  <button @click="count += 1">+</button>
</div>
```

<output id="counter">
  <button @click="count -= 1">-</button>
  {{ count }}
  <button @click="count += 1">+</button>
</output>
