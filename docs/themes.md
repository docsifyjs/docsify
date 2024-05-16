# Themes

There is a handful of themes available, both official and community-made. Copy [Vue](//vuejs.org) and [buble](//buble.surge.sh) website custom theme and [@liril-net](https://github.com/liril-net) contribution to the theme of the black style.

<!-- prettier-ignore-start -->
```html
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/vue.min.css" />
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/buble.min.css" />
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/dark.min.css" />
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/pure.min.css" />
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/dolphin.min.css" />
```
<!-- prettier-ignore-end -->

!> Compressed files are available in `/dist/themes/`.

<!-- prettier-ignore-start -->
```html
<!-- compressed -->

<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/dist/themes/vue.min.css" />
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/dist/themes/buble.min.css" />
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/dist/themes/dark.min.css" />
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/dist/themes/pure.min.css" />
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/dist/themes/dolphin.min.css" />
```
<!-- prettier-ignore-end -->

If you have any ideas or would like to develop a new theme, you are welcome to submit a [pull request](https://github.com/docsifyjs/docsify/pulls).

#### Click to preview

<div class="demo-theme-preview">
  <a data-theme="vue">Vue Theme</a>
  <a data-theme="buble">Buble Theme</a>
  <a data-theme="dark">Dark Theme</a>
  <a data-theme="pure">Pure Theme</a>
  <a data-theme="dolphin">Dolphin Theme</a>
</div>

<style>
  .demo-theme-preview a {
    padding-right: 10px;
  }

  .demo-theme-preview a:hover {
    cursor: pointer;
    text-decoration: underline;
  }
</style>

<script>
  const preview = Docsify.dom.find('.demo-theme-preview');
  const themes = Docsify.dom.findAll('[rel="stylesheet"]');

  preview.onclick = function (e) {
    const title = e.target.getAttribute('data-theme');

    themes.forEach(theme => {
      theme.disabled = theme.title !== title;
    });
  };
</script>

## Other themes

- [docsify-themeable](https://jhildenbiddle.github.io/docsify-themeable/#/) A delightfully simple theme system for docsify.
