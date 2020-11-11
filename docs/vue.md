# Vue compatibility

Docsify allows Vue content to be added directly to you markdown pages. This can greatly simplify working with data and adding reactivity to your site.

To get started, add Vue [2.x](https://vuejs.org) or [3.x](https://v3.vuejs.org) to your `index.html` file. Choose the production version for your live site or the development version for helpful console warnings and [Vue.js devtools](https://github.com/vuejs/vue-devtools) support.

#### Vue 2.x

```html
<!-- Production -->
<script src="//cdn.jsdelivr.net/npm/vue@2/dist/vue.min.js"></script>

<!-- Development -->
<script src="//cdn.jsdelivr.net/npm/vue@2/dist/vue.js"></script>
```

#### Vue 3.x

```html
<!-- Production -->
<script src="//cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js"></script>

<!-- Development -->
<script src="//cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js"></script>
```

## Template syntax

Vue [template syntax](https://vuejs.org/v2/guide/syntax.html) is used to create dynamic content. With no additinal configuration, this syntax offers several useful features like support for [JavaScript expressions](https://vuejs.org/v2/guide/syntax.html#Using-JavaScript-Expressions) and Vue [directives](https://vuejs.org/v2/guide/syntax.html#Directives) for loops and conditional rendering.

```markdown
<!-- Hide in docsify, show elsewhere (e.g. GitHub) -->
<p v-if="false">Text for GitHub</p>

<!-- Sequenced content (i.e. loop)-->
<ul>
  <li v-for="i in 3">Item {{ i }}</li>
</ul>

<!-- JavaScript expressions -->
<p>2 + 2 = {{ 2 + 2 }}</p>
```

<output data-lang="output">
  <p v-if="false">Text for GitHub</p>

  <ul>
    <li v-for="i in 3">Item {{ i }}</li>
  </ul>

  <p>2 + 2 = {{ 2 + 2 }}</p>
</output>

[View output on GitHub](https://github.com/docsifyjs/docsify/blob/develop/docs/vue.md#template-syntax)

Vue content becomes more interesting when [data](#data), [computed properties](#computed-properties), [methods](#methods), and [lifecycle hooks](#lifecycle-hooks) are used. These options can be specified as [global options](#global-options), [mount options](#mount-options), or within [components](#components).

### Data

```js
{
  data() {
    return {
      message: 'Hello, World!'
    };
  }
}
```

<!-- prettier-ignore-start -->
```markdown
<!-- Show message in docsify, show "{{ message }}" elsewhere (e.g. GitHub)  -->
{{ message }}

<!-- Show message in docsify, hide elsewhere (e.g. GitHub)  -->
<p v-text="message"></p>

<!-- Show message in docsify, show text elsewhere (e.g. GitHub)  -->
<p v-text="message">Text for GitHub</p>
```
<!-- prettier-ignore-end -->

<output data-lang="output">

{{ message }}

  <p v-text="message"></p>
  <p v-text="message">Text for GitHub</p>
</output>

[View output on GitHub](https://github.com/docsifyjs/docsify/blob/develop/docs/vue.md#data)

### Computed properties

```js
{
  computed: {
    timeOfDay() {
      const date = new Date();
      const hours = date.getHours();

      if (hours < 12) {
        return 'morning';
      }
      else if (hours < 18) {
        return 'afternoon';
      }
      else {
        return 'evening'
      }
    }
  },
}
```

```markdown
Good {{ timeOfDay }}!
```

<output data-lang="output">

Good {{ timeOfDay }}!

</output>

### Methods

```js
{
  data() {
    return {
      message: 'Hello, World!'
    };
  },
  methods: {
    hello() {
      alert(this.message);
    }
  },
}
```

<output data-lang="output">
  <p><button v-on:click="hello">Say Hello</button></p>
</output>

### Lifecycle Hooks

```js
{
  data() {
    return {
      images: null,
    };
  },
  created() {
    fetch('https://api.domain.com/')
      .then(response => response.json())
      .then(data => (this.images = data))
      .catch(err => console.log(err));
  }
}

// API response:
// [
//   { title: 'Image 1', url: 'https://domain.com/1.jpg' },
//   { title: 'Image 2', url: 'https://domain.com/2.jpg' },
//   { title: 'Image 3', url: 'https://domain.com/3.jpg' },
// ];
```

```markdown
<div style="display: flex;">
  <figure style="flex: 1;">
    <img v-for="image in images" :src="image.url" :title="image.title">
    <figcaption>{{ image.title }}</figcaption>
  </figure>
</div>
```

<output data-lang="output">
  <div style="display: flex;">
    <figure v-for="image in images" style="flex: 1; text-align: center;">
      <img :src="image.url">
      <figcaption>{{ image.title }}</figcaption>
    </figure>
  </div>
</output>

## Global options

Use `vueGlobalOptions` to share Vue options throughout your site. These options will be used when Docsify detects Vue content in the main content area that has not been previously mounted via [mount options](#mount-options), [components](#components), or a [markdown script](#markdown-script).

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

<output data-lang="output">
  <p>
    <button v-on:click="count -= 1">-</button>
    {{ count }}
    <button v-on:click="count += 1">+</button>
  </p>
</output>

Notice the behavior when multiple global counters are rendered:

<output data-lang="output">
  <p>
    <button v-on:click="count -= 1">-</button>
    {{ count }}
    <button v-on:click="count += 1">+</button>
  </p>
</output>

Changes made to one counter affect the both counters. This is because both instances reference the same global `count` value. Now, navigate to a new page and return to this section to see how changes made to global data persist between page loads.

## Mount options

Use `vueMountOptions` to specify Vue mount elements and their associated options. Mount elements are specified using a [CSS selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) as the key with an object containing Vue options as their value. Docsify will mount the first matching element in the main content area (`#main, .markdown-section`) each time a new page is loaded.

```js
window.$docsify = {
  vueMountOptions: {
    '#counter': {
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
<div id="counter">
  <button v-on:click="count -= 1">-</button>
  {{ count }}
  <button v-on:click="count += 1">+</button>
</div>
```

<output id="counter">
  <button v-on:click="count -= 1">-</button>
  {{ count }}
  <button v-on:click="count += 1">+</button>
</output>

## Components

Use `vueComponents` to register Vue components using the component name as the key with an object containing Vue options as the value. Component data is not shared and changes will not persist as users navigate the site.

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
<button-counter></button-counter>
```

<output data-lang="output">
  <button-counter></button-counter>
  <button-counter></button-counter>
</output>

## Markdown script

Vue content can mounted using a `<script>` tag in your markdown pages.

!> Only the first `<script>` tag in a markdown file is executed. If you wish to mount multiple Vue instances using a script tag, all instances must be mounted within the first script tag in your markdown.

```html
<!-- Vue 2.x  -->
<script>
  new Vue({
    el: '#example',
    // Options...
  });
</script>
```

```html
<!-- Vue 3.x  -->
<script>
  Vue.createApp({
    // Options...
  }).mount('#example');
</script>
```

## Technical Notes

- Docsify processes Vue content in the following order:
  1. Markdown `<script>`
  1. `vueMountOptions`
  1. `vueGlobalOptions`
- Docsify will not mount an existing Vue instance or an element that contains an existing Vue instance.
- Docsify will automatically destroy/unmount all Vue instances it creates before new page content is loaded.
- When processing `vueGlobalOptions`, docsify parses each root element of the main content area and mounts the element if Vue content is detected. Docsify does not parse each individual node within the main content area.
- When processing `vueGlobalOptions`, docsify will only detect the full `v-` attribute syntax (e.g `v-bind:href` or `v-on:click`). For performance reasons, detection of Vue's [shorthand](https://vuejs.org/v2/guide/syntax.html#Shorthands) attribute syntax (e.g. `:href`or `@click`) is not supported.
