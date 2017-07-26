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

    // complete configuration parameters
    search: {
      maxAge: 86400000, // Expiration time, the default one day
      paths: [], // or 'auto'
      placeholder: 'Type to search',

      // Localization
      placeholder: {
        '/zh-cn/': '搜索',
        '/': 'Type to search'
      },

      noData: 'No Results!',

      // Localization
      noData: {
        '/zh-cn/': '找不到结果',
        '/': 'No Results'
      },

      // Headline depth, 1 - 6
      depth: 2
    }
  }
</script>
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
<script src="//unpkg.com/docsify/lib/plugins/search.min.js"></script>
```

## Google Analytics

Install the plugin and configure the track id.

```html
<script>
  window.$docsify = {
    ga: 'UA-XXXXX-Y'
  }
</script>
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
<script src="//unpkg.com/docsify/lib/plugins/ga.min.js"></script>
```

Configure by `data-ga`.

```html
<script src="//unpkg.com/docsify/lib/docsify.min.js" data-ga="UA-XXXXX-Y"></script>
<script src="//unpkg.com/docsify/lib/plugins/ga.min.js"></script>
```

## front matter

```html
<script src="//unpkg.com/docsify/lib/plugins/front-matter.min.js"></script>
```

## emoji

The default is to support parsing emoji. For example `:100:` will be parsed to :100:. But it is not precise because there is no matching non-emoji string. If you need to correctly parse the emoji string, you need install this plugin.

```html
<script src="//unpkg.com/docsify/lib/plugins/emoji.min.js"></script>
```

## External Script

If the script on the page is an external one (imports a js file via `src` attribute), you'll need this plugin to make it work.

```html
<script src="//unpkg.com/docsify/lib/plugins/external-script.min.js"></script>
```

## Zoom image

Medium's Image Zoom. Based on [zoom-image](https://github.com/egoist/zoom-image).

```html
<script src="//unpkg.com/docsify/lib/plugins/zoom-image.min.js"></script>
```
