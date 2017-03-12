# Themes

Es gibt im Moment vier Themes zur Auswahl, ähnlich wie die Webseiten von [Vue](//vuejs.org) oder [buble](//buble.surge.sh), sowie eine weitere, dunkle von [@liril-net](https://github.com/liril-net).

```html
<link rel="stylesheet" href="//unpkg.com/docsify/themes/vue.css">
<link rel="stylesheet" href="//unpkg.com/docsify/themes/buble.css">
<link rel="stylesheet" href="//unpkg.com/docsify/themes/dark.css">
<link rel="stylesheet" href="//unpkg.com/docsify/themes/pure.css">
```

!> Komprimierte Dateien sind über `/lib/themes/` verfügbar.

```html
<!-- komprimierte Versionen -->

<link rel="stylesheet" href="//unpkg.com/docsify/lib/themes/vue.css">
<link rel="stylesheet" href="//unpkg.com/docsify/lib/themes/buble.css">
<link rel="stylesheet" href="//unpkg.com/docsify/lib/themes/dark.css">
<link rel="stylesheet" href="//unpkg.com/docsify/lib/themes/pure.css">
```

Solltest du weitere Themes erstellen, kannst du sie gerne der Allgemeinheit mit einem [pull request](https://github.com/QingWei-Li/docsify/pulls) zur Verfügung stellen.

#### Klicke hier für eine Vorschau

<div class="demo-theme-preview">
  <a data-theme="vue">vue.css</a>
  <a data-theme="buble">buble.css</a>
  <a data-theme="dark">dark.css</a>
  <a data-theme="pure">pure.css</a>
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
  var preview = Docsify.dom.find('.demo-theme-preview');
  var themes = Docsify.dom.findAll('[rel="stylesheet"]');

  preview.onclick = function (e) {
    var title = e.target.getAttribute('data-theme')

    themes.forEach(function (theme) {
      theme.disabled = theme.title !== title
    });
  };
</script>
