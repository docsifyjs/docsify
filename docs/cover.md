# Cover

Activate the cover feature by setting `coverpage` to **true**, compare [coverpage configuration](configuration#coverpage).

## Basic usage

Set `coverpage` to **true**, and create a `_coverpage.md`:

```html
<!-- index.html -->

<script>
  window.$docsify = {
    coverpage: true
  }
</script>
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
```

```markdown
<!-- _coverpage.md -->

![logo](_media/icon.svg)

# docsify <small>3.5</small>

> A magical documentation site generator.

- Simple and lightweight (~16kB gzipped)
- No statically built html files
- Multiple themes

[GitHub](https://github.com/QingWei-Li/docsify/)
[Get Started](#docsify)
```

!> A document site can have only one coverpage!

## Custom background

The background color is generated randomly by default. You can customize the background color or a background image:

```markdown
<!-- _coverpage.md -->

# docsify <small>3.5</small>

[GitHub](https://github.com/QingWei-Li/docsify/)
[Get Started](#quick-start)

<!-- background image -->
![](_media/bg.png)

<!-- background color -->
![color](#f0f0f0)
```
