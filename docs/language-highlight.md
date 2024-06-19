# Language highlighting

## Prism

Docsify uses [Prism](https://prismjs.com) for syntax highlighting within code blocks. Prism supports the following languages by default (additional [language support](#language-support) also available):

- Markup: HTML, XML, SVG, MathML, SSML, Atom, RSS
- CSS
- C-like
- JavaScript

To enable syntax highlighting, create a markdown codeblock using backticks (` ``` `) with a [language](https://prismjs.com/#supported-languages) specified on the first line (e.g., `html`, `css`, `js`):

````text
```html
<p>This is a paragraph</p>
<a href="//docsify.js.org/">Docsify</a>
```
````

````text
```css
p {
  color: red;
}
```
````

````text
```js
function add(a, b) {
  return a + b;
}
```
````

The above markdown will be rendered as:

```html
<p>This is a paragraph</p>
<a href="//docsify.js.org/">Docsify</a>
```

```css
p {
  color: red;
}
```

```js
function add(a, b) {
  return a + b;
}
```

## Language support

Support for additional [languages](https://prismjs.com/#supported-languages) is available by loading the Prism [grammar files](https://cdn.jsdelivr.net/npm/prismjs@1/components/):

!> Prism grammar files must be loaded after Docsify.

```html
<script src="//cdn.jsdelivr.net/npm/prismjs@1/components/prism-bash.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/prismjs@1/components/prism-docker.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/prismjs@1/components/prism-git.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/prismjs@1/components/prism-java.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/prismjs@1/components/prism-jsx.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/prismjs@1/components/prism-markdown.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/prismjs@1/components/prism-php.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/prismjs@1/components/prism-python.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/prismjs@1/components/prism-rust.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/prismjs@1/components/prism-sql.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/prismjs@1/components/prism-swift.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/prismjs@1/components/prism-typescript.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/prismjs@1/components/prism-yaml.min.js"></script>
```

## Theme support

Docsify's official [themes](themes) are compatible with Prism syntax highlighting themes.

!> Prism themes must be loaded after Docsify themes.

```html
<!-- Light and dark mode -->
<link
  rel="stylesheet"
  href="//cdn.jsdelivr.net/npm/prism-themes@1/themes/prism-one-light.min.css"
/>
```

Themes can be applied in light and/or dark mode

```html
<!-- Dark mode only -->
<link
  rel="stylesheet"
  media="(prefers-color-scheme: dark)"
  href="//cdn.jsdelivr.net/npm/prism-themes@1/themes/prism-one-dark.min.css"
/>

<!-- Light mode only -->
<link
  rel="stylesheet"
  media="(prefers-color-scheme: light)"
  href="//cdn.jsdelivr.net/npm/prism-themes@1/themes/prism-one-light.min.css"
/>
```

The following Docsify [theme properties](themes#theme-properties) will override Prism theme styles by default:

```text
--border-radius
--font-family-mono
--font-size-mono
```

To use the values specified in the Prism theme, set the desired theme property to `unset`:

<!-- prettier-ignore -->
```html
<style>
  :root {
    --border-radius   : unset;
    --font-family-mono: unset;
    --font-size-mono  : unset;
  }
</style>
```

## Dynamic content

Dynamically generated Code blocks can be highlighted using Prism's [`highlightElement()`](https://prismjs.com/docs/Prism.html#.highlightElement) method:

```js
const code = document.createElement('code');
code.innerHTML = "console.log('Hello World!')";
code.setAttribute('class', 'language-javascript');
Prism.highlightElement(code);
```
