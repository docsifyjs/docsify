# Quick start

Recommended install `docsify-cli` globally, which can help us to initialize and preview the website locally.

```bash
npm i docsify-cli -g
```

## initialize

If you want to write the documentation in `./docs` directory, you can use the `init` command.

```bash
docsify init ./docs
```

## Writing content

After the init is complete, you can see the file list in the docs directory.


- `index.html` as the entry file
- `README.md` as the home page
- `.nojekyll` can prevent GitHub Pages from ignoring files that begin with an underscore

You can easily update the documentation in `docs/README.md`, of course you can add [more pages](more-pages).

## Preview your site

Run the local server via `docsify serve`. You can preview your site in browser via http://localhost:3000.


```bash
docsify serve docs
```

?> More usages of reference [docsify-cli documentation](https://github.com/QingWei-Li/docsify-cli).

## Manually

If you don't like npm or feel the trouble to install the tool. What we need is an `index.html`.

*index.html*

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="//unpkg.com/docsify/themes/vue.css">
</head>
<body>
  <div id="app"></div>
</body>
<script src="//unpkg.com/docsify"></script>
</html>
```

If your system has Python, you can easily to run a static server to preview your site.

```bash
cd docs && python -m SimpleHTTPServer 3000
```
