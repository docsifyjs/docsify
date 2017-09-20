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

## front matter

```html
<script src="//unpkg.com/docsify/lib/plugins/front-matter.min.js"></script>
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

Medium's Bilderzoom. Basierend auf [zoom-image](https://github.com/egoist/zoom-image).

```html
<script src="//unpkg.com/docsify/lib/plugins/zoom-image.min.js"></script>
```

## Edit on github

Add `Edit on github` button on every pages. provided by 3rd party, check [document](https://github.com/njleonzhang/docsify-edit-on-github)


## CodeSponsor

See https://codesponsor.io


```html
<script>
  window.$docsify = {
    codesponsor: 'id'
  }
</script>
<script src="//unpkg.com/docsify/lib/plugins/codesponsor.min.js"></script>
```

