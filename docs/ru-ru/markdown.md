# Markdown конфигурация

**docsify** использует его [разметку](https://github.com/chjj/marked) как анализатор Markdown. Вы можете настроить способ рендеринга вашего контента Markdown в HTML, настроив `renderer`:

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

?> Ссылка на опции конфигурации [разметки документа](https://github.com/chjj/marked#options-1)

Даже вы можете полностью настроить правила синтаксического парсинга.

```js
window.$docsify = {
  markdown: function(marked, renderer) {
    // ...

    return marked
  }
}
```

## Поддержка mermaid

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


