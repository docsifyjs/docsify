# Using plugins

## List of Plugins

### Full text search

By default, the hyperlink on the current page is recognized and the content is saved in `localStorage`. You can also specify the path to the files.


```html
<script>
  window.$docsify = {
    search: 'auto', // default

    search : [
      '/',            // => /README.md
      '/guide',       // => /guide.md
      '/get-started', // => /get-started.md
      '/zh-cn/',      // => /zh-cn/README.md
    ],

    // 完整配置参数
    search: {
      maxAge: 86400000, // Expiration time, the default one day
      paths: [], // or 'auto'
      placeholder: 'Type to search',

      // Localization
      placeholder: {
        '/zh-cn/': '搜索',
        '/': 'Type to search'
      }
    }
  }
</script>
<script src="//unpkg.com/docsify"></script>
<script src="//unpkg.com/docsify/lib/plugins/search.js"></script>
```


### Google Analytics

Install the plugin and configure the track id.

```html
<script>
  window.$docsify = {
    ga: 'UA-XXXXX-Y'
  }
</script>
<script src="//unpkg.com/docsify"></script>
<script src="//unpkg.com/docsify/lib/plugins/ga.js"></script>
```

Configure by `data-ga`.


```html
<script src="//unpkg.com/docsify" data-ga="UA-XXXXX-Y"></script>
<script src="//unpkg.com/docsify/lib/plugins/ga.js"></script>
```


## Write a plugin

A plugin is simply a function that takes `hook` as arguments.
The hook supports handling asynchronous tasks.

#### Full configuration

```js
window.$docsify = {
 plugins: [
  function (hook, vm) {
    hook.init(function() {
      // Called when the script starts running, only trigger once, no arguments,
    })

    hook.beforeEach(function(content) {
      // Invoked each time before parsing the Markdown file.
      // ...
      return content
    })

    hook.afterEach(function(html, next) {
      // Invoked each time after the Markdown file is parsed.
      // beforeEach and afterEach support asynchronous。
      // ...
      // call `next(html)` when task is done.
      next(html)
    })

    hook.doneEach(function() {
      // Invoked each time after the data is fully loaded, no arguments,
      // ...
    })

    hook.mounted(function() {
      // Called after initial completion. Only trigger once, no arguments.
    })

    hook.ready(function() {
      // Called after initial completion, no arguments.
    })
  }
 ]
}
```

!> You can get internal methods through `window.Docsify`. Get the current instance through the second argument.

#### Example

Add footer component in each pages.

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
