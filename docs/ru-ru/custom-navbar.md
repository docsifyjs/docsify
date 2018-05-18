# Настройка навигации

## HTML

Если вам нужна настраиваемая навигация, вы можете создать навигационную панель на основе HTML.

!> Обратите внимание, что ссылки на документацию начинаются с `#/`.

```html
<!-- index.html -->

<body>
  <nav>
    <a href="#/">EN</a>
    <a href="#/zh-cn/">中文</a>
    <a href="#/ru-ru/">russian</a>
  </nav>
  <div id="app"></div>
</body>
```

## Markdown

Кроме того, вы можете создать настраиваемый файл навигации, установив `loadNavbar` в **true** и создав `_navbar.md`, подробнее [loadNavbar конфигурация](ru-ru/configuration.md#loadnavbar).

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
* [russian](/ru-ru/)
```

!> Вам нужно создать `.nojekyll` в `./docs`, чтобы при использовании GitHub Pages не игнорировались файлы, начинающиеся с подчеркивания.

`_navbar.md` загружается на каждом уровне директории. Если текущий каталог не имеет `_navbar.md`, он вернется в родительский каталог. Если, например, текущий путь `/guide/quick-start`, `_navbar.md` будет загружен из `/guide/_navbar.md`.

## Вложенность

Вы можете создавать суб-списки с помощью отступов, находящихся под определенным родителем.

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

отображается как

![Nesting navbar](../_images/nested-navbar.png 'Nesting navbar')

## Объединение navbars с плагином emoji

Если вы используете [emoji plugin](ru-ru/plugins#emoji):

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

вы можете, например, использовать флаг emojis в вашем настраиваемом navbar файла Markdown:

```markdown
<!-- _navbar.md -->

* [:us:, :uk:](/)
* [:cn:](/zh-cn/)
```


