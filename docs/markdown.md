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
    marked.setOptions({ renderer })
    return marked
  }
}
```

## Supports front matter

```html
<script src="//unpkg.com/js-yaml@3/dist/js-yaml.js"></script>
<script src="//unpkg.com/yaml-front-matter@4/dist/yamlFront.js"></script>
<script>
window.$docsify = {
  markdown: function(marked, renderer) {
    let lexer = marked.lexer
    marked.lexer = function (text, options) {
      let parsed = yamlFront.loadFront(text)
      let cKey = '__content'
      let table = [
        [],
        [],
        []
      ]
      for (let k in parsed) {
        if (k === cKey) {
          continue
        }
        table[0].push(k)
        table[1].push('---')
        table[2].push(parsed[k])
      }
      let tableMd = table.map(row => row.join('|')).join('\n')
      return lexer(tableMd + '\n' + parsed[cKey], options)
    }
    marked.setOptions({ renderer })
    return marked
  }
}
</script>
```

## Supports mermaid

```js
// Import mermaid
//  <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.css">
//  <script src="//cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>

var num = 0;
mermaid.initialize({ startOnLoad: false });

window.$docsify = {
  markdown: {
    renderer: {
      code: function(code, lang) {
        if (lang === "mermaid") {
          return (
            '<div class="mermaid">' + mermaid.render('mermaid-svg-' + num++, code) + "</div>"
          );
        }
        return this.origin.code.apply(this, arguments);
      }
    }
  }
}
```
