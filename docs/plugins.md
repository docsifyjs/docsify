# List of Plugins

## Full text search

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


## Google Analytics

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

## emoji

The default is to support parsing emoji. For example `:100:` will be parsed to :100:. But it is not precise because there is no matching non-emoji string. If you need to correctly parse the emoji string, you need install this plugin.


```html
<script src="//unpkg.com/docsify/lib/plugins/emoji.js"></script>
```

