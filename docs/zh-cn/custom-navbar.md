# 自定义导航栏

我们可以直接在 HTML 里定义导航栏，要注意链接要以 `#/` 开头。

_index.html_

```html
<body>
  <nav>
    <a href="#/">EN</a>
    <a href="#/zh-cn/">中文</a>
  </nav>
  <div id="app"></div>
</body>
```

## 配置文件

那我们可以通过 Markdown 文件来配置导航。首先配置 `loadNavbar`，默认加载的文件为 `_navbar.md`。具体配置规则见[配置项#loadNavbar](configuration.md#loadnavbar)。

_index.html_

```html
<script>
  window.$docsify = {
    loadNavbar: true
  }
</script>
<script src="//unpkg.com/docsify"></script>
```

_\_navbar.md_

```markdown
* [En](/)
* [中文](/zh-cn/)
```

`_navbar.md` 加载逻辑和 `sidebar` 文件一致，从每层目录下获取。例如当前路由为 `/zh-cn/custom-navbar` 那么是从 `/zh-cn/_navbar.md` 获取导航栏。

## 嵌套

如果导航内容过多，可以写成嵌套的列表，会被渲染成下拉列表的形式。

_\_navbar.md_

```markdown
* 基础
  * [快速开始](zh-cn/quickstart.md)
  * [多页文档](zh-cn/more-pages.md)
  * [定制导航栏](zh-cn/custom-navbar.md)
  * [封面](zh-cn/cover.md)

* 配置
  * [配置项](zh-cn/configuration.md)
  * [主题](zh-cn/themes.md)
  * [使用插件](zh-cn/plugins.md)
  * [Markdown 配置](zh-cn/markdown.md)
  * [代码高亮](zh-cn/language-highlight.md)
```

效果图

![嵌套导航栏](../_images/zh-cn/nested-navbar.png '嵌套导航栏')
