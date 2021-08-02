# More pages

If you need more pages, you can simply create more markdown files in your docsify directory. If you create a file named `guide.md`, then it is accessible via `/#/guide`.

For example, the directory structure is as follows:

```text
.
└── docs
    ├── README.md
    ├── guide.md
    └── zh-cn
        ├── README.md
        └── guide.md
```

Matching routes

```text
docs/README.md        => http://domain.com
docs/guide.md         => http://domain.com/#/guide
docs/zh-cn/README.md  => http://domain.com/#/zh-cn/
docs/zh-cn/guide.md   => http://domain.com/#/zh-cn/guide
```

## Sidebar

In order to have a sidebar, you can create your own `_sidebar.md` (see [this documentation's sidebar](https://github.com/docsifyjs/docsify/blob/master/docs/_sidebar.md) for an example):

First, you need to set `loadSidebar` to **true**. Details are available in the [configuration paragraph](configuration.md#loadsidebar).

```html
<!-- index.html -->

<script>
  window.$docsify = {
    loadSidebar: true
  }
</script>
<script src="//cdn.jsdelivr.net/npm/docsify/lib/docsify.min.js"></script>
```

Create the `_sidebar.md`:

```markdown
<!-- docs/_sidebar.md -->

* [Home](/)
* [Guide](guide.md)
```

You need to create a `.nojekyll` in `./docs` to prevent GitHub Pages from ignoring files that begin with an underscore.

!> Docsify only looks for `_sidebar.md` in the current folder, and uses that, otherwise it falls back to the one configured using `window.$docsify.loadSidebar` config.

Example file structure:

```text
└── docs/
    ├── _sidebar.md
    ├── index.md
    ├── getting-started.md
    └── running-services.md
```

## Nested Sidebars

You may want the sidebar to update after navigation to reflect the current directory. This can be done by adding a `_sidebar.md` file to each folder.

`_sidebar.md` is loaded from each level directory. If the current directory doesn't have `_sidebar.md`, it will fall back to the parent directory. If, for example, the current path is `/guide/quick-start`, the `_sidebar.md` will be loaded from `/guide/_sidebar.md`.

You can specify `alias` to avoid unnecessary fallback.

```html
<script>
  window.$docsify = {
    loadSidebar: true,
    alias: {
      '/.*/_sidebar.md': '/_sidebar.md'
    }
  }
</script>
```

!> You can create a `README.md` file in a subdirectory to use it as the landing page for the route.

## Set Page Titles from Sidebar Selection

A page's `title` tag is generated from the _selected_ sidebar item name. For better SEO, you can customize the title by specifying a string after the filename.

```markdown
<!-- docs/_sidebar.md -->
* [Home](/)
* [Guide](guide.md "The greatest guide in the world")
```

## Table of Contents

Once you've created `_sidebar.md`, the sidebar content is automatically generated based on the headers in the markdown files.

A custom sidebar can also automatically generate a table of contents by setting a `subMaxLevel`, compare [subMaxLevel configuration](configuration.md#submaxlevel).

```html
<!-- index.html -->

<script>
  window.$docsify = {
    loadSidebar: true,
    subMaxLevel: 2
  }
</script>
<script src="//cdn.jsdelivr.net/npm/docsify/lib/docsify.min.js"></script>
```

## Ignoring Subheaders

When `subMaxLevel` is set, each header is automatically added to the table of contents by default. If you want to ignore a specific header, add `<!-- {docsify-ignore} -->` to it.

```markdown
# Getting Started

## Header <!-- {docsify-ignore} -->

This header won't appear in the sidebar table of contents.
```

To ignore all headers on a specific page, you can use `<!-- {docsify-ignore-all} -->` on the first header of the page.

```markdown
# Getting Started <!-- {docsify-ignore-all} -->

## Header

This header won't appear in the sidebar table of contents.
```

Both `<!-- {docsify-ignore} -->` and `<!-- {docsify-ignore-all} -->` will not be rendered on the page when used.
