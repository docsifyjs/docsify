# 配置项

docsify 有两种配置参数的方式。一种是配置在 `window.$docsify` 里，另一种是给 `script` 标签添加 `data-*` 属性。

```html
<!-- 方法 1 -->
<script>
  window.$docsify = {
    repo: 'QingWei-Li/docsify',
    maxLevel: 3,
    coverpage: true
  }
</script>

<!-- 方法 2 -->
<script
  src="//unpkg.com/docsify"
  data-repo="QingWei-Li/docsify"
  data-max-level="3"
  data-coverpage>
</script>
```

两种方式可以共存，推荐第一种做法——直接配置 `window.$docsify` 对象——这会让你的配置更加清晰，同时也可以方便的将配置单独写到另一个文件里。

!> 通过 `window.$docsify` 配置属性，需要将属性改成驼峰命名法。通过 `data-*` 属性配置，保持短横线的命名规则。


## el

- 类型：`String`
- 默认值：`#app`

docsify 初始化的挂载元素，可以是一个 CSS 选择器，默认为 `#app` 如果不存在就直接绑定在 `body` 上。

```js
window.$docsify = {
  el: '#app'
}
```

## repo

- 类型：`String`
- 默认值: `null`

配置仓库地址或者 `username/repo` 的字符串，会在页面右上角渲染一个 [GitHub Corner](http://tholman.com/github-corners/) 挂件。

```js
window.$docsify = {
  repo: 'QingWei-Li/docsify',
  // or
  repo: 'https://github.com/QingWei-Li/docsify/'
}
```


## max-level

- 类型：`Number`
- 默认值: `6`

默认情况下会抓取文档中所有标题渲染成目录，可配置最大支持渲染的标题层级。


```js
window.$docsify = {
  maxLevel: 4
}
```

## load-navbar

- 类型：`Boolean|String`
- 默认值: `false`

加载自定义导航栏，参考[定制导航栏](zh-cn/custom-navbar) 了解用法。设置为 `true` 后会加载 `_navbar.md` 文件，也可以自定义加载的文件名。

```js
window.$docsify = {
  // 加载 _navbar.md
  loadNavbar: true,

  // 加载 nav.md
  loadNavbar: 'nav.md'
}
```

## load-sidebar

- 类型：`Boolean|String`
- 默认值: `false`

加载自定义侧边栏，参考[多页文档](zh-cn/more-pages)。设置为 `true` 后会加载 `_sidebar.md` 文件，也可以自定义加载的文件名。

```js
window.$docsify = {
  // 加载 _sidebar.md
  loadSidebar: true,

  // 加载 summary.md
  loadSidebar: 'summary.md'
}
```

## sub-max-level

- 类型：`Number`
- 默认值: `0`

自定义侧边栏后默认不会再生成目录，你也可以通过设置生成目录的最大层级开启这个功能，


```js
window.$docsify = {
  subMaxLevel: 3
}
```


## auto2top

- 类型：`Boolean`
- 默认值: `false`

切换页面后是否自动跳转到页面顶部。

```js
window.$docsify = {
  auto2top: true
}
```


## homepage

- 类型：`String`
- 默认值: `README.md`

设置首页文件加载路径。适合不想将 `README.md` 作为入口文件渲染，或者是文档存放在其他位置的情况使用。

```js
window.$docsify = {
  // 入口文件改为 /home.md
  homepage: 'home.md',

  // 文档和仓库根目录下的 README.md 内容一致
  homepage: 'https://raw.githubusercontent.com/QingWei-Li/docsify/master/README.md'
}
```

## base-path

- 类型：`String`

文档加载的根路径，可以是二级路径或者是其他域名的路径。

```js
window.$docsify = {
  basePath: '/path/',

  // 直接渲染其他域名的文档
  basePath: 'https://docsify.js.org/',

  // 甚至直接渲染其他仓库 readme
  basePath: 'https://raw.githubusercontent.com/ryanmcdermott/clean-code-javascript/master/'
}
```


## coverpage

- 类型：`Boolean|String`
- 默认值: `false`

启用[封面页](/zh-cn/cover)。开启后是加载 `_coverpage.md` 文件，也可以自定义文件名。

```js
window.$docsify = {
  coverpage: true,

  // 自定义文件名
  coverpage: 'cover.md'
}
```

## name

- 类型：`String`


文档标题，会显示在侧边栏顶部。

```js
window.$docsify = {
  name: 'docsify'
}
```

## name-link

- 类型：`String`
- 默认值：`window.location.pathname`

点击文档标题后跳转的链接地址。

```js
window.$docsify = {
  nameLink: '/'
}
```

## markdown

- 类型: `Function`

参考 [Markdown 配置](/zh-cn/markdown)。

```js
window.$docsify = {
  markdown: function (marked, renderer) {
    // ...
    return marked
  }
}
```

## theme-color

- 类型：`String`

替换主题色。利用 [CSS3 支持变量]((https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables)的特性，对于老的浏览器有 polyfill 处理。

```js
window.$docsify = {
  themeColor: '#3F51B5'
}
```

## alias

- 类型：`Object`

定义路由别名，可以更自由的定义路由规则。


```js
window.$docsify = {
  alias: {
    '/zh-cn/changelog': '/changelog',
    '/changelog': 'https://raw.githubusercontent.com/QingWei-Li/docsify/master/CHANGELOG'
  }
}
```

