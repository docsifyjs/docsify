# Server-Side Rendering

* siehe <https://docsify.now.sh>
* Quellcode siehe <https://github.com/docsifyjs/docsify-ssr-demo>

## Warum SSR?

- Bessere SEO
- Damit du dich cool fühlst!

## Schnellstart

Installiere `now` und `docsify-cli` in deinem Projekt.

```bash
npm i now docsify-cli -D
```

Ändere `package.json`. Im folgenden Beispiel ist die Dokumentation im `./docs` Verzeichnis:

```json
{
  "name": "my-project",
  "scripts": {
    "start": "docsify start . -c ssr.config.js",
    "deploy": "now -p"
  },
  "files": [
    "docs"
  ],
  "docsify": {
    "config": {
      "basePath": "https://docsify.js.org/",
      "loadSidebar": true,
      "loadNavbar": true,
      "coverpage": true,
      "name": "docsify"
    }
  }
}
```

!> Für `basePath` ist dies der gleiche wie bei webpack `publicPath`. Unterstützt werden lokale oder remote Dateien.

Wir können lokale Dateien verwenden, um zu sehen, ob es funktioniert.

```bash
npm start

# open http://localhost:4000
```

Veröffentliche sie!

```bash
now -p
```

Damit hast du SSR Unterstützung für deine Dokumentation.

## Eigene Vorlagen

Du kannst eine Vorlage für deine gesammte Seite wie folgt erstellen:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>docsify</title>
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <link rel="stylesheet" href="//unpkg.com/docsify/themes/vue.css" title="vue">
</head>
<body>
  <!--inject-app-->
  <!--inject-config-->
</body>
<script src="//unpkg.com/docsify/lib/docsify.js"></script>
<script src="//unpkg.com/docsify/lib/plugins/search.js"></script>
<script src="//unpkg.com/prismjs/components/prism-bash.min.js"></script>
<script src="//unpkg.com/prismjs/components/prism-markdown.min.js"></script>
<script src="//unpkg.com/prismjs/components/prism-nginx.min.js"></script>
</html>
```

Die Vorlage sollte folgende Kommentare für die Anzeige von Inhalten enthalten:

 - `<!--inject-app-->`
 - `<!--inject-config-->`

## Einstellungen

Du kannst die Einstellungen in einer speziellen Datei oder in `package.json` vornehmen:

```js
module.exports = {
  template: './ssr.html',
  config: {
   // docsify config
  }
}
```

## Deploy für deinen VPS

Führe `docsify start` direkt auf deinem Node Server aus, oder schreibe deine eigene Server app mit `docsify-server-renderer`:

```js
var Renderer = require('docsify-server-renderer')
var readFileSync = require('fs').readFileSync

// init
var renderer = new Renderer({
  template: readFileSync('./docs/index.template.html', 'utf-8').,
  config: {
    name: 'docsify',
    repo: 'docsifyjs/docsify'
  }
})

renderer.renderToString(url)
  .then(html => {})
  .catch(err => {})
```
