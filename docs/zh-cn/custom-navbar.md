# 自定义导航栏

我们可以直接在 HTML 里定义导航栏，要注意链接要以 `#/` 开头。

*index.html*

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

如果不想手工写导航栏组件，或者需要根据不同目录加载不同的导航栏，那我们可以通过 Markdown 文件来配置。首先配置 `loadNavbar`，默认加载的文件为 `_navbar.md`。具体配置规则见[配置项#load-navbar](zh-cn/configuration#load-navbar)一节。

*index.html*


```html
<script>
  window.$docsify = {
    loadNavbar: true
  }
</script>
<script src="//unpkg.com/docsify"></script>
```

*_navbar.md*

```markdown
- [En](/)
- [中文](/zh-cn/)
```

`_navbar.md` 加载逻辑和 `sidebar` 文件一致，从每层目录下获取。例如当前路由为 `/zh-cn/custom-navbar` 那么是从 `/zh-cn/_navbar.md` 获取导航栏。

## 嵌套

如果导航内容过多，可以写成嵌套的列表，会被渲染成下拉列表的形式。

*_navbar.md*


```markdown
- 基础
 - [快速开始](zh-cn/quickstart)
 - [多页文档](zh-cn/more-pages)
 - [嵌套导航栏](zh-cn/custom-navbar)
 - [封面](zh-cn/cover)

- 配置
  - [配置项](zh-cn/configuration)
  - [主题](zh-cn/themes)
  - [使用插件](zh-cn/plugins)
  - [Markdown 配置](zh-cn/markdown)
  - [代码高亮](zh-cn/language-highlight)
```

效果图

![嵌套导航栏](_images/zh-cn/nested-navbar.png "嵌套导航栏")
