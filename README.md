<p align="center">
  <a href="https://docsify.js.org">
    <img alt="docsify" src="./media/docsify.png">
  </a>
</p>

<p align="center">
  A magical documentation site generator.
</p>

<p align="center">
  <a href="https://travis-ci.org/QingWei-Li/docsify"><img alt="Travis Status" src="https://img.shields.io/travis/rust-lang/rust/master.svg?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/docsify"><img alt="npm" src="https://img.shields.io/npm/v/docsify.svg?style=flat-square"></a>
  <a href="https://github.com/vuejs/vue"><img alt="code style" src="https://img.shields.io/badge/code%20style-vue-orange.svg?style=flat-square"></a>
</p>

## Links
- [Documentation](https://docsify.js.org)
- [CLI](https://github.com/QingWei-Li/docsify-cli)

## Features
- Easy and lightweight (~12kb gzipped)
- Custom themes
- No build

## Quick start
Create a `404.html` and `README.md` into `/docs`.

404.html

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

Or Create a `index.html` and using `hash router`.

index.html

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
<script src="//unpkg.com/docsify" data-router></script>
</html>
```

## CDN
- UNPKG [https://unpkg.com/docsify/](https://unpkg.com/docsify/)
- jsDelivr [http://www.jsdelivr.com/projects/docsify](http://www.jsdelivr.com/projects/docsify)

## Showcase
These open-source projects are using docsify to generate their sites. Pull requests welcome : )

- [docsify](https://docsify.js.org) - A magical documentation site generator.
- [Snipaste](https://docs.snipaste.com/) - A new way to boost your productivity.

## How to contribute

- Fork it!
- Run `npm i && npm run dev`
- open `localhost:3000`

## License
MIT

