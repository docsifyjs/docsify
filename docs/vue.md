# Vue compatibility

Docsify allows Vue [v2.x](https://vuejs.org) and [v3.x](https://v3.vuejs.org) components to be added directly to you Markdown files. These components can greatly simplify working with data and adding reactivity to your content.

To get started, load either the production or development version of Vue in your `index.html`:

#### Vue 2.x

```html
<!-- Production -->
<script src="//cdn.jsdelivr.net/npm/vue@2/dist/vue.min.js"></script>

<!-- Development (debugging and Vue.js devtools support) -->
<script src="//cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
```

#### Vue 3.x

```html
<!-- Production -->
<script src="//cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js"></script>

<!-- Development (debugging and Vue.js devtools support) -->
<script src="//cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js"></script>
```

## Basic rendering

Docsify will automatically render basic Vue content that does not require `data`, `methods`, or other instance features.

```markdown
<ul>
  <li v-for="i in 3">{{ i }}</li>
</ul>
```

The HTML above will render the following:

<ul>
  <li v-for="i in 3">{{ i }}</li>
</ul>

## Advanced usage

Vue components and templates that require `data`, `methods`, computed properties, lifecycle hooks, etc. require manually creating a new `Vue()` instance within a `<script>` tag in your markdown.

<!-- prettier-ignore-start -->

```markdown
<div id="example-1">
  <p>{{ message }}</p>

  <button v-on:click="hello">Say Hello</button>

  <button v-on:click="counter -= 1">-</button>
  {{ counter }}
  <button v-on:click="counter += 1">+</button>
</div>
```

<!-- prettier-ignore-end -->

#### Vue 2.x

```markdown
<script>
  new Vue({
    el: "#example-1",
    data: function() {
      return {
        counter: 0,
        message: "Hello, World!"
      };
    },
    methods: {
      hello: function() {
        alert(this.message);
      }
    }
  });
</script>
```

#### Vue 3.x

```markdown
<script>
  Vue.createApp({
    data: function() {
      return {
        counter: 0,
        message: "Hello, World!"
      };
    },
    methods: {
      hello: function() {
        alert(this.message);
      }
    }
  }).mount("#example-1");
</script>
```

The HTML & JavaScript above will render the following:

<!-- prettier-ignore-start -->

<div id="example-1">
  <p>{{ message }}</p>

  <button v-on:click="hello">Say Hello</button>

  <button v-on:click="counter -= 1">-</button>
  {{ counter }}
  <button v-on:click="counter += 1">+</button>
</div>

<!-- prettier-ignore-end -->

!> Only the first `<script>` tag in a markdown file is executed. If you are working with multiple Vue components, all `Vue` instances must be created within this tag.

<script>
  new Vue({
    el: "#example-1",
    data: function() {
      return {
        counter: 0,
        message: "Hello, World!"
      };
    },
    methods: {
      hello: function() {
        alert(this.message);
      }
    }
  });
</script>
