# Cover

Activate the cover feature by setting `coverpage`. The detail in [Configuration#coverpage](configuration#coverpage).

## Basic usage

Set `coverpage` to **true**, and create a `_coverpage.md`. You can see the effect in current website.


*index.html*

```html
<script>
  window.$docsify = {
    coverpage: true
  }
</script>
<script src="//unpkg.com/docsify"></script>
```

*_coverpage.md*

```markdown
![logo](_media/icon.svg)

# docsify

> A magical documentation site generator.

- Simple and lightweight (~12kb gzipped)
- Multiple themes
- Not build static html files


[GitHub](https://github.com/QingWei-Li/docsify/)
[Get Started](#quick-start)
```

!> A document site can have only one cover page.

## Custom background

The background color is generated randomly by default. You can customize the background color or image.

*_coverpage.md*

```markdown
# docsify

[GitHub](https://github.com/QingWei-Li/docsify/)
[Get Started](#quick-start)

<!-- background image -->
![](_media/bg.png)
<!-- background color -->
![color](#f0f0f0)
```
