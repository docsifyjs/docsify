# Noch mehr Seiten

Wenn du mehr Seiten für deine Dokumentation brauchst, so kannst du weitere Markdown Dateien in deinem **docsify** Ordner erstellen.
Eine Datei namens `guide.md` ist dann über `/#/guide` erreichbar.

Nehmen wir als Beispiel folgende Verzeichnisstruktur:

```text
.
├── docs
|   └── README.md
|   └── guide.md
|   └── de-de
|       └──README.md
|       └──guide.md
```

Die passenden Routen sind dann

```text
docs/README.md        => http://domain.com
docs/guide.md         => http://domain.com/guide
docs/de-de/README.md  => http://domain.com/de-de/
docs/de-de/guide.md   => http://domain.com/de-de/guide
```

## Seitenleiste mit Inhaltsverzeichnis anpassen

Als Standardeinstellung wird das Inhaltsverzeichnis in der Seitenleiste automatisch basierend auf vorhandenen Markdown Dateien generiert.
Wenn du das seitliche Inhaltsverzeichnis anpassen willst, kannst du eine Datei namens `_sidebar.md` erstellen (vergleiche [das seitliche Inhaltsverzeichnis für diese Dokumentation](https://github.com/docsifyjs/docsify/blob/master/docs/de-de/_sidebar.md) als Beispiel):

Als Erstes musst du `loadSidebar` auf **true** setzen, vergleiche [Einstellungen für das seitliche Inhaltsverzeichnis](configuration.md#loadsidebar).

```html
<!-- index.html -->

<script>
  window.$docsify = {
    loadSidebar: true
  }
</script>
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
```

Als Zweites erstellst du eine Datei namens `_sidebar.md`:

```markdown
<!-- docs/_sidebar.md -->

* [Home](/)
* [Guide](de-de/guide.md)
```

!> Solltest du Github Pages verwenden, musst du zusätzlich eine Datei namens `.nojekyll` in `./docs` erstellen, um zu verhindern, dass Github Dateien ignoriert, die mit einem Unterstrich anfangen.

`_sidebar.md` wird in jedem Verzeichnislevel geladen. Sollte das aktuelle Verzeichnis keine Datei namens `_sidebar.md` haben, so sucht **docsify** in den übergeordneten Ordnern. Wenn du z.B. im Moment im Verzeichnis `/guide/quick-start` bist, so wird `_sidebar.md` von der Datei `/guide/_sidebar.md` geladen.

Du kannst `alias` definieren, um einen überflüssigen fallback zu vermeiden.

```html
<script>
  window.$docsify = {
    loadSidebar: true,
    alias: {
      '/.*/_sidebar.md': '/_sidebar.md'
    }
  }
</script>
```

## Inhaltsverzeichnis

Eine angepasste Seitenleist kann auch automatisch ein Inhaltsverzeichnis generieren, indem ein `subMaxLevel` gesetzt wird, vergleiche [subMaxLevel Einstellungen](configuration.md#submaxlevel).

```html
<!-- index.html -->

<script>
  window.$docsify = {
    loadSidebar: true,
    subMaxLevel: 2
  }
</script>
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
```

## Ignorieren vun untergeordneten Überschriften

Wenn `subMaxLevel` definiert ist, wird jede Überschrift in der Standardeinstellung zum Inhaltsverzeichnis hinzugefügt.
Wenn du bestimmte Überschriften ignorieren möchtest, füge ihnen **`{docsify-ignore}`** hinzu.

```markdown
# Getting Started

## Header {docsify-ignore}

This header won't appear in the sidebar table of contents.
```

Um alle Überschriften auf einer Seite zu ignorieren, füge der ersten Überschrift auf der Seite **`{docsify-ignore-all}`** hinzu.

```markdown
# Getting Started {docsify-ignore-all}

## Header

This header won't appear in the sidebar table of contents.
```

Beide Variablen, sowohl **`{docsify-ignore}`** als auch **`{docsify-ignore-all}`**, werden auf der Seite nicht gerendert (angezeigt).
