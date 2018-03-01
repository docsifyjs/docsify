# 配置项

你可以配置在 `window.$docsify` 里。

```html
<script>
  window.$docsify = {
    repo: 'QingWei-Li/docsify',
    maxLevel: 3,
    coverpage: true
  }
</script>
```

## el

* 类型：`String`
* 默认值：`#app`

docsify 初始化的挂载元素，可以是一个 CSS 选择器，默认为 `#app` 如果不存在就直接绑定在 `body` 上。

```js
window.$docsify = {
  el: '#app'
};
```

## repo

* 类型：`String`
* 默认值: `null`

配置仓库地址或者 `username/repo` 的字符串，会在页面右上角渲染一个 [GitHub Corner](http://tholman.com/github-corners/) 挂件。

```js
window.$docsify = {
  repo: 'QingWei-Li/docsify',
  // or
  repo: 'https://github.com/QingWei-Li/docsify/'
};
```

## max-level

* 类型：`Number`
* 默认值: `6`

默认情况下会抓取文档中所有标题渲染成目录，可配置最大支持渲染的标题层级。

```js
window.$docsify = {
  maxLevel: 4
};
```

## maxLevel

* Type: `Number`
* Default: `6`

Maximum Table of content level.

```js
window.$docsify = {
  maxLevel: 4
};
```

## loadNavbar

* 类型：`Boolean|String`
* 默认值: `false`

加载自定义导航栏，参考[定制导航栏](zh-cn/custom-navbar.md) 了解用法。设置为 `true` 后会加载 `_navbar.md` 文件，也可以自定义加载的文件名。

```js
window.$docsify = {
  // 加载 _navbar.md
  loadNavbar: true,

  // 加载 nav.md
  loadNavbar: 'nav.md'
};
```

## loadSidebar

* 类型：`Boolean|String`
* 默认值: `false`

加载自定义侧边栏，参考[多页文档](zh-cn/more-pages.md)。设置为 `true` 后会加载 `_sidebar.md` 文件，也可以自定义加载的文件名。

```js
window.$docsify = {
  // 加载 _sidebar.md
  loadSidebar: true,

  // 加载 summary.md
  loadSidebar: 'summary.md'
};
```

## subMaxLevel

* 类型：`Number`
* 默认值: `0`

自定义侧边栏后默认不会再生成目录，你也可以通过设置生成目录的最大层级开启这个功能。

```js
window.$docsify = {
  subMaxLevel: 2
};
```

## auto2top

* 类型：`Boolean`
* 默认值: `false`

切换页面后是否自动跳转到页面顶部。

```js
window.$docsify = {
  auto2top: true
};
```

## homepage

* 类型：`String`
* 默认值: `README.md`

设置首页文件加载路径。适合不想将 `README.md` 作为入口文件渲染，或者是文档存放在其他位置的情况使用。

```js
window.$docsify = {
  // 入口文件改为 /home.md
  homepage: 'home.md',

  // 文档和仓库根目录下的 README.md 内容一致
  homepage:
    'https://raw.githubusercontent.com/QingWei-Li/docsify/master/README.md'
};
```

## basePath

* 类型：`String`

文档加载的根路径，可以是二级路径或者是其他域名的路径。

```js
window.$docsify = {
  basePath: '/path/',

  // 直接渲染其他域名的文档
  basePath: 'https://docsify.js.org/',

  // 甚至直接渲染其他仓库 readme
  basePath:
    'https://raw.githubusercontent.com/ryanmcdermott/clean-code-javascript/master/'
};
```

## coverpage

* 类型：`Boolean|String`
* 默认值: `false`

启用[封面页](zh-cn/cover.md)。开启后是加载 `_coverpage.md` 文件，也可以自定义文件名。

```js
window.$docsify = {
  coverpage: true,

  // 自定义文件名
  coverpage: 'cover.md',

  // mutiple covers
  coverpage: ['/', '/zh-cn/'],

  // mutiple covers and custom file name
  coverpage: {
    '/': 'cover.md',
    '/zh-cn/': 'cover.md'
  }
};
```

## name

* 类型：`String`

文档标题，会显示在侧边栏顶部。

```js
window.$docsify = {
  name: 'docsify'
};
```

## nameLink

* 类型：`String`
* 默认值：`window.location.pathname`

点击文档标题后跳转的链接地址。

```js
window.$docsify = {
  nameLink: '/',

  // 按照路由切换
  nameLink: {
    '/zh-cn/': '/zh-cn/',
    '/': '/'
  }
};
```

## markdown

* 类型: `Object|Function`

参考 [Markdown 配置](zh-cn/markdown.md)。

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
  markdown: function(marked, renderer) {
    // ...
    return marked;
  }
};
```

## themeColor

* 类型：`String`

替换主题色。利用 [CSS3 支持变量](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables)的特性，对于老的浏览器有 polyfill 处理。

```js
window.$docsify = {
  themeColor: '#3F51B5'
};
```

## alias

* 类型：`Object`

定义路由别名，可以更自由的定义路由规则。 支持正则。

```js
window.$docsify = {
  alias: {
    '/foo/(+*)': '/bar/$1', // supports regexp
    '/zh-cn/changelog': '/changelog',
    '/changelog':
      'https://raw.githubusercontent.com/QingWei-Li/docsify/master/CHANGELOG',
    '/.*/_sidebar.md': '/_sidebar.md' // See #301
  }
};
```

## autoHeader

* 类型：`Boolean`

同时设置 `loadSidebar` 和 `autoHeader` 后，可以根据 `_sidebar.md` 的内容自动为每个页面增加标题。[#78](https://github.com/QingWei-Li/docsify/issues/78)

```js
window.$docsify = {
  loadSidebar: true,
  autoHeader: true
};
```

## executeScript

* 类型：`Boolean`

执行文档里的 script 标签里的脚本，只执行第一个 script ([demo](zh-cn/themes.md))。 如果 Vue 存在，则自动开启。

```js
window.$docsify = {
  executeScript: true
};
```

```markdown
## This is test

