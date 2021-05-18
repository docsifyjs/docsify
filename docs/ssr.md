# Server-Side Rendering

TODO, this page is work in progress.

## Why SSR?

- Better SEO
- Feeling cool

## Example

See https://github.com/docsifyjs/docsify-ssr-demo.

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
  "files": ["docs"],
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

!> The `basePath` is similar to webpack `publicPath`. We can use local or remote files.

We can preview in locally to see if it works.

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

You can provide a template for entire page's HTML. The template should contain the following comments for rendered app content.

- `<!--inject-config-->`
- `<!--inject-app-->`

Here's a sample template:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>docsify</title>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, minimum-scale=1.0"
    />
    <link
      rel="stylesheet"
      href="//cdn.jsdelivr.net/npm/docsify/themes/vue.css"
      title="vue"
    />
  </head>
  <body>
    <!-- Order of the following matters: -->

    <!-- First, specify where the $docsify config object will be injected: -->
    <!--inject-config-->

    <!-- Second, load Docsify and any libs as needed: -->
    <script src="//cdn.jsdelivr.net/npm/docsify/lib/docsify.js"></script>
    <script src="//cdn.jsdelivr.net/npm/docsify/lib/plugins/search.js"></script>
    <script src="//cdn.jsdelivr.net/npm/prismjs/components/prism-bash.min.js"></script>
    <script src="//cdn.jsdelivr.net/npm/prismjs/components/prism-markdown.min.js"></script>
    <script src="//cdn.jsdelivr.net/npm/prismjs/components/prism-nginx.min.js"></script>

    <!-- Finally, specify where to inject the rendered content. -->
    <!--inject-app-->
  </body>
</html>
```

## Configuration

You can configure it in a special config file, or `package.json`.

> TODO: What should the name of the file be? Does it take precedence of the package.json config? etc.

```js
module.exports = {
  template: './ssr.html',
  maxAge: 60 * 60 * 1000, // lru-cache config
  config: {
    // docsify config
  },
};
```

## Deploy for your VPS

You can run `docsify start` directly on your Node server, or write your own
server app with `docsify-server-renderer`. With your own server, you can write
the config object inline (as in the below example), or import it from wherever
you want.

```js
import Renderer from 'docsify-server-renderer';
import { readFileSync } from 'fs';

// init
var renderer = new Renderer({
  template: readFileSync('./docs/index.template.html', 'utf-8'),
  config: {
    name: 'docsify',
    repo: 'docsifyjs/docsify',
  },
});

renderer
  .renderToString(url)
  .then(html => {
    // ...Serve the HTML to the client...
  })
  .catch(err => {
    // ...Handle any error...
  });
```
