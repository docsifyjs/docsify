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
