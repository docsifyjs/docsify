# More pages

If you need more pages, you can simply create more markdown files in your docsify directory. If you create a file named `guide.md`, then it is accessible via `/#/guide`.

For example, the directory structure is as follows:

```text
.
├── docs
|   └── README.md
|   └── guide.md
|   └── zh-cn
|       └──README.md
|       └──guide.md
```

Matching routes


```text
docs/README.md        => http://domain.com
docs/guide.md         => http://domain.com/guide
docs/zh-cn/README.md  => http://domain.com/zh-cn/
docs/zh-cn/guide.md   => http://domain.com/zh-cn/guide
```

## Custom sidebar

By default, the table of contents in the sidebar is automatically generated based on your markdown files. If you need a custom sidebar, then you can create your own `_sidebar.md` (see [this documentation's sidebar](https://github.com/QingWei-Li/docsify/blob/master/docs/_sidebar.md) for an example):

First, you need to set `loadSidebar` to **true**. Details are available in the [configuration paragraph](configuration#load-sidebar).

```html
<!-- index.html -->

<script>
  window.$docsify = {
    loadSidebar: true
  }
</script>
<script src="//unpkg.com/docsify"></script>
```

Create the `_sidebar.md`:

```markdown
<!-- docs/_sidebar.md -->

- [Home](/)
- [Guide](/guide)
```

!> You need to create a `.nojekyll` in `./docs` to prevent GitHub Pages from ignoring files that begin with an underscore.

`_sidebar.md` is loaded from each level directory. If the current directory doesn't have `_sidebar.md`, it will fall back to the parent directory. If, for example, the current path is `/guide/quick-start`,  the `_sidebar.md` will be loaded from `/guide/_sidebar.md`.

## Table of Contents

A custom sidebar can also automatically generate a table of contents by setting a `subMaxLevel`. Details are available in the [max-level configuration paragraph](configuration#sub-max-level).

```html
<!-- index.html -->

<script>
  window.$docsify = {
    loadSidebar: true,
    subMaxLevel: 2
  }
</script>
<script src="//unpkg.com/docsify"></script>
```
