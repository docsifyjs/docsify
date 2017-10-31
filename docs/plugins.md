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

Exclude the special image

```markdown
![](image.png ':no-zoom')
```


## Edit on github

Add `Edit on github` button on every pages. provided by 3rd party, check [document](https://github.com/njleonzhang/docsify-edit-on-github)

## Demo code with instant preview and jsfiddle integration

With this plugin, sample code can be rendered on the page instantly, so that the readers can see the preview immediately.
When readers expand the demo box, the source code and description are shown there. if they click the button `Try in Jsfiddle`,
`jsfiddle.net` will be open with the code of this sample, which allow readers to revise the code and try on their own.

[Vue](https://njleonzhang.github.io/docsify-demo-box-vue/) and [React](https://njleonzhang.github.io/docsify-demo-box-react/) are both supported.

## CodeSponsor

See https://codesponsor.io

```html
<script>
  window.$docsify = {
    codesponsor: 'id'
  }
</script>
<script src="//unpkg.com/docsify/lib/plugins/codesponsor.min.js"></script>
```

## Copy to Clipboard

Add a simple `Click to copy` button to all preformatted code blocks to effortlessly allow users to copy example code from your docs.

```html
<link rel="stylesheet" href="//unpkg.com/docsify-copy-code/styles.css">
<script src="//unpkg.com/docsify-copy-code/index.js"></script>
```

```javascript
window.$docsify = {
  plugins: [
    window.DocsifyCopyCodePlugin.init()
  ]
}
```

See [here](https://github.com/jperasmus/docsify-copy-code/blob/master/README.md) for more details.
