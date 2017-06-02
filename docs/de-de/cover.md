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

# docsify <small>3.5</small>

> Ein magischer Generator für Dokumentationsseiten.

- Einfach und wenig Speicherbedarf (~18kB gzipped)
- Keine statischen HTML Dateien
- Mehrere Themes

[GitHub](https://github.com/QingWei-Li/docsify/)
[Schnellstart](#docsify)
```

!> Die Dokumentationsseiten können nur eine Titelseite haben!

## Eigener Hintergrund

Die Hintergrundfarbe wird in der Standardeinstellung zufällig generiert. Du kannst sie anpassen, oder auch ein Hintergrundbild verwenden:

```markdown
<!-- _coverpage.md -->

# docsify <small>3.5</small>

[GitHub](https://github.com/QingWei-Li/docsify/)
[Schnellstart](#quick-start)

<!-- Hintegrundbild -->
![](_media/bg.png)

<!-- Hintegrundfarbe -->
![color](#f0f0f0)
```
