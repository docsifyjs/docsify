# 服务端渲染（SSR）

先看例子 https://docsify.now.sh

项目地址在 https://github.com/docsifyjs/docsify-ssr-demo

![](https://dn-mhke0kuv.qbox.me/2bfef08c592706108055.png)

文档依旧是部署在 GitHub Pages 上，Node 服务部署在 now.sh 里，渲染的内容是从 GitHub Pages 上同步过来的。所以静态部署文档的服务器和服务端渲染的 Node 服务器是分开的，也就是说你还是可以用之前的方式更新文档，并不需要每次都部署。



## 快速开始

如果你熟悉 `now` 的使用，接下来的介绍就很简单了。先创建一个新项目，并安装 `now` 和 `docsify-cli`。

```bash
mkdir my-ssr-demo && cd my-ssr-demo
npm init -y
npm i now docsify-cli -D
```

配置 `package.json`

```json
{
  "scripts": {
    "start": "docsify start .",
    "deploy": "now -p"
  },
  "docsify": {
    "config": {
      "basePath": "https://docsify.js.org/",
      "loadSidebar": true,
      "loadNavbar": true
    }
  }
}
```

如果你还没有创建文档，可以参考[之前的文章](https://zhuanlan.zhihu.com/p/24540753)。其中 `basePath` 为文档所在的路径，可以填你的 docsify 文档网站。

配置可以单独写在配置文件内，然后通过 `--config config.js` 加载。

渲染的基础模版也可以自定义，配置在 `template` 属性上，例如

```js
"docsify": {
    "template": "./ssr.html",
    "config": {
      "basePath": "https://docsify.js.org/",
      "loadSidebar": true,
      "loadNavbar": true
    }
  }
```

*ssr.html*

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>docsify</title>
  <link rel="icon" href="_media/favicon.ico">
  <meta name="keywords" content="doc,docs,documentation,gitbook,creator,generator,github,jekyll,github-pages">
  <meta name="description" content="A magical documentation generator.">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <link rel="stylesheet" href="//unpkg.com/docsify/lib/themes/vue.css" title="vue">
</head>
<body>
  <!--inject-app-->
  <!--inject-config-->
</body>
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
<script src="//unpkg.com/docsify/lib/plugins/search.min.js"></script>
</html>

```

其中 `<!--inject-app-->` 和 `<!--inject-config-->` 为占位符，会自动将渲染后的 html 和配置内容注入到页面上。

现在，你可以运行 `npm start` 预览效果，如果没有问题就通过 `npm run deploy` 部署服务。

```bash
npm start
# open http://localhost:4000

npm run deploy
# now ...
```



## 更多玩法

`docsify start` 其实是依赖了 [`docsify-server-renderer`](https://npmarket.surge.sh/?name=docsify-server-renderer) 模块，如果你感兴趣，你完全可以用它自己实现一个 server，可以加入缓存等功能。

```js
var Renderer = require('docsify-server-renderer')
var readFileSync = require('fs').readFileSync

// init
var renderer = new Renderer({
  template: readFileSync('./docs/index.template.html', 'utf-8').,
  config: {
    name: 'docsify',
    repo: 'docsifyjs/docsify'
  }
})

renderer.renderToString(url)
  .then(html => {})
  .catch(err => {})
```

当然文档文件和 server 也是可以部署在一起的，`basePath` 不是一个 URL 的话就会当做文件路径处理，也就是从服务器上加载资源。
