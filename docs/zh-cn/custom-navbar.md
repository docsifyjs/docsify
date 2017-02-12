# 自定义导航栏

> TODO

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

## 嵌套

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

![嵌套导航栏](_images/zh-cn/nested-navbar.png "嵌套导航栏")
