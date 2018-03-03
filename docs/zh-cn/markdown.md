# Markdown 配置

内置的 Markdown 解析器是 [marked](https://github.com/markedjs/marked)，可以修改它的配置。同时可以直接配置 `renderer`。

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

?> 完整配置参数参考 [marked 文档](https://github.com/markedjs/marked#options-1)

当然也可以完全定制 Markdown 解析规则。

```js
window.$docsify = {
  markdown: function(marked, renderer) {
    // ...

    return marked
  }
}
```


## 支持 mermaid

```js
// Import mermaid
//  <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.css">
//  <script src="//cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>

mermaid.initialize({ startOnLoad: false });

window.$docsify = {
  markdown: {
    renderer: {
      code: function(code, lang) {
        if (lang === "mermaid") {
          return (
            '<div class="mermaid">' + mermaid.render(lang, code) + "</div>"
          );
        }
        return this.origin.code.apply(this, arguments);
      }
    }
  }
}
```
