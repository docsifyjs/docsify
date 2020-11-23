# Compatible with Vue

You can write Vue components directly in the Markdown file, and it will be parsed. You can use this feature to write vue demo and documentation together.

## Basic usage

Load the Vue in `./index.html`.

```html
<script src="//cdn.jsdelivr.net/npm/vue"></script>
<script src="//cdn.jsdelivr.net/npm/docsify"></script>

<!-- Or use the compressed files -->
<script src="//cdn.jsdelivr.net/npm/vue/dist/vue.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/docsify/lib/docsify.min.js"></script>
```

Then you can immediately write Vue code at Markdown file. `new Vue({ el: '#main' })` script is executed by default to create instance.

*README.md*

````markdown
# Vue guide

`v-for` usage.

```html
<ul>
  <li v-for="i in 10">{{ i }}</li>
</ul>
```

<ul>
  <li v-for="i in 10">{{ i }}</li>
</ul>
````

You can manually initialize a Vue instance.

*README.md*

```markdown
# Vue demo

<div id="main">hello {{ msg }}</div>

<script>
  new Vue({
    el: '#main',
    data: { msg: 'Vue' }
  })
</script>
```

!> In a Markdown file, only the script within the first script tag is executed.

## Combine Vuep to write playground

[Vuep](https://github.com/QingWei-Li/vuep) is a component for rendering Vue components with live editor and preview. Supports Vue component spec and JSX.

*index.html*

```html
<!-- Inject CSS file -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/vuep/dist/vuep.css">

<!-- Inject JavaScript file -->
<script src="//cdn.jsdelivr.net/npm/vue"></script>
<script src="//cdn.jsdelivr.net/npm/vuep"></script>
<script src="//cdn.jsdelivr.net/npm/docsify"></script>

<!-- or use the compressed files -->
<script src="//cdn.jsdelivr.net/npm/vue/dist/vue.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/vuep/dist/vuep.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/docsify/lib/docsify.min.js"></script>
```

*README.md*
```markdown
# Vuep

<vuep template="#example"></vuep>

<script v-pre type="text/x-template" id="example">
  <template>
    <div>Hello, {{ name }}!</div>
  </template>

  <script>
    module.exports = {
      data: function () {
        return { name: 'Vue' }
      }
    }
  </script>
</script>
```

?> Example Refer to the [Vuep documentation](https://qingwei-li.github.io/vuep/).