<script>
  console.log(2333)
</script>
```

注意如果执行的是一个外链脚本，比如 jsfiddle 的内嵌 demo，请确保引入 [external-script](plugins.md?id=外链脚本-external-script) 插件。

## noEmoji

* type: `Boolean`

禁用 emoji 解析。

```js
window.$docsify = {
  noEmoji: true
};
```

## mergeNavbar

* type: `Boolean`

小屏设备下合并导航栏到侧边栏。

```js
window.$docsify = {
  mergeNavbar: true
};
```

## formatUpdated

* type: `String|Function`

我们可以显示文档更新日期通过 **{docsify-updated<span>}</span>** 变量. 并且格式化日期通过 `formatUpdated`。参考 https://github.com/lukeed/tinydate#patterns

```js
window.$docsify = {
  formatUpdated: '{MM}/{DD} {HH}:{mm}',

  formatUpdated: function(time) {
    // ...

    return time;
  }
};
```

## externalLinkTarget

* type: `String`
* default: `_blank`

当前默认为 \_blank, 配置一下就可以：

```js
window.$docsify = {
  externalLinkTarget: '_self' // default: '_blank'
};
```

## routerMode

* type: `String`
* default: `history`

```js
window.$docsify = {
  routerMode: 'history' // default: 'hash'
};
```

## noCompileLinks

* 类型: `Array`

有时我们不希望 docsify 处理我们的链接。 参考 [#203](https://github.com/QingWei-Li/docsify/issues/203)

```js
window.$docsify = {
  noCompileLinks: ['/foo', '/bar/.*']
};
```

## requestHeaders

* type: `Object`

设置请求资源的请求头。

```js
window.$docsify = {
  requestHeaders: {
    'x-token': 'xxx'
  }
};
```

## ext

* type: `String`

资源的文件扩展名。

```js
window.$docsify = {
  ext: '.md'
};
```

## fallbackLanguages

* type: `Array<string>`

List of languages that will fallback to the default language when a page is request and didn't exists for the given local.

Example:

* try to fetch the page of `/de/overview`. If this page exists, it'll be displayed
* then try to fetch the default page `/overview` (depending on the default language). If this page exists, it'll be displayed
* then display 404 page.

```js
window.$docsify = {
  fallbackLanguages: ['fr', 'de']
};
```
