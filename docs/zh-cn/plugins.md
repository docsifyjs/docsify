# 使用插件

## 内置插件

### 全文检索 - Search

全文检索插件会根据当前页面上的超链接获取文档内容，在 `localStorage` 内建立文档索引。默认过期时间为一天，当然我们可以自己指定需要缓存的文件列表或者配置过期时间。


```html
<script>
  window.$docsify = {
    search: 'auto', // 默认值

    search : [
      '/',            // => /README.md
      '/guide',       // => /guide.md
      '/get-started', // => /get-started.md
      '/zh-cn/',      // => /zh-cn/README.md
    ],

    // 完整配置参数
    search: {
      maxAge: 86400000, // 过期时间，单位毫秒，默认一天
      paths: [], // or 'auto'
      placeholder: 'Type to search'
    }
  }
</script>
<script src="//unpkg.com/docsify"></script>
<script src="//unpkg.com/docsify/lib/plugins/search.js"></script>
```

### 谷歌统计 - Google Analytics

需要配置 track id 才能使用。

```html
<script>
  window.$docsify = {
    ga: 'UA-XXXXX-Y'
  }
</script>
<script src="//unpkg.com/docsify"></script>
<script src="//unpkg.com/docsify/lib/plugins/ga.js"></script>
```

也可以通过 `data-ga` 配置 id。

```html
<script src="//unpkg.com/docsify" data-ga="UA-XXXXX-Y"></script>
<script src="//unpkg.com/docsify/lib/plugins/ga.js"></script>
```

## 自定义插件

docsify 提供了一套插件机制，其中提供的钩子（hook）支持处理异步逻辑，可以很方便的扩展功能。

#### 完整功能

```js
window.$docsify = {
 plugins: [
  function (hook) {
    hook.init(function() {
      // 初始化时调用，只调用一次，没有参数。
    })

    hook.beforeEach(function(content) {
      // 每次开始解析 Markdown 内容时调用
      // ...
      return content
    })

    hook.afterEach(function(html, next) {
      // 解析成 html 后调用。beforeEach 和 afterEach 支持处理异步逻辑
      // ...
      // 异步处理完成后调用 next(html) 返回结果
      next(html)
    })

    hook.doneEach(function() {
      // 每次路由切换时数据全部加载完成后调用，没有参数。
      // ...
    })

    hook.ready(function() {
      // 初始化完成后调用，只调用一次，没有参数。
    })
  }
 ]
}
```

!> 如果需要用 docsify 的内部方法，可以通过 `window.Docsify.utils` 获取。

#### 例子

给每个页面的末尾加上 `footer`

```js
window.$docsify = {
  plugins: [
    function (hook) {
      var footer = [
        '<hr/>',
        '<footer>',
        '<span><a href="https://github.com/QingWei-Li">cinwell</a> &copy;2017.</span>',
        '<span>Proudly published with <a href="https://github.com/QingWei-Li/docsify" target="_blank">docsify</a>.</span>',
        '</footer>'
      ].join('')

      hook.afterEach(function (html) {
        return html + footer
      })
    }
  ]
}
```
