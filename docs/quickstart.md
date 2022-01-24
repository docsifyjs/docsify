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

You can easily update the documentation in `./docs/README.md`, of course you can add [more pages](more-pages.md).

## Preview your site

Run the local server with `docsify serve`. You can preview your site in your browser on `http://localhost:3000`.

```bash
docsify serve docs
```

?> For more use cases of `docsify-cli`, head over to the [docsify-cli documentation](https://github.com/docsifyjs/docsify-cli).

## Manual initialization

If you don't like `npm` or have trouble installing the tool, you can manually create `index.html`:

```html
<!-- index.html -->

<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta charset="UTF-8" />
    <link
      rel="stylesheet"
      href="//cdn.jsdelivr.net/npm/docsify@4.12.2/themes/vue.css"
    />
  </head>
  <body>
    <div id="app"></div>
    <script>
      window.$docsify = {
        //...
      };
    </script>
    <script src="//cdn.jsdelivr.net/npm/docsify@4.12.2"></script>
  </body>
</html>
```

### Specifying docsify versions

?> Note that in both of the examples below, docsify URLs will need to be manually updated when a new major version of docsify is released (e.g. `v4.x.x` => `v5.x.x`). Check the docsify website periodically to see if a new major version has been released.

The recommended way to load docsify resources to ensure that your website will
not break on some update of docsify is to lock docsify to a specific version.
Specify the full version after the `@` symbol in the URL. This is the safest way
to ensure your site will look and behave the same way regardless of any changes
made to future versions of docsify:

```html
<link
  rel="stylesheet"
  href="//cdn.jsdelivr.net/npm/docsify@4.12.2/themes/vue.css"
/>
<script src="//cdn.jsdelivr.net/npm/docsify@4.12.2"></script>
```

If you are ok taking more risk for your website, you can specify only the major
version in the URL (f.e. `@4`) to allow your site to receive non-breaking
enhancements (i.e. "minor" updates) and bug fixes (i.e. "patch" updates)
automatically.

```html
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@4/themes/vue.css" />
<script src="//cdn.jsdelivr.net/npm/docsify@4"></script>
```

!> **Warning:** not specifying the full version (f.e. `@4.12.2`) can cause your
website to eventually break. Sometimes bugs can happen unintentionally in any project,
including Docsify.

!> **Warning:** The following is the most risky way to include Docsify because it means you
will get the latest version, even major versions which can include intentional breaking
changes:

```html
<!-- Missing version in the URL is NOT recommended! -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify/themes/vue.css" />
<script src="//cdn.jsdelivr.net/npm/docsify"></script>
```

### Manually preview your site

If you have Python installed on your system, you can easily use it to run a static server to preview your site.

```python2
cd docs && python -m SimpleHTTPServer 3000
```

```python3
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
