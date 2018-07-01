# Titelseite

Aktiviere die Unterstützung für Titelseiten, indem du `coverpage` auf **true** einstellst, vergleiche [coverpage Einstellungen](configuration.md#coverpage).

## Einfache Verwendung

Setze `coverpage` auf **true**, und erstelle `_coverpage.md`:

```html
<!-- index.html -->

<script>
  window.$docsify = {
    coverpage: true
  }
</script>
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
```

```markdown
<!-- _coverpage.md -->

![logo](_media/icon.svg)

# docsify <small>4.7.0</small>

> Ein magischer Generator für Dokumentationsseiten.

* Einfach und wenig Speicherbedarf (~19kB gzipped)
* Keine statischen HTML Dateien
* Mehrere Themes

[GitHub](https://github.com/docsifyjs/docsify/)
[Schnellstart](#docsify)
```

!> Die Dokumentationsseiten können nur eine Titelseite haben!

## Eigener Hintergrund

Die Hintergrundfarbe wird in der Standardeinstellung zufällig generiert.
Du kannst sie anpassen, oder auch ein Hintergrundbild verwenden:

```markdown
<!-- _coverpage.md -->

# docsify <small>4.7.0</small>

[GitHub](https://github.com/docsifyjs/docsify/)
[Schnellstart](#quick-start)

<!-- Hintegrundbild -->

![](_media/bg.png)

<!-- Hintegrundfarbe -->

![color](#f0f0f0)
```

## Titelseite als Startseite

Für gewöhnlich werden die Titelseite und die Startseite zusammen auf einer Seite angezeigt.
Diese kann man natürlich auch mit der [`onlyCover` Einstellung](de-de/configuration.md#onlycover) ändern.

## Mehrere Titelseiten

Sollte deine Dokumentation in mehreren Sprachen zur Verfügung stehen, macht es Sinn, auch mehrere Titelseiten zu erstellen.

Für folgende Struktur:

```text
.
└── docs
    ├── README.md
    ├── guide.md
    ├── _coverpage.md
    └── de-de
        ├── README.md
        └── guide.md
        └── _coverpage.md
```

definiere wie folgt:

```js
window.$docsify = {
  coverpage: ['/', '/de-de/']
};
```

oder bei Verwendung abweichender Dateinamen:

```js
window.$docsify = {
  coverpage: {
    '/': 'cover.md',
    '/de-de/': 'cover.md'
  }
};
```
