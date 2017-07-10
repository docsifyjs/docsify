# Einstellungen

**docsify** unterstützt zwei verschiedene Arten, um die Einstellungen anzupassen. Du kannst das `window.$docsify` anpassen, oder die Einstellungen über das script tag im `data-*` Attribut vornehmen.

```html
<!-- über $docsify -->
<script>
  window.$docsify = {
    repo: 'QingWei-Li/docsify',
    maxLevel: 3,
    coverpage: true
  }
</script>

<!-- oder data-* -->
<script
  src="//unpkg.com/docsify"
  data-repo="QingWei-Li/docsify"
  data-max-level="3"
  data-coverpage>
</script>
```

Beide Arten sind miteinander kompatibel, wobei die erste jedoch empfohlen wird. Sie ist deutlicher und kann in einer separaten Datei geführt werden.

!> Innerhalb des `window.$docsfiy` sollten die Optionen mit camelCase geschrieben werden.

## el

- Typ: `String`
- Standard: `#app`

Das DOM Element kann bei der Initialisierung gesetzt werden. Es kann ein CSS selector string oder ein richtiges HTMLElement sein.

```js
window.$docsify = {
  el: '#app'
}
```

## repo

- Typ: `String`
- Standard: `null`

Verwende die repository URL oder eine Zeichenfolge aus `Benutzername/repo`, um das [GitHub Corner](http://tholman.com/github-corners/) widget in die obere rechte Ecke der Seite zu implementieren.

```js
window.$docsify = {
  repo: 'QingWei-Li/docsify',
  // oder
  repo: 'https://github.com/QingWei-Li/docsify/'
}
```

## max-level

- Typ: `Number`
- Standard: `6`

Maximale Anzahl der Inhaltsübersichtebenen.

```js
window.$docsify = {
  maxLevel: 4
}
```

## load-navbar

- Typ: `Boolean|String`
- Standard: `false`

Lädt die Navigationsleiste von der Markdown Datei `_navbar.md` falls **true**, oder vom gewählten Pfad.

```js
window.$docsify = {
  // lade von _navbar.md
  loadNavbar: true,

  // lade von nav.md
  loadNavbar: 'nav.md'
}
```

## load-sidebar

- Typ: `Boolean|String`
- Standard: `false`

Lädt das seitliche Inhaltsverzeichnis von der Markdown Datei `_sidebar.md` falls **true**, oder vom gewählten Pfad.

```js
window.$docsify = {
  // lade von _sidebar.md
  loadSidebar: true,

  // lade von summary.md
  loadSidebar: 'summary.md'
}
```

## sub-max-level

- Typ: `Number`
- Standard: `0`

Wähle die maximale Anzahl der Unterpunkte pro Datei in der Inhaltsübersicht.

```js
window.$docsify = {
  subMaxLevel: 2
}
```

## auto2top

- Typ: `Boolean`
- Standard: `false`

Scrolle zum Anfang der Seite, wenn die Route gewechselt wird.

```js
window.$docsify = {
  auto2top: true
}
```

## homepage

- Typ: `String`
- Standard: `README.md`

`README.md` in deinem Ordner für die Dokumentation wird als Startseite für deine Webseite gesetzt, aber manchmal musst du das vielleicht ändern.

```js
window.$docsify = {
  // Wähle /home.md
  homepage: 'home.md',

  // Oder verwende das README in deinem repo
  homepage: 'https://raw.githubusercontent.com/QingWei-Li/docsify/master/README.md'
}
```

## base-path

- Typ: `String`

Der Basispfad der Webseite. Du kannst einen anderen Ordner wählen, oder eine andere Domain.

```js
window.$docsify = {
  basePath: '/path/',

  // Lade die Dateien von einer anderen Domain
  basePath: 'https://docsify.js.org/',

  // Oder lade Dateien von einem anderen repo
  basePath: 'https://raw.githubusercontent.com/ryanmcdermott/clean-code-javascript/master/'
}
```

## coverpage

- Typ: `Boolean|String`
- Standard: `false`

Aktiviere das [Titelseitenfeature](de-de/cover.md). Falls `true`, wird sie von `_coverpage.md` geladen.

```js
window.$docsify = {
  coverpage: true,

  // Anderer Dateiname
  coverpage: 'cover.md'
}
```

## name

- Typ: `String`

Webseitenname, wie er in der Inhaltsübersicht in der Seitenleiste angezeigt wird.

```js
window.$docsify = {
  name: 'docsify'
}
```

## name-link

- Typ: `String`
- Standard: `window.location.pathname`

Der Name der Links.

```js
window.$docsify = {
  nameLink: '/',

  // Für jede Route
  nameLink: {
    '/zh-cn/': '/zh-cn/',
    '/': '/'
  }
}
```

## markdown

- Typ: `Function`

Siehe [Markdown Konfiguration](de-de/markdown.md).

```js
window.$docsify = {
  // Objekt
  markdown: {
    smartypants: true,
    renderer: {
      link: function() {
        // ...
      }
    }
  },

  // Funktion
  markdown: function (marked, renderer) {
    // ...
    return marked
  }
}
```

## theme-color

- Typ: `String`

Passe die Farbe der Themen an. Verwende [CSS3 Variablen](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables) und polyfill in älteren Browsern.

```js
window.$docsify = {
  themeColor: '#3F51B5'
}
```

## alias

- Typ: `Object`

Verwende alternative Routen. Du kannst sie ungehindert anpassen. Supports RegExp.

```js
window.$docsify = {
  alias: {
    '/foo/(+*)': '/bar/$1', // supports regexp
    '/zh-cn/changelog': '/changelog',
    '/changelog': 'https://raw.githubusercontent.com/QingWei-Li/docsify/master/CHANGELOG'
  }
}
```

## auto-header

- Typ: `Boolean`

Sollten `loadSidebar` und `autoHeader` beide aktiviert sein, setze einen Header vor die Seite in jedem Link in `_sidebar.md`, bevor sie in HTML umgewandelt wird. Vergleiche [#78](https://github.com/QingWei-Li/docsify/issues/78).

```js
window.$docsify = {
  loadSidebar: true,
  autoHeader: true
}
```

## execute-script

- Typ: `Boolean`

Führe das Skript auf der Seite aus. Analysiere nur das erste script tag ([demo](de-de/themes.md)).  Sollte Vue verwendet sein, wird es in der Standardeinstellung ausgeführt.

```js
window.$docsify = {
  executeScript: true
}
```

```markdown
## Dies ist ein Test

<script>
  console.log(2333)
</script>
```

?> Nehme zur Kenntnis, dass, solltest du ein externes Skript ausführen, z.B. ein eingebettete jsfiddle demo, du sicher gehen solltest, das [external-script](de-de/plugins.md?id=external-script) plugin zu verwenden.

## no-emoji

Verhindere die Umwandlung in Emojis:

```js
window.$docsify = {
  noEmoji: true
}
```

## merge-navbar

Navbar will be merged with the sidebar on smaller screens.

```js
window.$docsify = {
  mergeNavbar: true
}
```

## format-updated
We can display the file update date through **{docsify-updated<span>}</span>** variable. And format it by `formatUpdated`.
See https://github.com/lukeed/tinydate#patterns
```js
window.$docsify = {
  formatUpdated: '{MM}/{DD} {HH}:{mm}',

  formatUpdated: function (time) {
    // ...

    return time
  }
}
```

## external-link-target

Currently it defaults to _blank, would be nice if configurable:

```js
window.$docsify = {
  externalLinkTarget: '_self' // default: '_blank'
}
```


## noCompileLinks

- type: `Array`


Sometimes we do not want docsify to handle our links. See [#203](https://github.com/QingWei-Li/docsify/issues/203)


```js
window.$docsify = {
  noCompileLinks: [
    '/foo',
    '/bar/.*'
  ]
}
```
