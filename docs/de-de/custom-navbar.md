# Navigationsleiste anpassen

## HTML

Solltest du eine Navigationsleiste benötigen, so kannst du eine HTML-basierte erstellen.

!> Die Links der Dokumentation fangen alle mit `#/` an.

```html
<!-- index.html -->

<body>
  <nav>
    <a href="#/">EN</a>
    <a href="#/de-de/">DE</a>
  </nav>
  <div id="app"></div>
</body>
```

## Markdown

Oder du kannst deine Navigationsleiste mit einer Datei basierend auf Markdown erstellen, indem du `loadNavbar` auf **true** setzt und eine Datei namens `_navbar.md` erstellst, vergleiche [load-navbar Einstellungen](configuration.md#load-navbar).

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

- [En](/)
- [Deutsch](/de-de/)
```

!> Solltest du Github Pages verwenden, musst du zusätzlich eine Datei namens `.nojekyll` in `./docs` erstellen, um zu verhindern, dass Github Dateien ignoriert, die mit einem Unterstrich anfangen.

`_navbar.md` wird in jedem Verzeichnislevel geladen. Sollte das aktuelle Verzeichnis keine Datei namens `_navbar.md` haben, so sucht **docsify** in den übergeordneten Ordnern. Wenn du z.B. im Moment im Verzeichnis `/guide/quick-start` bist,  so wird `_navbar.md` von der Datei `/guide/_navbar.md` geladen.

## Aufbauen von Strukturen

Du kannst untergeordnete Listen erstellen, indem du untergeordnete Punkte einem übergeordneten Punkt gegenüber einrückst.

```markdown
<!-- _navbar.md -->

- Getting started
  - [Quick start](de-de/quickstart.md)
  - [Writing more pages](de-de/more-pages.md)
  - [Custom navbar](de-de/custom-navbar.md)
  - [Cover page](de-de/cover.md)

- Configuration
  - [Configuration](de-de/configuration.md)
  - [Themes](de-de/themes.md)
  - [Using plugins](de-de/plugins.md)
  - [Markdown configuration](de-de/markdown.md)
  - [Language highlight](de-de/language-highlight.md)
```

wird also wie folgt aussehen

![Nesting navbar](_images/nested-navbar.png "Nesting navbar")

## Angepasste Navigationsleisten in Verbindung mit dem emoji Erweiterung

Solltest du die [emoji Erweiterung](plugins.md#emoji) verwenden:

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

so kannst du z.B. auch die Flaggenemojis in der Markdown Datei für deine angepasste Navigationsleiste verwenden:

```markdown
<!-- _navbar.md -->

- [:us:, :uk:](/)
- [:de:](/de-de/)
```
