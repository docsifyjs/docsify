# 多页文档

如果你的文档需要创建多个页面，或者需要提供多语言的文档。在 docsify 里也能很容易的实现。例如创建一个 `guide.md` 文件，那么对应的路由就是 `/#/guide`。

一个简单的例子：

```text
-| docs/
  -| README.md
  -| guide.md
  -| zh-cn/
    -| README.md
    -| guide.md
```

那么对应的访问页面将是

```text
docs/README.md        => http://domain.com
docs/guide.md         => http://domain.com/guide
docs/zh-cn/README.md  => http://domain.com/zh-cn/
docs/zh-cn/guide.md   => http://domain.com/zh-cn/guide
```

## 定制侧边栏

默认情况下，侧边栏会根据当前文档的目录生成。你可以定制成文档链接，效果如当前的文档的侧边栏。

首先配置 docsify 的 `loadSidebar` 选项，具体配置规则见[配置项#load-sidebar](zh-cn/configuration#load-sidebar)一章。

```html
<script>
  window.$docsify = {
    loadSidebar: true
  }
</script>
<script src="//unpkg.com/docsify"></script>
```

接着创建 `_sidebar.md` 文件，内容如下

```markdown
- [首页](zh-cn/)
- [指南](zh-cn/guide)
```

!> 需要在文档更目录创建 `.nojekyll` 命名的空文件，阻止 GitHub Pages 忽略命名是下划线开头的文件。


## 显示目录

自定义侧边栏同时也可以开启目录功能。设置 `subMaxLevel` 配置项，具体介绍见 [配置项#sub-max-level](zh-cn/configuration#sub-max-level)。

```html
<script>
  window.$docsify = {
    loadSidebar: true,
    subMaxLevel: 2
  }
</script>
<script src="//unpkg.com/docsify"></script>
```
