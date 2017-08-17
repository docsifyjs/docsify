# Markdown Einstellungen

**docsify** verwendet [marked](https://github.com/chjj/marked), um Markdown umzuwandeln. Du kannst einstellen, wie es deine Markdown Seiten in HTML umwandelt, indem du `renderer` konfigurierst:

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

?> Für mögliche Einstellungen, siehe [marked Dokumentation](https://github.com/chjj/marked#options-1)

Du kannst die Regeln auch beliebig anpassen.

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

