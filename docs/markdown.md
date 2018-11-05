# Markdown configuration

**docsify** uses [marked](https://github.com/markedjs/marked) as its Markdown parser. You can customize how it renders your Markdown content to HTML by customizing `renderer`:

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

?> Configuration Options Reference [marked documentation](https://marked.js.org/#/USING_ADVANCED.md)

Even you can completely customize the parsing rules.

```js
window.$docsify = {
  markdown: function(marked, renderer) {
    // ...

    return marked
  }
}
```

## Supports mermaid

```js
// Import mermaid
//  <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.css">
//  <script src="//cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>

function makeid(len) {
  var text = new Array(len);
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  for (var i = 0; i < len; i++) text[i] = possible.charAt(Math.floor(Math.random() * possible.length));
  return text.join("");
}
mermaid.initialize({ startOnLoad: false });

window.$docsify = {
  markdown: {
    renderer: {
      code: function(code, lang) {
        if (lang === "mermaid") {
          let id = makeid(10);
          return (
            '<div class="mermaid">' + mermaid.render(id, code) + "</div>"
          );
        }
        return this.origin.code.apply(this, arguments);
      }
    }
  }
}
```
