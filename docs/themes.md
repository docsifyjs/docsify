# Themes

## Official

Docsify offers several official themes. Official themes are available on multiple [CDNs](cdn). Uncompressed themes are available by omitting `.min` from the filename.

#### Core

This theme contains only the "core" styles and the default [theme property](#theme-properties) values. It is an excellent starting point for [customization](#customization).

<!-- prettier-ignore -->
```html
<!-- Core -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/core.min.css" />
```

<a href="#" class="button primary" data-theme="core">Preview Core</a>

#### Vue

The popular Docsify v4 theme updated for use with Docsify's new [theme properties](#theme-properties).

<!-- prettier-ignore -->
```html
<!-- Vue -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/vue.min.css" />
```

<a href="#" class="button primary" data-theme="vue">Preview Vue</a>

---

<details>
  <summary><h4>Legacy Themes</h4></summary>

!> The following legacy themes have been deprecated as of v5 and will be removed in the next major version of Docisfy.

<!-- prettier-ignore -->
```html
<!-- Buble -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/buble.min.css" />
```

<a href="#" class="button secondary" data-theme="buble">Preview Buble</a>

<!-- prettier-ignore -->
```html
<!-- Dark -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/dark.min.css" />
```

<a href="#" class="button secondary" data-theme="dark">Preview Dark</a>

<!-- prettier-ignore -->
```html
<!-- Dolphin -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/dolphin.min.css" />
```

<a href="#" class="button secondary" data-theme="dolphin">Preview Dolphin</a>

<!-- prettier-ignore -->
```html
<!-- Pure -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/pure.min.css" />
```

<a href="#" class="button secondary" data-theme="pure">Preview Pure</a>

</details>

## Community

The Docsify team endorses the following third-party themes:

- [docsify-themeable](https://jhildenbiddle.github.io/docsify-themeable) - A delightfully simple theme system for docsify. Provided by [@jhildenbiddle](https://github.com/jhildenbiddle).

See [Awesome Docsify](awesome) for additional community themes.

## Customization

Docsify provides [theme properties](#theme-properties) for simplified customization of frequently modified styles.

1. Add a `<style>` tag after the theme stylesheet in your `index.html`.

   <!-- prettier-ignore -->
   ```html
   <!-- Theme -->
   <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/core.min.css" />

   <!-- Custom theme styles -->
   <style>
     :root {
       /* ... */
     }
   </style>
   ```

   Theme properties can also be set on a per-page basis in markdown.

   ```markdown
   # My Heading

   Hello, World!

   <style>
     :root {
       /* ... */
     }
   </style>
   ```

2. Set custom [theme properties](#theme-properties) within a `:root` declaration.

   <!-- prettier-ignore -->
   ```css
   :root {
     --theme-color: red;
     --font-size  : 15px;
     --line-height: 1.5;
   }
   ```

   Custom [theme properties](#theme-properties) can be conditionally applied in light and/or dark mode.

   <!-- prettier-ignore -->
   ```css
   /* Light and dark mode */
   :root {
     --theme-color: pink;
   }

   /* Light mode only */
   @media (prefers-color-scheme: light) {
     :root {
       --color-bg  : #eee;
       --color-text: #444;
     }
   }

   /* Dark mode only */
   @media screen and (prefers-color-scheme: dark) {
     :root {
       --color-bg  : #222;
       --color-text: #ddd;
     }
   }
   ```

3. Custom fonts can be used by adding web font resources and modifying `--font-family` properties as needed:

   <!-- prettier-ignore -->
   ```css
   /* Fonts: Noto Sans, Noto Emoji, Noto Mono */
   @import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&family=Noto+Sans+Mono:wght@100..900&family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap');

   :root {
     --font-family      : 'Noto Sans', sans-serif;
     --font-family-emoji: 'Noto Color Emoji', sans-serif;
     --font-family-mono : 'Noto Sans Mono', monospace;
   }
   ```

   ?> **Theme authors**: Consider providing instructions for loading your recommended web fonts manually instead of including them in your theme using `@import`. This allows users who prefer a different font to avoid loading your recommended web font(s) unnecessarily.

4. Advanced styling may require custom CSS declarations. This is expected, however custom CSS declarations may break when new versions of Docsify are released. When possible, leverage [theme properties](#theme-properties) instead of custom declarations or lock your [CDN](cdn) URLs to a [specific version](cdn#specific-version) to avoid potential issues when using custom CSS declarations.

   ```css
   .sidebar li.active > a {
     border-right: 3px solid var(--theme-color);
   }
   ```

## Theme Properties

The following properties are available in all official Docsify themes. Default values for the "Core" theme are shown.

?> **Theme and plugin authors**: We encourage you to leverage these custom theme properties and to offer similar customization options in your projects.

#### Common

Below are the most commonly modified theme properties. [Advanced](#advanced) theme properties are also available for use but typically do not need to be modified.

**TBD**

<!-- TODO: Replace with include from CDN /src/themes/shared/_vars.css -->

#### Advanced

Advanced theme properties are also available for use but typically do not need to be modified. Values derived from [common](#common) theme properties but can be set explicitly if preferred.

**TBD**

<!-- TODO: Replace with include from CDN /src/themes/shared/_vars-advanced.css -->

<script>
  const previewElm = Docsify.dom.findAll('a[data-theme]');
  const stylesheetElms = Docsify.dom.findAll('link[rel="stylesheet"]');

  previewElm.forEach(elm => {
    elm.onclick = (e) => {
      e.preventDefault();
      const title = e.target.getAttribute('data-theme');
      const newSheet = stylesheetElms.some(sheet => sheet.title = title);

      if (newSheet) {
        newSheet.disabled = false;

        stylesheetElms.forEach(sheet => {
          sheet.disabled =
            (sheet !== newSheet) &&
            (sheet.title !== title);
        });
      }
    };
  });
</script>
