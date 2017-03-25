# Schnellstart

Es wird empfohlen, `docsify-cli` global zu installieren, welches bei der Inbetriebnahme und der lokalen Vorschau hilft.

```bash
npm i docsify-cli -g
```

## Inbetriebnahme

Wenn du die Dokumentation in dem Unterordner `./docs` erstellen willst, kannst du den Befehl `init` verwenden.

```bash
docsify init ./docs
```

## Inhalt schreiben

Nachdem der Befehl `init` vollständig ausgeführt wurde, kannst du folgende Dateien im Unterordner `./docs` finden:

* `index.html` als zentrale Datei
* `README.md` als die Startseite für die Dokumentation
* `.nojekyll` verhindert, dass Github Pages Dateien ignoriert, die mit einem Unterstrich beginnen.

Du kannst die Dokumentation über die Datei `./docs/README.md` nach Belieben ändern, und natürlich [weitere Seiten](de-de/more-pages.md) hinzufügen.

## Vorschau der eigenen Seiten

Du kannst einen lokalen Server mit dem Befehl `docsify serve` laufen lassen, und auf eine Vorschau deiner Webseite über `http://localhost:3000` zugreifen.

```bash
docsify serve docs
```

?> Für weitere Informationen hinsichtlich der Verwendung von `docsify-cli`, siehe [docsify-cli Dokumentation](https://github.com/QingWei-Li/docsify-cli).

## Manuelle Inbetriebnahme

Wenn du `npm` nicht verwenden möchtest, oder Probleme bei der Installation des Tools hast, kannst du auch manuell die Datei namens `index.html` erstellen:

```html
<!-- index.html -->

<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">dict.
  <link rel="stylesheet" href="//unpkg.com/docsify/themes/vue.css">
</head>
<body>
  <div id="app"></div>
</body>
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
</html>
```

Solltest du Python installiert haben, kannst du einen statischen Server laufen lassen, um eine Vorschau deiner Webseite anzuschauen:

```bash
cd docs && python -m SimpleHTTPServer 3000
```

## Ladedialog

Wenn du möchtest, kann **docsify** einen Ladedialog anzeigen, während es deine Dokumentation umwandelt:

```html
  <!-- index.html -->

  <div id="app">Please wait...</div>
```

Du solltest das `data-app` Attribut anpassen, wenn du `el` geändert hast:

```html
  <!-- index.html -->

  <div data-app id="main">Please wait...</div>

  <script>
    window.$docsify = {
      el: '#main'
    }
  </script>
```

Vergleiche [el Einstellungen](configuration.md#el).
