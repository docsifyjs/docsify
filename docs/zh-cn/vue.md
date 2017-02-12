# 兼容 Vue

Docsify 的一大特色是可以配合 Vue 一起使用。你可以直接在 Markdown 文件里写 Vue 代码，它将被执行。我们可以用它写一些 Vue 的 Demo 或者示例代码。


## 基础用法

用法很简单，首先在 `index.html` 里引入 Vue 脚本。

```html
<script src="//unpkg.com/vue"></script>
<script src="//unpkg.com/docsify"></script>
```

接着就可以直接在 Markdown 里写 Vue 了。默认会自动执行 `new Vue({ el: 'main' })` 脚本。

*README.md*

```markdown
# Vue 介绍

`v-for` 的用法

```html
<ul>
  <li v-for="i in 10">{{ i }}</li>
</ul>
``

<ul>
  <li v-for="i in 10">{{ i }}</li>
</ul>
```

当然你也可以手动初始化 Vue，这样你可以自定义一些配置。

*README.md*

```markdown
# Vue 的基本用法

<div>hello {{ msg }}</div>
<script>
  new Vue({
    el: 'main',
    data: { msg: 'Vue' }
  })
</script>
```

!> 一个 Markdown 文件里只有第一个 `script` 标签内的内容会被执行。

## 搭配 Vuep 写 Playground

[Vuep](https://github.com/QingWei-Li/vuep) 是一个提供在线编辑和预览效果的 Vue 组件，搭配 docsify 可以直接在文档里写 Vue 的示例代码，支持 Vue component spec 和 JSX。

*index.html*

```html
<script src="//unpkg.com/vue"></script>
<script src="//unpkg.com/vuep"></script>
<script src="//unpkg.com/docsify"></script>
```

*README.md*
```markdown
# Vuep 使用

<vuep template="#example"></vuep>

<script type="text/x-template" id="example">
  <template>
    <div>Hello, {{ name }}!</div>
  </template>

  <script>
    export default {
      data: function () {
        return { name: 'Vue' }
      }
    }
  </script>
</script>
```

?> 具体效果参考 [Vuep 文档](https://qingwei-li.github.io/vuep/)。
