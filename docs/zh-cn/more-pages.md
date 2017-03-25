# 多页文档

如果需要创建多个页面，或者需要多级路由的网站，在 docsify 里也能很容易的实现。例如创建一个 `guide.md` 文件，那么对应的路由就是 `/#/guide`。

假设你的目录结构如下：

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

默认情况下，侧边栏会根据当前文档的标题生成目录。也可以设置文档链接，通过 Markdown 文件生成，效果如当前的文档的侧边栏。

首先配置 `loadSidebar` 选项，具体配置规则见[配置项#load-sidebar](configuration.md#load-sidebar)。

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

!> 需要在文档根目录创建 `.nojekyll` 命名的空文件，阻止 GitHub Pages 忽略命名是下划线开头的文件。


`_sidebar.md` 的加载逻辑是从每层目录下获取文件，如果当前目录不存在该文件则回退到上一级目录。例如当前路径为 `/zh-cn/more-pages` 则从 `/zh-cn/_sidebar.md` 获取文件，如果不存在则从 `/_sidebar.md` 获取。

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

## Ignoring Subheaders

When `subMaxLevel` is set, each header is automatically added to the table of contents by default. If you want to ignore a specific header, add `{docsify-ignore}` to it.

```markdown
# Getting Started

## Header {docsify-ignore}
This header won't appear in the sidebar table of contents.
```

To ignore all headers on a specific page, you can use `{docsify-ignore-all}` on the first header of the page.

```markdown
# Getting Started {docsify-ignore-all}

## Header
This header won't appear in the sidebar table of contents.
```

Both `{docsify-ignore}` and `{docsify-ignore-all}` will not be rendered on the page when used.

