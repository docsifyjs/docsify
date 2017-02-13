# More pages

If you need more pages multi-level routing site. It is easy to achieve in docsify. A simple example: If you create a `guide.md`, then get the route is `/#/guide`.

For example, the directory structure is as follows:


```text
-| docs/
  -| README.md
  -| guide.md
  -| zh-cn/
    -| README.md
    -| guide.md
```

Matching routes


```text
docs/README.md        => http://domain.com
docs/guide.md         => http://domain.com/guide
docs/zh-cn/README.md  => http://domain.com/zh-cn/
docs/zh-cn/guide.md   => http://domain.com/zh-cn/guide
```

## Custom sidebar

By default, the TOC in sidebar is automatically generated based on Markdown file. You can create a Table of Contents page to list down pages in your site.

First, you need to set `loadSidebar` to **true**. The detail in [Configuration#load-sidebar](configuration#load-sidebar).

```html
<script>
  window.$docsify = {
    loadSidebar: true
  }
</script>
<script src="//unpkg.com/docsify"></script>
```

Create the `_sidebar.md`

```markdown
- [Home](/)
- [Guide](/guide)
```

!> Need create a `.nojekyll` in `./docs` to prevent GitHub Pages from ignoring files that begin with an underscore.

`_sidebar.md` is loaded from each level directory. If this directory doesn't have `_sidebar.md`, it will fallback to parent directory. For example, the current path is `/guide/quick-start`,  the `_sidebar.md` will be loaded from `/guide/_sidebar.md`.

## Table of Contents

Custom sidebar can also be automatically generate TOC by setting `subMaxLevel`. The detail in [Configuration#sub-max-level](configuration#sub-max-level).

```html
<script>
  window.$docsify = {
    loadSidebar: true,
    subMaxLevel: 2
  }
</script>
<script src="//unpkg.com/docsify"></script>
```

