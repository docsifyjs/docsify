# 主题

目前提供三套主题可供选择，模仿 [Vue](//vuejs.org) 和 [buble](//buble.surge.sh) 官网订制的主题样式。还有 [@liril-net](https://github.com/liril-net) 贡献的黑色风格的主题。

```html
  <link rel="stylesheet" href="//unpkg.com/docsify/themes/vue.css">
  <link rel="stylesheet" href="//unpkg.com/docsify/themes/buble.css">
  <link rel="stylesheet" href="//unpkg.com/docsify/themes/dark.css">
  <link rel="stylesheet" href="//unpkg.com/docsify/themes/pure.css">
```

!> CSS 的压缩文件位于 `/lib/themes/`

```html
  <link rel="stylesheet" href="//unpkg.com/docsify/lib/themes/vue.css">
  <link rel="stylesheet" href="//unpkg.com/docsify/lib/themes/buble.css">
  <link rel="stylesheet" href="//unpkg.com/docsify/lib/themes/dark.css">
  <link rel="stylesheet" href="//unpkg.com/docsify/lib/themes/pure.css">
```

如果你有其他想法或者想开发别的主题，欢迎提 [PR](https://github.com/QingWei-Li/docsify/pulls)。

#### 点击切换主题


<div class="demo-theme-preview">
  <a data-theme="vue">vue.css</a>
  <a data-theme="buble">buble.css</a>
  <a data-theme="dark">dark.css</a>
  <a data-theme="pure">pure.css</a>
</div>


<style>
  .demo-theme-preview a {
    padding-right: 10px;
  }

  .demo-theme-preview a:hover {
    text-decoration: underline;
    cursor: pointer;
  }
</style>

<script>
  var preview = Docsify.dom.find('.demo-theme-preview');
  var themes = Docsify.dom.findAll('[rel="stylesheet"]');

  preview.onclick = function (e) {
    var title = e.target.getAttribute('data-theme')

    themes.forEach(function (theme) {
      theme.disabled = theme.title !== title
    });
  };
</script>
