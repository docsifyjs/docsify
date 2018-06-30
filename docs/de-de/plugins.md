# Liste der Erweiterungen

## Volltextsuche

Als Standardeinstellung werden Hyperlinks auf der aktuellen Seite erkannt und der Inhalt in `localStorage` gespeichert. Du kannst den Pfad zu den Dateien auch anpassen:

```html
<script>
  window.$docsify = {
    search: 'auto', // Standard

    search : [
      '/',            // => /README.md
      '/guide',       // => /guide.md
      '/get-started', // => /get-started.md
      '/de-de/',      // => /de-de/README.md
    ],

    // vollständige Parameter für die Einstellungen
    search: {
      maxAge: 86400000, // Verfallszeit, als Standard ein Tag
      paths: [], // oder 'auto'
      placeholder: 'Type to search',

      // Lokalisation
      placeholder: {
        '/de-de/': 'Suche',
        '/': 'Search'
      },

      noData: 'No Results!',

      // Lokalisation
      noData: {
        '/de-de/': 'Keine Ergebnisse',
        '/': 'No Results'
      },

      // Headline depth, 1 - 6
      depth: 2
    }
  }
</script>
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
<script src="//unpkg.com/docsify/lib/plugins/search.min.js"></script>
```

## Google Analytics

Installiere diese Erweiterung und passe die track id an:

```html
<script>
  window.$docsify = {
    ga: 'UA-XXXXX-Y'
  }
</script>
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
<script src="//unpkg.com/docsify/lib/plugins/ga.min.js"></script>
```

Konfiguration über `data-ga`:

```html
<script src="//unpkg.com/docsify/lib/docsify.min.js" data-ga="UA-XXXXX-Y"></script>
<script src="//unpkg.com/docsify/lib/plugins/ga.min.js"></script>
```

## emoji

Als Standardeinstellung werden emojis umgewandelt. Als Beispiel wird `:100:` umgewandelt in :100:. Aber das ist nicht genau, das es keine passende Nicht-emoji Zeichenfolge gibt. Solltest du emojis richtig umwandeln wollen, musst du diese Erweiterung verwenden.

```html
<script src="//unpkg.com/docsify/lib/plugins/emoji.min.js"></script>
```

## Externes Skript

Wenn das Skript auf der Seite ein externes ist (eine Javascript Datei über das `src` Attribut importiert), brauchst du diese Erweiterung, damit das funktioniert.

```html
<script src="//unpkg.com/docsify/lib/plugins/external-script.min.js"></script>
```

## Bilder zoomen

Medium's Bilderzoom. Basierend auf [medium-zoom](https://github.com/francoischalifour/medium-zoom).

```html
<script src="//unpkg.com/docsify/lib/plugins/zoom-image.min.js"></script>
```

Exclude the special image

```markdown
![](image.png ':no-zoom')
```

## Auf GitHub ändern

Fügen deinen Seiten einen `Ändere diese Seite auf GitHub` Button hinzu. Zur Verfügung gestellt von [@njleonzhang](https://github.com/njleonzhang), siehe [njleonzhang/docsify-edit-on-github](https://github.com/njleonzhang/docsify-edit-on-github)

## Beispielcode mit direkter Vorschau und Integration mit jsfiddle

Mit dieser Erweiterung kann Beispielcode auf einer Seite mit einer zugehörigen Vorschau direkt angezeigt werden.

Beim Erweitern des Demobereichs werden Quellcode und Beschreibungen mit einem `Try in Jsfiddle` Button dort angezeigt, über den man den Code selbst anpassen und ausprobieren kann.

[Vue](https://njleonzhang.github.io/docsify-demo-box-vue/) und [React](https://njleonzhang.github.io/docsify-demo-box-react/) werden beide unterstützt.

## Kopiere in Zwischenablage

Füge den Quellcode-Blöcken auf deinen Seiten einen einfachen `Click to copy` Button hinzu. Zur Verfügung gestellt von [@jperasmus](https://github.com/jperasmus)

```html
<script src="//unpkg.com/docsify-copy-code"></script>
```

Siehe auch [jperasmus/docsify-copy-code](https://github.com/jperasmus/docsify-copy-code#readme).

## Disqus

[Disqus](https://disqus.com) Kommentare:

```html
<script>
  window.$docsify = {
    disqus: 'shortname'
  }
</script>
<script src="//unpkg.com/docsify/lib/plugins/disqus.min.js"></script>
```

## Gitalk

[Gitalk](https://github.com/gitalk/gitalk) basiert auf Github Issue und Preact.

```html
<link rel="stylesheet" href="//unpkg.com/gitalk/dist/gitalk.css">

<script src="//unpkg.com/docsify/lib/plugins/gitalk.min.js"></script>
<script src="//unpkg.com/gitalk/dist/gitalk.min.js"></script>
<script>
  const gitalk = new Gitalk({
    clientID: 'Github Application Client ID',
    clientSecret: 'Github Application Client Secret',
    repo: 'Github repo',
    owner: 'Github repo owner',
    admin: ['Github repo collaborators, only these guys can initialize github issues'],
    // facebook-like distraction free mode
    distractionFreeMode: false
  })
</script>
```

## Seitenumbrüche

Seitenumbrüche, zur Verfügung gestellt von [@imyelo](https://github.com/imyelo):

```html
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
<script src="//unpkg.com/docsify-pagination/dist/docsify-pagination.min.js"></script>
```

## codefund

Eine [Erweiterung](https://github.com/njleonzhang/docsify-plugin-codefund) für [codefund.io](https://codefund.io/).

> codefund war vorher codesponsor

```
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>

window.$docsify = {
  plugins: [
    DocsifyCodefund.create('xxxx-xxx-xxx') // change to your codefund id
  ]
}
```
