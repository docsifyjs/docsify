# Markdown configuration

The Markdown parser is [marked](https://github.com/chjj/marked). You can customize how docsify renders your Markdown content to HTML. Support customize `renderer`.

```js
window.$docsify = {
  markdown: {
    smartypants: true,
    renderer: {
      link: function() {
        // ...
      }
    }
  }
}
```

?> Configuration Options Reference [marked documentation](https://github.com/chjj/marked#options-1)

Even you can completely customize the parsing rules.

```js
window.$docsify = {
  markdown: function(marked, renderer) {
    // ...

    return marked
  }
}
```
