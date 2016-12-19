<p align="center">
  <img alt="docsify" src="https://cloud.githubusercontent.com/assets/7565692/21292094/5c206de4-c533-11e6-9493-29ea67b01dde.png">
</p>

<p align="center">
  A magical documentation site generator.
</p>

## Features
- Easy and lightweight (~12kb gzipped)
- Custom themes
- No build

## Quick Start

### Create a project
First create a project, then create a `docs` folder
```shell
mkdir my-project && cd my-project
mkdir docs && cd docs
```

### Create entry file
Create a `404.html` file

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

Create `README.md` as the main page

```
# Title

## balabala
```

### Deploy!
Push and open the **GitHub Pages** feature
![image](https://cloud.githubusercontent.com/assets/7565692/20639058/e65e6d22-b3f3-11e6-9b8b-6309c89826f2.png)

## CLI

Easy to setup and preivew a docs.

### Install
```shell
npm i docsify-cli -g
```

### Setup

Setup a boilerplate docs
```shell
docsify init docs
```

### Preview
Preview and serve your docs using
```shell
docsify serve docs
```

Read more [docsify-cli](https://github.com/QingWei-Li/docsify-cli)

## Themes
Currently available `vue.css` and `buble.css`
```html
<link rel="stylesheet" href="//unpkg.com/docsify/themes/vue.css">
<link rel="stylesheet" href="//unpkg.com/docsify/themes/buble.css">
```

Minified files

```html
<link rel="stylesheet" href="//unpkg.com/docsify/lib/themes/vue.css">
<link rel="stylesheet" href="//unpkg.com/docsify/lib/themes/buble.css">
```

## More

### Multiple pages
If you need other pages, directly create the markdown file, such as `guide.md` is `/guide`.

### Navbar
Code in `404.html`

```html
<nav>
  <a href="/docsify/">En</a>
  <a href="/docsify/zh-cn">中文</a>
</nav>
```

### Options

#### repo
Display the [GitHub Corner](http://tholman.com/github-corners/) widget.

```html
<script src="//unpkg.com/docsify" data-repo="your/repo"></script>
```

#### max-level
Toc level.

```html
<script src="//unpkg.com/docsify" data-max-level="6"></script>
```

#### el
Root element.

```html
<script src="//unpkg.com/docsify" data-el="#app"></script>
```

#### sidebar-toggle

Sidebar with toggle

```html
<script src="//unpkg.com/docsify" data-sidebar-toggle></script>
```

#### sidebar

Custom sidebar. if it'set, the TOC will be disabeld. Bind global variables on the `data-sidebar`.

![image](https://cloud.githubusercontent.com/assets/7565692/20647425/de5ab1c2-b4ce-11e6-863a-135868f2f9b4.png)

```html
<script>
  window.sidebar = [
    { slug: '/', title: 'Home' },
    {
      slug: '/pageA',
      title: 'page A',
      children: [
        { slug: '/pageA/childrenB', title: 'children B' }
      ]
    },
    { slug: '/PageC', title: 'Page C' }
  ]
</script>
<script src="/lib/docsify.js" data-sidebar="sidebar"></script>
```


#### load-sidebar

Load sidebar markdown file. If it is configured, load  the current directory `_sidebar.md` by default. If the file isn't exist, sidebar will appear TOC.
** you should add `.nojekyll` into docs folder, to prevent GitHub Pages from ignoring the `_sidebar.md`**

```html
<script src="/lib/docsify.js" data-load-sidebar></script>
```

You can specify a file:

```html
<script src="/lib/docsify.js" data-load-sidebar="_sidebar.md"></script>
```

The contents of the file can be:

```markdown
- [Home](/)
- [Installation](/installation)
- Essentials
  - [Getting Started](/getting-started)
  - [Dynamic Route Matching](/dynamic-matching)
  - [Nested Routes](/nested-routes)
  - [Programmatic Navigation](/navigation)
  - [Named Routes](/named-routes)
  - [Named Views](/named-views)
  - [Redirect and Alias](/redirect-and-alias)
  - [HTML5 History Mode](/history-mode)
```

#### load-navbar

Load navbar markdown file. If it is configured, load  the current directory `_navbar.md` by default.

```html
<script src="/lib/docsify.js" data-load-navbar></script>
```

You can specify a file:

```html
<script src="/lib/docsify.js" data-load-navbar="_navbar.md"></script>
```

The contents of the file can be:

```markdown
- [en](/)
- [chinese](/zh-cn)
```

If you write a sub level list, it will generate a dropdown list.

```markdown
- [download](/download)
- language
  - [en](/)
  - [chinese](/zh-cn)
```

#### router

Hash router. You can replace `404.html` with `index.html`.

```html
<script src="/lib/docsify.js" data-router></script>
```

#### auto2top

Scroll to the top on changing hash.


```html
<script src="/lib/docsify.js" data-auto2top></script>
```

