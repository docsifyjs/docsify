# docsify-server-renderer

## Install

```bash
yarn add docsify-server-renderer
```

## Usage

```js
var Renderer = require('docsify-server-renderer')
var readFileSync = require('fs').readFileSync

// init
var renderer = new Renderer({
  template: readFileSync('./docs/index.template.html', 'utf-8').,
  config: {
    name: 'docsify',
    repo: 'qingwei-li/docsify'
  }
})

renderer.renderToString(url)
  .then(html => {})
  .catch(err => {})
```

*index.template.html*

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>docsify</title>
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <link rel="stylesheet" href="//unpkg.com/docsify/themes/buble.css" title="buble" disabled>
</head>
<body>
  <!--inject-app-->
  <!--inject-config-->
  <script src="//unpkg.com/docsify/lib/docsify.js"></script>
</body>
</html>
```
