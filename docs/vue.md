# Vue compatibility

Docsify allows Vue content to be added directly to you Markdown files. This can greatly simplify working with data and adding reactivity to your site.

To get started, add Vue [2.x](https://vuejs.org) or [3.x](https://v3.vuejs.org) to your `index.html` file:

```html
<!-- Vue 2.x -->
<script src="//cdn.jsdelivr.net/npm/vue@2/dist/vue.min.js"></script>

<!-- Vue 3.x -->
<script src="//cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js"></script>
```

The URLs above will load a production version of Vue which is optimized for performance. Alternatively, development versions of Vue are larger but offer helpful console warnings and [Vue.js devtools](https://github.com/vuejs/vue-devtools) support:

```html
<!-- Vue 2.x -->
<script src="//cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>

<!-- Vue 3.x -->
<script src="//cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js"></script>
```

## Template syntax

Vue [template syntax](https://vuejs.org/v2/guide/syntax.html) can be added directly to your markdown pages. This syntax can be used to generate dynamic content without additional configuration using [JavaScript expressions](https://vuejs.org/v2/guide/syntax.html#Using-JavaScript-Expressions) and Vue [directives](https://vuejs.org/v2/guide/syntax.html#Directives).

```markdown
<!-- JavaScript expressions -->
<p>2 + 2 = {{ 2 + 2 }}</p>

<!-- Hide in docsify, show everywhere else (e.g. GitHub) -->
<p v-if="false">Text for GitHub</p>

<!-- Sequenced content -->
<ul>
  <li v-for="i in 3">Item {{ i }}</li>
</ul>
```

<output data-lang="output">
  <p>2 + 2 = {{ 2 + 2 }}</p>

  <p v-if="false">Text for GitHub</p>

  <ul>
    <li v-for="i in 3">Item {{ i }}</li>
  </ul>
</output>

[View markdown on GitHub](https://github.com/docsifyjs/docsify/blob/develop/docs/vue.md#template-syntax)

Vue content becomes more interesting when data, methods, lifecycle hooks, and computed properties are used. These options can be specified as [global options](#global-options), [instance options](#instance-options), or within [components](#components).

```js
{
  data() {
    return {
      message: 'Hello, World!',
    };
  },
  methods: {
    hello() {
      alert(this.message);
    }
  }
}
```

```markdown
<!-- Show message in docsify, hide on GitHub  -->
<p v-text="message"></p>

<!-- Show message in docsify, Show text on GitHub  -->
<p v-text="message">Text for GitHub</p>

<!-- Invoke hello method -->
<p>
  <button v-on:click="hello">Say Hello</button>
</p>
```

<output data-lang="output">
  <p v-text="message"></p>
  <p v-text="message">Text for GitHub</p>
  <p><button v-on:click="hello">Say Hello</button></p>
</output>

[View markdown on GitHub](https://github.com/docsifyjs/docsify/blob/develop/docs/vue.md#options)

## Global options

Use `vueGlobalOptions` to share data, methods, lifecycle hooks, and computed properties throughout your site. These options will be available to Vue content not explicitly mounted via [instance options](#instance-options), [components](#components), or a markdown `<script>`.

```js
window.$docsify = {
  vueGlobalOptions: {
    data() {
      return {
        count: 0,
      };
    },
  },
};
```

```markdown
<p>
  <button v-on:click="count -= 1">-</button>
  {{ count }}
  <button v-on:click="count += 1">+</button>
</p>
```

Keep in mind that global `data()` is shared, so changes made in one location will affect all locations where global `data()` is used. These changes will also persist as users navigate your site. To demonstrate, let's render the above counter twice.

<output data-lang="output">
  <p>
    <button v-on:click="count -= 1">-</button>
    {{ count }}
    <button v-on:click="count += 1">+</button>
  </p>
  <p>
    <button v-on:click="count -= 1">-</button>
    {{ count }}
    <button v-on:click="count += 1">+</button>
  </p>
</output>

Notice how changes made to one counter affect the other. This is because both counters reference the global `count` value. Now, navigate to a new page and return to this page to see how these changes persists.

## Instance options

Use `vueOptions` to specify DOM elements to mount as Vue instances and their associated options as `key:value` pairs. DOM elements are specified using [CSS selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) as the key. Selectors are limited in scope to the main content area

```js
window.$docsify = {
  vueOptions: {
    "#counter": {
      data() {
        return {
          count: 0
        };
      }
      computed: {
        message() {
          const date = new Date();
          const hours = date.getHours();
          const greeting = hours < 12 ? 'morning' : 'day';

          return `Good ${greeting}!`;
        }
      }
    }
  }
};
```

```markdown
<div id="counter">
  <p>{{ message }}</p>
  <button v-on:click="count -= 10">-</button>
  {{ count }}
  <button v-on:click="count += 10">+</button>
</div>
```

<output id="counter">
  <p>{{ message }}</p>
  <button v-on:click="count -= 10">-</button>
  {{ count }}
  <button v-on:click="count += 10">+</button>
</output>

## Components

Docsify provides components

```js
window.$docsify = {
  vueComponents: {
    'button-counter': {
      template: `
        <button @click="count += 1">
          You clicked me {{ count }} times
        </button>
      `,
      data() {
        return {
          count: 0,
        };
      },
    },
  },
};
```

```markdown
<button-counter></button-counter>
```

<output data-lang="output">
  <button-counter></button-counter>
</output>

## Markdown script

TBD

```html
<!-- Vue 2.x  -->
<script>
  new Vue({
    el: '#example',
    // ...
  });
</script>
```

```html
<!-- Vue 3.x  -->
<script>
  Vue.createApp({
    // ...
  }).mount('#example');
</script>
```

!> Only the first `<script>` tag in a markdown file is executed. If you are working with multiple Vue components, all `Vue` instances must be created within this tag.
