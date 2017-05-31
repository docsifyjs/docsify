# Server client renderer

See https://docsify.now.sh

Repo in https://github.com/QingWei-Li/docsify-ssr-demo

## Why SSR?
- Better SEO
- Feeling cool

## Quick start

Install `now` and `docsify-cli` in your project.

```bash
npm i now docsify-cli -D
```

Edit `package.json`. If the documentation in `./docs` subdirectory.

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
      "basePath": 'https://docsify.js.org/',
      "loadSidebar": true,
      "loadNavbar": true,
      "coverpage": true,
      "name": "docsify"
    }
  }
}
```

!> The `basePath` just like webpack `publicPath`. We can use local or remote files.

We can preview in the local to see if it works.

```bash
npm start

# open http://localhost:4000
```

Publish it!

```bash
now -p
```

Now, You have a support for SSR the docs site.

## Custom template

You can provide a templte for entire page's HTML. such as

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

The template should contain these comments for rendered app content.
 - `<!--inject-app-->`
 - `<!--inject-config-->`

## Configuration

You can configure it in a special config file, or `package.json`.

```js
module.exports = {
  template: './ssr.html',
  config: {
   // docsify config
  }
}
```

## Deploy for your VPS

You can run `docsify start` directly on your Node server, or write your own server app with `docsify-server-renderer`.

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
