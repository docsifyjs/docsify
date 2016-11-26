# docsify [WIP]
[![Build Status](https://travis-ci.org/QingWei-Li/docsify.svg?branch=master)](https://travis-ci.org/QingWei-Li/docsify)
[![npm](https://img.shields.io/npm/v/docsify.svg)](https://www.npmjs.com/package/docsify)

>🃏 A magical documentation site generator.

## Features
- Easy and lightweight
- Custom themes and plugins

## Quick start
Such as [./docs](https://github.com/QingWei-Li/docsify/tree/master/docs), Create `404.html` and `README.md` into `/docs`.

404.html

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="//unpkg.com/docsify/themes/vue.css">
</head>
<body></body>
<script src="//unpkg.com/docsify"></script>
</html>
```

```javascript
import Vue from 'vue'

Vue.use(ElementUI)
```

## License
MIT
