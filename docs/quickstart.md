# Quick start

It is recommended to install `docsify-cli` globally, which helps initializing and previewing the website locally.

```bash
npm i docsify-cli -g
```

## Initialize

If you want to write the documentation in the `./docs` subdirectory, you can use the `init` command.

```bash
docsify init ./docs
```

## Writing content

After the `init` is complete, you can see the file list in the `./docs` subdirectory.

- `index.html` as the entry file
- `README.md` as the home page
- `.nojekyll` prevents GitHub Pages from ignoring files that begin with an underscore

You can easily update the documentation in `./docs/README.md`, of course you can add [more pages](adding-pages.md).

## Preview your site

Run the local server with `docsify serve`. You can preview your site in your browser on `http://localhost:3000`.

```bash
docsify serve docs
```

?> For more use cases of `docsify-cli`, head over to the [docsify-cli documentation](https://github.com/docsifyjs/docsify-cli).

## Manual initialization

Download or create an `index.html` template using the following markup:

<div id="template">

<a href="#" class="button primary" download="index.html">Download Template</a>

<!-- prettier-ignore -->
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

    <!-- Core Theme -->
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/core.min.css">
  </head>
  <body class="loading">
    <div id="app"></div>

    <!-- Configuration -->
    <script>
      window.$docsify = {
        //...
      };
    </script>

    <!-- Docsify.js -->
    <script src="//cdn.jsdelivr.net/npm/docsify@5"></script>

    <!-- Plugins (optional) -->
    <!-- <script src="//cdn.jsdelivr.net/npm/docsify@5/dist/plugins/search.min.js"></script> -->
  </body>
</html>
```

</div>

### Specifying docsify versions

?> Note that in both of the examples below, docsify URLs will need to be manually updated when a new major version of docsify is released (e.g. `v5.x.x` => `v6.x.x`). Check the docsify website periodically to see if a new major version has been released.

Specifying a major version in the URL (`@5`) will allow your site to receive non-breaking enhancements (i.e. "minor" updates) and bug fixes (i.e. "patch" updates) automatically. This is the recommended way to load docsify resources.

<!-- prettier-ignore -->
```html
<!-- Core Theme -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/core.min.css">

<!-- Docsify -->
<script src="//cdn.jsdelivr.net/npm/docsify@5"></script>
```

If you prefer to lock docsify to a specific version, specify the full version after the `@` symbol in the URL. This is the safest way to ensure your site will look and behave the same way regardless of any changes made to future versions of docsify.

<!-- prettier-ignore -->
```html
<!-- Core Theme -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5.0.0/themes/core.min.css">

<!-- Docsify -->
<script src="//cdn.jsdelivr.net/npm/docsify@5.0.0"></script>
```

### Manually preview your site

If you have Python installed on your system, you can easily use it to run a static server to preview your site.

```python
# Python 2
cd docs && python -m SimpleHTTPServer 3000
```

```python
# Python 3
cd docs && python -m http.server 3000
```

## Loading dialog

If you want, you can show a loading dialog before docsify starts to render your documentation:

```html
<!-- index.html -->

<div id="app">Please wait...</div>
```

You should set the `data-app` attribute if you changed `el`:

```html
<!-- index.html -->

<div data-app id="main">Please wait...</div>

<script>
  window.$docsify = {
    el: '#main',
  };
</script>
```

Compare [el configuration](configuration.md#el).

<script>
  (function() {
    const linkElm = document.querySelector('#template a[download="index.html"]');
    const codeElm = document.querySelector('#template code');
    const html = codeElm?.textContent;

    linkElm?.setAttribute('href', `data:text/plain,${html}`);
  })();
</script>
