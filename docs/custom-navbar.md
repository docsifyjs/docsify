# Custom navbar

You can create navbar in HTML file. But note that the link begins with `#/`.

*index.html*

```html
<body>
  <nav>
    <a href="#/">EN</a>
    <a href="#/zh-cn/">中文</a>
  </nav>
  <div id="app"></div>
</body>
```

## Writing by Markdown

You can custom navbar by Markdown file. Set the `loadNavbar` to **true** and create a `_navbar.md`. The detail in [Configuration#load-navbar](configuration#load-navbar).

*index.html*


```html
<script>
  window.$docsify = {
    loadNavbar: true
  }
</script>
<script src="//unpkg.com/docsify"></script>
```

*_navbar.md*


```markdown
- [En](/)
- [chinese](/zh-cn/)
```

`_navbar.md` is loaded from each level directory. If this directory doesn't have `_navbar.md`, it will fallback to parent directory. For example, the current path is `/guide/quick-start`,  the `_navbar.md` will be loaded from `/guide/_navbar.md`.

## Nesting

You can create sub-lists by indenting items that are under a certain parent.

```markdown
- Getting started
 - [Quick start](/quickstart)
 - [Writing more pages](/more-pages)
 - [Custom navbar](/custom-navbar)
 - [Cover page](/cover)

- Configuration
  - [Configuration](/configuration)
  - [Themes](/themes)
  - [Using plugins](/plugins)
  - [Markdown configuration](/markdown)
  - [Lanuage highlight](/language-highlight)
```

Example.

![Nesting navbar](_images/nested-navbar.png "Nesting navbar")


