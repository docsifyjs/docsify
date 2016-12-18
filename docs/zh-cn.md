<p align="center">
  <img alt="docsify" src="https://cloud.githubusercontent.com/assets/7565692/21292094/5c206de4-c533-11e6-9493-29ea67b01dde.png">
</p>

<p align="center">
  无需构建快速生成文档页
</p>

## 特性
- 无需构建，写完 markdown 直接发布
- 支持自定义主题
- 容易使用并且轻量 (~12kB gzipped)

## 快速上手

### 创建项目
新建一个空项目，接着创建一个 `docs` 目录并进入到 docs 目录下
```shell
mkdir my-project && cd my-project
mkdir docs && cd docs
```

### 创建入口文件
创建一个 `404.html` 文件，内容为
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="//unpkg.com/docsify/themes/vue.css">
</head>
<body>
  <div id="app"></div>
</body>
<script src="//unpkg.com/docsify"></script>
</html>
```

新建 `README.md` 文件，作为主页面

```
# Title

## balabala
```

### 部署！
将项目 `push` 到 GitHub 仓库后到设置页面开启 **GitHub Pages** 功能，选择 `docs/` 选项
![image](https://cloud.githubusercontent.com/assets/7565692/20639058/e65e6d22-b3f3-11e6-9b8b-6309c89826f2.png)

## 命令行工具

方便快速创建文档目录，会读取项目的 `package.json` 里的选项作为 docsify 的配置，支持本地预览。

### 安装
```shell
npm i docsify-cli -g
```

### 初始化文档

默认初始化在当前目录，推荐将文档放在 `docs` 目录下
```shell
docsify init docs
```

### 启动本地服务
启动一个 server 方便预览，打开 http://localhost:3000
```shell
docsify serve docs
```

更多选项参考 [docsify-cli](https://github.com/QingWei-Li/docsify-cli)

## 主题
目前提供 vue.css 和 buble.css，直接修改 `404.html` 里的 cdn 地址即可
```html
<link rel="stylesheet" href="//unpkg.com/docsify/themes/vue.css">
<link rel="stylesheet" href="//unpkg.com/docsify/themes/buble.css">
```

压缩版

```html
<link rel="stylesheet" href="//unpkg.com/docsify/lib/themes/vue.css">
<link rel="stylesheet" href="//unpkg.com/docsify/lib/themes/buble.css">
```

## 更多功能

### 多页面
`README.md` 作为主页面，如果需要其他页面，直接在文档目录下创建对应的 `*.md` 文件，例如创建一个 `guide.md` 那么对应的路由就是 `/guide`。

### 导航
导航需要自己写在 `404.html` 文件里，效果参考本文档

```html
<nav>
  <a href="/docsify/">En</a>
  <a href="/docsify/zh-cn">中文</a>
</nav>
```

### CDN

目前可用的 CDN 有 [UNPKG](unpkg.com/docsify)，如果觉得访问较慢可以将文件放到 Pages 的目录下。

### 配置参数

#### repo
参考本文档的右上角的 GitHub 图标，如果要开启的话，将 `404.html` 里的 script 改成

```html
<script src="//unpkg.com/docsify" data-repo="your/repo"></script>
```

#### max-level
目录最大展开层级，默认值为 6

```html
<script src="//unpkg.com/docsify" data-max-level="6"></script>
```

#### el
替换节点元素，默认为 `#app`
```html
<script src="//unpkg.com/docsify" data-el="#app"></script>
```

#### sidebar-toggle

Sidebar 开关按钮

```html
<script src="//unpkg.com/docsify" data-sidebar-toggle></script>
```

#### sidebar

设置后 TOC 功能将不可用，适合导航较多的文档，`data-sidebar` 传入全局变量名。

![image](https://cloud.githubusercontent.com/assets/7565692/20647425/de5ab1c2-b4ce-11e6-863a-135868f2f9b4.png)

```html
<script>
  window.sidebar = [
    { slug: '/', title: 'Home' },
    {
      slug: '/pageA',
      title: 'page A',
      children: [
        { slug: '/pageA/childrenB', title: 'children B' }
      ]
    },
    { slug: '/PageC', title: 'Page C' }
  ]
</script>
<script src="/lib/docsify.js" data-sidebar="sidebar"></script>
```

#### load-sidebar

读取侧边栏配置文件，如果配置，默认加载当前目录下的 `_sidebar.md`。如果文件不存在，会显示 TOC 作为侧边栏内容。如果你有二级目录，也应该放置一份配置文件。

```html
<script src="/lib/docsify.js" data-load-sidebar></script>
```

你可以指定侧边栏文件名

```html
<script src="/lib/docsify.js" data-load-sidebar="_sidebar.md"></script>
```

`_sidebar.md` 的内容可以是这样的

```markdown
- [Home](/)
- [Installation](/installation)
- Essentials
  - [Getting Started](/getting-started)
  - [Dynamic Route Matching](/dynamic-matching)
  - [Nested Routes](/nested-routes)
  - [Programmatic Navigation](/navigation)
  - [Named Routes](/named-routes)
  - [Named Views](/named-views)
  - [Redirect and Alias](/redirect-and-alias)
  - [HTML5 History Mode](/history-mode)
```

#### load-navbar

读取导航配置文件，如果配置，默认加载当前目录下的 `_navbar.md`。如果文件不存在，会显示 html 里定义的导航栏。

```html
<script src="/lib/docsify.js" data-load-navbar></script>
```

你可以指定导航栏文件名

```html
<script src="/lib/docsify.js" data-load-navbar="_navbar.md"></script>
```

`_navbar.md` 的内容可以是这样

```markdown
- [en](/)
- [中文](/zh-cn)
```

当然也支持二级列表，将生成一个下拉列表
```markdown
- [download](/download)
- language
  - [en](/)
  - [中文](/zh-cn)
```


#### router

开启 hash router 功能，此时可以创建 `index.html` 作为入口文件，同时多页面切换不会重新加载资源。资源路径会被替换成 `/#/` 的形式。

```html
<script src="/lib/docsify.js" data-router></script>
```

#### auto2top

切换路由时自动跳转到页面顶部


```html
<script src="/lib/docsify.js" data-auto2top></script>
```

