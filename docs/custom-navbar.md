# Custom navbar

## HTML

If you need custom navigation, you can create a HTML-based navigation bar.

!> Note that documentation links begin with `#/`.

```html
<!-- index.html -->

<body>
  <nav>
    <a href="#/">EN</a>
    <a href="#/zh-cn/">中文</a>
  </nav>
  <div id="app"></div>
</body>
```

## Markdown

Alternatively, you can create a custom markdown-based navigation file by setting `loadNavbar` to **true** and creating `_navbar.md`, compare [loadNavbar configuration](configuration.md#loadnavbar).

```html
<!-- index.html -->

<script>
  window.$docsify = {
    loadNavbar: true
  }
</script>
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
```

```markdown
<!-- _navbar.md -->

* [En](/)
* [chinese](/zh-cn/)
```

!> You need to create a `.nojekyll` in `./docs` to prevent GitHub Pages from ignoring files that begin with an underscore.

`_navbar.md` is loaded from each level directory. If the current directory doesn't have `_navbar.md`, it will fall back to the parent directory. If, for example, the current path is `/guide/quick-start`, the `_navbar.md` will be loaded from `/guide/_navbar.md`.

## Nesting

You can create sub-lists by indenting items that are under a certain parent.

```markdown
<!-- _navbar.md -->

* Getting started

  * [Quick start](quickstart.md)
  * [Writing more pages](more-pages.md)
  * [Custom navbar](custom-navbar.md)
  * [Cover page](cover.md)

* Configuration
  * [Configuration](configuration.md)
  * [Themes](themes.md)
  * [Using plugins](plugins.md)
  * [Markdown configuration](markdown.md)
  * [Language highlight](language-highlight.md)
```

renders as

![Nesting navbar](_images/nested-navbar.png 'Nesting navbar')

## Combining custom navbars with the emoji plugin

If you use the [emoji plugin](plugins#emoji):

```html
<!-- index.html -->

<script>
  window.$docsify = {
    // ...
  }
</script>
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
<script src="//unpkg.com/docsify/lib/plugins/emoji.min.js"></script>
```

you could, for example, use flag emojis in your custom navbar Markdown file:

```markdown
<!-- _navbar.md -->

* [:us:, :uk:](/)
* [:cn:](/zh-cn/)
```
