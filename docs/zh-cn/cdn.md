# CDN

推荐使用 [unpkg](//unpkg.com) —— 能及时获取到最新版。

## 获取最新版本

根据 UNPKG 的规则，不指定特定版本号时将引入最新版。

```html
<!-- 引入 css -->
<link rel="stylesheet" href="//unpkg.com/docsify/themes/vue.css">

<!-- 引入 script -->
<script src="//unpkg.com/docsify/lib/docsify.js"></script>
```

## 获取指定版本

如果担心频繁地版本更新又可能引入未知 Bug，我们也可以使用具体的版本。规则是 `//unpkg.com/docsify@VERSION/`

```html
<!-- 引入 css -->
<link rel="stylesheet" href="//unpkg.com/docsify@2.0.0/themes/vue.css">

<!-- 引入 script -->
<script src="//unpkg.com/docsify@2.0.0/lib/docsify.js"></script>
```

!> 指定 *VERSION* 为 `latest` 可以强制每次都请求最新版本。

## 压缩版

CSS 的压缩文件位于 `/lib/themes/` 目录下

```html
<link rel="stylesheet" href="//unpkg.com/docsify/lib/themes/vue.css">
```

JS 的压缩文件是原有文件路径的基础上加 `.min`后缀

```html
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
```

## 其他 CDN

- http://www.bootcdn.cn/docsify (支持国内)
- https://cdn.jsdelivr.net/npm/docsify/ (国内外都支持)
- https://cdnjs.com/libraries/docsify
