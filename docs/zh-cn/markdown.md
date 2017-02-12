# Markdown 配置

内置的 Markdown 解析插件是 [marked](https://github.com/chjj/marked)，你可以修改它的配置。

```js
window.$docsify = {
  markdown: {
    smartypants: true
    // ...
  }
}
```

?> 完整配置参数参考 [marked 文档](https://github.com/chjj/marked#options-1)

当然你也可以完全定制 markdown 解析规则。

```js
window.$docsify = {
  markdown: function(marked) {
    // ...

    return marked
  }
}
```