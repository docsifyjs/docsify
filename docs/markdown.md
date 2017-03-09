# Markdown configuration

**docsify** uses [marked](https://github.com/chjj/marked) as its Markdown parser. You can customize how it renders your Markdown content to HTML by customizing `renderer`:

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
