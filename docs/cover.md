# Cover

Activate the cover feature by setting `coverpage` to **true**. Details are available in the [coverpage configuration paragraph](configuration#coverpage).

## Basic usage

Set `coverpage` to **true**, and create a `_coverpage.md`:

```html
<!-- index.html -->

<script>
  window.$docsify = {
    coverpage: true
  }
</script>
<script src="//unpkg.com/docsify"></script>
```


```markdown
<!-- _coverpage.md -->

![logo](_media/icon.svg)

# docsify <small>3.0</small>

> A magical documentation site generator.

- Simple and lightweight (~14kB gzipped)
- No statically built html files
- Multiple themes


[GitHub](https://github.com/QingWei-Li/docsify/)
[Get Started](#docsify)
```

!> A document site can have only one cover page.

## Custom background

The background color is generated randomly by default. You can customize the background color or image:

```markdown
<!-- _coverpage.md -->

# docsify

[GitHub](https://github.com/QingWei-Li/docsify/)
[Get Started](#quick-start)

<!-- background image -->
![](_media/bg.png)
<!-- background color -->
![color](#f0f0f0)
```
