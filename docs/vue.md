# Vue compatibility

Docsify allows [Vue.js](https://vuejs.org) components to be added directly to you Markdown files. These components can greatly simplify working with data and adding reactivity to your content.

To get started, load either the production (minified) or development (unminified) version of Vue in your `index.html`:

```html
<!-- Production (minified) -->
<script src="//cdn.jsdelivr.net/npm/vue@2/dist/vue.min.js"></script>

<!-- Development (unminified, with debugging info via console) -->
<script src="//cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
```

## Basic rendering

Docsify will automatically render basic Vue content that does not require `data`, `methods`, or other instance features.

```markdown
<button v-on:click.native="this.alert('Hello, World!')">Say Hello</button>

<ul>
  <li v-for="i in 3">{{ i }}</li>
</ul>
```

The HTML above will render the following:

<button v-on:click="this.alert('Hello, World!')">Say Hello</button>

<ul>
  <li v-for="i in 3">{{ i }}</li>
</ul>

## Advanced usage

Vue components and templates that require `data`, `methods`, computed properties, lifecycle hooks, etc. require manually creating a new `Vue()` instance within a `<script>` tag in your markdown.

```markdown
<div id="example-1">
  <p>{{ message }}</p>

  <button v-on:click="hello">Say Hello</button>

  <button v-on:click="counter -= 1">-</button>
  {{ counter }}
  <button v-on:click="counter += 1">+</button>
</div>
```

```markdown
<script>
  new Vue({
    el: "#example-1",
    data: function() {
      counter: 0,
      message: "Hello, World!"
    },
    methods: {
      hello: function() {
        alert(this.message);
      }
    }
  });
</script>
```

The HTML & JavaScript above will render the following:

<div id="example-1">
  <p>{{ message }}</p>

  <button v-on:click="hello">Say Hello</button>

  <button v-on:click="counter -= 1">-</button>
  {{ counter }}
  <button v-on:click="counter += 1">+</button>
</div>

!> Only the first `<script>` tag in a markdown file is executed. If you are working with multiple Vue components, all `Vue` instances must be created within this tag.

## Vuep playgrounds

[Vuep](https://github.com/QingWei-Li/vuep) is a Vue component that provides a live editor and preview for Vue content. See the [vuep documentation](https://qingwei-li.github.io/vuep/) for details.

Add Vuep CSS and JavaScript to your `index.html`:

```html
<!-- Vuep CSS -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/vuep/dist/vuep.css">

<!-- Vuep JavaScript -->
<script src="//cdn.jsdelivr.net/npm/vuep/dist/vuep.min.js"></script>
```

Add vuep markup to a markdown file (e.g. `README.md`):

```markdown
<vuep template="#example-2"></vuep>

<script v-pre type="text/x-template" id="example-2">
  <template>
    <div>Hello, {{ name }}!</div>
  </template>

  <script>
    module.exports = {
      data: function() {
        return { name: 'Vue' }
      }
    }
  </script>
</script>
```

<vuep template="#example-2"></vuep>

<script v-pre type="text/x-template" id="example-2">
  <template>
    <div>Hello, {{ name }}!</div>
  </template>

  <script>
    module.exports = {
      data: function() {
        return { name: 'World' }
      }
    }
  </script>
</script>

<script>
  new Vue({
    el: "#example-1",
    data: {
      counter: 0,
      message: "Hello, World!"
    },
    methods: {
      hello: function() {
        alert(this.message);
      }
    }
  });
</script>
