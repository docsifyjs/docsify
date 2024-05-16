# Themes

Docsify offers several official themes to choose from. Click a theme name below to preview each theme.

- <a href="#" data-theme="vue">Vue</a>
- <a href="#" data-theme="buble">Buble</a>
- <a href="#" data-theme="dark">Dark</a>
- <a href="#" data-theme="pure">Pure</a>
- <a href="#" data-theme="dolphin">Dolphin</a>

Official themes are available on multiple [CDNs](cdn). Uncompressed themes are also available by omitting the `.min` from the filename.

<!-- prettier-ignore -->
```html
<!-- Vue -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/vue.min.css" />

<!-- Buble -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/buble.min.css" />

<!-- Dark -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/dark.min.css" />

<!-- Pure -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/pure.min.css" />

<!-- Dolphin -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/dolphin.min.css" />
```

## Endorsed

The Docsify team endorses the following third-party themes. Click a link below the learn more.

- [docsify-themeable](https://jhildenbiddle.github.io/docsify-themeable) - A delightfully simple theme system for docsify.

## More Themes

See [Awesome Docsify](awesome) for more themes.

<script>
  const previewElm = Docsify.dom.findAll('a[data-theme]');
  const stylesheetElms = Docsify.dom.findAll('link[rel="stylesheet"]');

  previewElm.forEach(elm => {
    elm.onclick = (e) => {
      e.preventDefault();
      const title = e.target.getAttribute('data-theme');

      stylesheetElms.forEach(theme => {
        theme.disabled = theme.title !== title;
      });
    };
  });

</script>
