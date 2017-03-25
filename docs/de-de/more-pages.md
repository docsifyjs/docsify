# Noch mehr Seiten

Wenn du mehr Seiten für deine Dokumentation brauchst, so kannst du weitere Markdown Dateien in deinem **docsify** Ordner erstellen. Eine Datei namens `guide.md` ist dann über `/#/guide` erreichbar.

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

Als Standardeinstellung wird das Inhaltsverzeichnis in der Seitenleiste automatisch basierend auf vorhandenen Markdown Dateien generiert. Wenn du das seitliche Inhaltsverzeichnis anpassen willst, kannst du eine Datei namens `_sidebar.md` erstellen (vergleiche [das seitliche Inhaltsverzeichnis für diese Dokumentation](https://github.com/QingWei-Li/docsify/blob/master/docs/de-de/_sidebar.md) als Beispiel):

Als Erstes musst du `loadSidebar` auf **true** setzen, vergleiche [Einstellungen für das seitliche Inhaltsverzeichnis](configuration.md#load-sidebar).

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

- [Home](/)
- [Guide](de-de/guide.md)
```

!> Solltest du Github Pages verwenden, musst du zusätzlich eine Datei namens `.nojekyll` in `./docs` erstellen, um zu verhindern, dass Github Dateien ignoriert, die mit einem Unterstrich anfangen.

`_sidebar.md` wird in jedem Verzeichnislevel geladen. Sollte das aktuelle Verzeichnis keine Datei namens `_sidebar.md` haben, so sucht **docsify** in den übergeordneten Ordnern. Wenn du z.B. im Moment im Verzeichnis `/guide/quick-start` bist,  so wird `_sidebar.md` von der Datei `/guide/_sidebar.md` geladen.

## Inhaltsverzeichnis

Eine angepasste Seitenleist kann auch automatisch ein Inhaltsverzeichnis generieren, indem ein `subMaxLevel` gesetzt wird, vergleiche [sub-max-level Einstellungen](configuration.md#sub-max-level).

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

## Ignoring Subheaders

When `subMaxLevel` is set, each header is automatically added to the table of contents by default. If you want to ignore a specific header, add `{docsify-ignore}` to it.

```markdown
# Getting Started

## Header {docsify-ignore}
This header won't appear in the sidebar table of contents.
```

To ignore all headers on a specific page, you can use `{docsify-ignore-all}` on the first header of the page.

```markdown
# Getting Started {docsify-ignore-all}

## Header
This header won't appear in the sidebar table of contents.
```

Both `{docsify-ignore}` and `{docsify-ignore-all}` will not be rendered on the page when used.
