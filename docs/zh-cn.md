
## 特性
- 无需构建，写完 markdown 直接发布
- 支持自定义主题
- 容易使用并且轻量 (~12kb gzipped)

## 快速上手

### 创建项目
新建一个空项目，接着创建一个 `docs` 目录并进入到 docs 目录下
```bash
mkdir my-project && cd my-project
mkdir docs && cd docs
```

### 创建入口文件
创建一个 `index.html` 文件，内容为
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
```bash
npm i docsify-cli -g
```

### 初始化文档

默认初始化在当前目录，推荐将文档放在 `docs` 目录下
```bash
docsify init docs
```

### 启动本地服务
启动一个 server 方便预览，打开 http://localhost:3000
```bash
docsify serve docs
```

更多选项参考 [docsify-cli](https://github.com/QingWei-Li/docsify-cli)


## 更多功能

### 主题
目前提供 vue.css 和 buble.css，直接修改 `index.html` 里的 cdn 地址即可
```html
<link rel="stylesheet" href="//unpkg.com/docsify/themes/vue.css">
<link rel="stylesheet" href="//unpkg.com/docsify/themes/buble.css">
```

压缩版

```html
<link rel="stylesheet" href="//unpkg.com/docsify/lib/themes/vue.css">
<link rel="stylesheet" href="//unpkg.com/docsify/lib/themes/buble.css">
```

### 多页面
`README.md` 作为主页面，如果需要其他页面，直接在文档目录下创建对应的 `*.md` 文件，例如创建一个 `guide.md` 那么对应的路由就是 `/#/guide`。

### 导航
导航需要自己写在 `index.html` 文件里，效果参考本文档

```html
<nav>
  <a href="/#/docsify/">En</a>
  <a href="/#/docsify/zh-cn">中文</a>
</nav>
```



### CDN
- UNPKG [https://unpkg.com/docsify/](https://unpkg.com/docsify/)
- jsDelivr [http://www.jsdelivr.com/projects/docsify](http://www.jsdelivr.com/projects/docsify)

### 封面

只需要写几行简单的 markdown 就可以拥有一页精致的封面，通过添加 `data-coverpage` 属性，并创建 `_coverpage.md`，按照下面的格式书写即可。

```markdown
![logo](_media/icon.svg)

# docsify <small>1.2.0</small>

> A magical documentation site generator.

- Simple and lightweight (~12kb gzipped)
- Multiple themes
- Not build static html files


[GitHub](https://github.com/QingWei-Li/docsify/)
[Get Started](#quick-start)
```


#### 自定义封面背景
默认的背景是随机生成的，你可以自定义背景色或者背景图片。只需要在文档末尾用添加图片的 Markdown 语法

```markdown
# docsify <small>1.2.0</small>

> xxx

[GitHub](https://github.com/QingWei-Li/docsify/)
[Get Started](#quick-start)

<!-- 背景图片 -->
![](_media/bg.png)
<!-- 背景色 -->
![color](#f0f0f0)
```

### 自定义 Markdown parser

默认使用 [marked](https://github.com/chjj/marked) 处理 markdown 部分，你可以修改默认配置

```js
window.$docsify = {
  markdown: {
    smartypants: true
  }
}
```

甚至可以完全定制化

```js
window.$docsify = {
  markdown: function(marked) {
    // ...

    return marked
  }
}
```

### 文档助手
#### 内置「提示」语法

`!>`后面接内容，会渲染成带 tip 类名的段落。

```markdown
!> 提示信息，**支持其他 markdown 语法**
```

将被渲染成

```html
<p class="tip">提示信息<strong>支持其他 markdown 语法</strong></p>
```

效果

!> 适合显示醒目的内容

#### 内置「警示」语法

`?>`后面接内容，会渲染成带 warn 类名的段落。

```markdown
?> 警示内容样式
```

效果

?> 警示内容样式

### 结合 Vue

`index.html` 内引入 Vue 后，可以在文档里直接写 Vue 语法。默认会自己初始化一个 Vue 示例，当然我们也可以手动初始化一个实例。

index.html
```html
<script src="//unpkg.com/vue"></script>
<script src="//unpkg.com/docsify"></script>
```

```markdown
<ul>
  <li v-for="i in 10">{{ i }}</li>
</ul>
```

手动初始化示例

```markdown
<div>
  <input type="text" v-model="msg">
  <p>Hello, {{ msg }}</p>
</div>

<script>
  new Vue({
    el: 'main',
    data: { msg: 'Docsify' }
  })
</script>
```

## 配置参数

你可以通过在标签上添加属性的方式，或者给 `window.$docsify` 传配置信息。

### repo
参考本文档的右上角的 GitHub 图标，如果要开启的话，将 `index.html` 里的 script 改成

```html
<script src="//unpkg.com/docsify" data-repo="your/repo"></script>
```


```js
window.$docsify = {
  repo: 'your/repo'
}
```

### max-level
目录最大展开层级，默认值为 6

```html
<script src="//unpkg.com/docsify" data-max-level="6"></script>
```


```js
window.$docsify = {
  maxLevel: 6
}
```

### el
替换节点元素，默认为 `#app`
```html
<script src="//unpkg.com/docsify" data-el="#app"></script>
```


```js
window.$docsify = {
  el: '#app'
}
```

### load-sidebar

读取侧边栏配置文件，如果配置，默认加载当前目录下的 `_sidebar.md`。如果文件不存在，会显示 TOC 作为侧边栏内容。如果你有二级目录，也应该放置一份配置文件。
**如果用 `_` 开头作为文件名，你应该在文档目录下添加 `.nojekyll`，阻止 GitHub Pages 忽略下划线开头的文件。**

```html
<script src="/lib/docsify.js" data-load-sidebar></script>
```


你可以指定侧边栏文件名

```html
<script src="/lib/docsify.js" data-load-sidebar="_sidebar.md"></script>
```

```js
window.$docsify = {
  loadSidebar: '_sidebar.md'
}
```

`_sidebar.md` 的内容可以是这样的

```markdown
- [Home](/)
- [Installation](/installation)
- Essentials
  - [Getting Started](/getting-started)
  - [Dynamic Route Matching](/dynamic-matching)
  - [Nested Routes](/nested-routes)
```

### sub-max-level

显示 TOC 在自定义的侧边栏里，默认最大显示 0 层。


```html
<script src="/lib/docsify.js" data-load-sidebar data-max-sub-level="4"></script>
```

```js
window.$docsify = {
  maxSubLevel: 4
}
```

### load-navbar

读取导航配置文件，如果配置，默认加载当前目录下的 `_navbar.md`。如果文件不存在，会显示 html 里定义的导航栏。

```html
<script src="/lib/docsify.js" data-load-navbar></script>
```

你可以指定导航栏文件名

```html
<script src="/lib/docsify.js" data-load-navbar="_navbar.md"></script>
```

```js
window.$docsify = {
  loadNavbar: '_navbar.md'
}
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


### auto2top

切换路由时自动跳转到页面顶部


```html
<script src="/lib/docsify.js" data-auto2top></script>
```

```js
window.$docsify = {
  auto2top: true
}
```

### homepage

默认情况下网站会将根目录下 `README.md` 作为首页渲染，但是有些时候我们想指定其他文件，甚至想直接将 repo 下的 README 作为首页。


```html
<script src="/lib/docsify.js" data-homepage="https://raw.githubusercontent.com/QingWei-Li/docsify/master/README.md"></script>
<!-- 或者将 Welcome.md 作为首页 -->
<script src="/lib/docsify.js" data-homepage="Welcome.md"></script>
```

```js
window.$docsify = {
  homepage: true
}
```

### base-path

指定加载文档的路径，如果你的 HTML 入口文件和文档是放在不同地方，你可以设置：

```html
<script src="/lib/docsify.js" data-base-path="/base/"></script>

<!-- 甚至文档是在其他站点下 😄 -->
<script src="/lib/docsify.js" data-base-path="https://docsify.js.org/"></script>
```


```js
window.$docsify = {
  basePath: '/base/'
}
```

### coverpage

生成封面，参考 [#封面](/zh-cn#封面).

```html
<script src="/lib/docsify.js" data-coverpage></script>
<!-- or -->
<script src="/lib/docsify.js" data-coverpage="other.md"></script>

```


```js
window.$docsify = {
  coverpage: true
}
```


### name

项目名，将显示在侧边栏。

```html
<script src="/lib/docsify.js" data-name="docsify"></script>
```

```js
window.$docsify = {
  name: 'docsify'
}
```

### name-link

项目名链接，默认为 `window.location.pathname`。

```html
<script src="/lib/docsify.js" data-name-link="/"></script>
```

```js
window.$docsify = {
  nameLink: '/'
}
```

### theme-color

自定义主题色。


```html
<script src="/lib/docsify.js" data-theme-color="#3F51B5"></script>
```

```js
window.$docsify = {
  themeColor: '#3F51B5'
}
```
