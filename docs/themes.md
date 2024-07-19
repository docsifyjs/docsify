# Themes

## Core theme

The Docsify "core" theme contains all of the styles and [theme properties](#theme-properties) needed to render a Docsify site. This theme is designed to serve as a minimalist theme on its own, in combination with [theme add-ons](#theme-add-ons), modified using core [classes](#classes), and as a starting point for [customization](#customization).

<!-- prettier-ignore -->
```html
<!-- Core Theme -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/dist/themes/core.min.css" />
```

## Theme add-ons

Theme add-ons are used in combination with the [core theme](#core-theme). Add-ons contain CSS rules that modify [theme properties](#theme-properties) values and/or add custom style declarations. They can often (but not always) be used with other add-ons.

!> Theme add-ons must be loaded after the [core theme](#core-theme).

<!-- prettier-ignore -->
```html
<!-- Core Theme -->
<link rel="stylesheet" href="..." />

<!-- Theme (add-on) -->
<link rel="stylesheet" href="..." />
```

### Core Dark (Add-on)

Dark mode styles for the [core theme](#core-theme). Styles can applied only when an operating system's dark mode is active by specifying a `media` attribute.

<label>
  <input
    class="toggle"
    type="checkbox"
    value="core-dark"
    data-group="addon"
    data-sheet
  >
  Preview Core Dark
</label>
<br>
<label>
  <input
    class="toggle"
    type="checkbox"
    value="core-dark-auto"
    data-group="addon"
    data-sheet
  >
  Preview Core Dark (Dark Mode Only)
</label>

<!-- prettier-ignore -->
```html
<!-- Core Dark (add-on) -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/dist/themes/addons/core-dark.min.css" />
```

<!-- prettier-ignore -->
```html
<!-- Core Dark - Dark Mode Only (add-on) -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/dist/themes/addons/core-dark.min.css" media="(prefers-color-scheme: dark)" />
```

### Vue theme (Add-on)

The popular Docsify v4 theme.

<label>
  <input
   class="toggle"
   type="checkbox"
   value="vue"
   data-group="addon"
   data-sheet
  >
  Preview Vue
</label>

<!-- prettier-ignore -->
```html
<!-- Vue Theme (add-on) -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/dist/themes/addons/vue.min.css" />
```

## Classes

The [core theme](#core-theme) provides several CSS classes for customizing your Docsify site. These classes should be applied to the `<body>` element within your `index.html` page.

<!-- prettier-ignore -->
```html
<body class="...">
```

### Loading

Display a loading animation while waiting for Docsify to initialize.

<!-- prettier-ignore -->
```html
<body class="loading">
```

<output data-lang="output">
  <div class="loading" style="margin: auto;"></div>
</output>

### Sidebar chevrons

Display expand/collapse icons on page links in the sidebar.

<label>
  <input class="toggle" type="checkbox" value="sidebar-chevron-right" data-class data-group="sidebar-chevron"> Preview <code>sidebar-chevron-right</code>
</label>
<br>
<label>
  <input class="toggle" type="checkbox" value="sidebar-chevron-left" data-class data-group="sidebar-chevron"> Preview <code>sidebar-chevron-left</code>
</label>

<!-- prettier-ignore -->
```html
<body class="sidebar-chevron-right">
```

<!-- prettier-ignore -->
```html
<body class="sidebar-chevron-left">
```

To prevent chevrons from displaying for specific page links, add a `no-chevron` class as follows:

```md
[My Page](page.md ':class=no-chevron')
```

**Theme properties**

<!-- prettier-ignore -->
```css
:root {
  --sidebar-chevron-collapsed-color: var(--color-mono-3);
  --sidebar-chevron-expanded-color : var(--theme-color);
}
```

### Sidebar groups

Add visual distinction between groups of links in the sidebar.

<label>
  <input class="toggle" type="checkbox" value="sidebar-group-box" data-class data-group="sidebar-group"> Preview <code>sidebar-group-box</code>
</label>
<br>
<label>
  <input class="toggle" type="checkbox" value="sidebar-group-underline" data-class data-group="sidebar-group"> Preview <code>sidebar-group-underline</code>
</label>

<!-- prettier-ignore -->
```html
<body class="sidebar-group-box">
```

<!-- prettier-ignore -->
```html
<body class="sidebar-group-underline">
```

### Sidebar link clamp

Limit multi-line sidebar links to a single line followed by an ellipses.

<label>
  <input class="toggle" type="checkbox" value="sidebar-link-clamp" data-class>
  Preview <code>sidebar-link-clamp</code>
</label>

<!-- prettier-ignore -->
```html
<body class="sidebar-link-clamp">
```

### Sidebar toggle

Display a "hamburger" icon (three lines) in the sidebar toggle button instead of the default "kebab" icon.

<label>
  <input class="toggle" type="checkbox" value="sidebar-toggle-chevron" data-class data-group="sidebar-toggle">
  Preview <code>sidebar-toggle-chevron</code>
</label>
<br>
<label>
  <input class="toggle" type="checkbox" value="sidebar-toggle-hamburger" data-class data-group="sidebar-toggle">
  Preview <code>sidebar-toggle-hamburger</code>
</label>

<!-- prettier-ignore -->
```html
<body class="sidebar-toggle-chevron">
```

<!-- prettier-ignore -->
```html
<body class="sidebar-toggle-hamburger">
```

## Customization

Docsify provides [theme properties](#theme-properties) for simplified customization of frequently modified styles.

1. Add a `<style>` tag after the theme stylesheet in your `index.html`.

   <!-- prettier-ignore -->
   ```html
   <!-- Theme -->
   <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/dist/themes/core.min.css" />

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

## Theme properties

The following properties are available in all official Docsify themes. Default values for the "Core" theme are shown.

?> **Theme and plugin authors**: We encourage you to leverage these custom theme properties and to offer similar customization options in your projects.

### Common

Below are the most commonly modified theme properties. [Advanced](#advanced) theme properties are also available for use but typically do not need to be modified.

<!-- TODO: Replace TBD with include CSS include below -->

**TBD**

<!-- [vars.css](https://raw.githubusercontent.com/docsifyjs/docsify/main/src/themes/shared/_vars.css ':include') -->

### Advanced

Advanced theme properties are also available for use but typically do not need to be modified. Values derived from [common](#common) theme properties but can be set explicitly if preferred.

<!-- TODO: Replace TBD with include CSS include below -->

**TBD**

<!-- [vars.css](https://raw.githubusercontent.com/docsifyjs/docsify/main/src/themes/shared/_vars.css ':include') -->

## Community

See [Awesome Docsify](awesome) for additional community themes.

<script>
  (function () {
    const toggleElms = Docsify.dom.findAll(
      'input:where([data-class], [data-sheet])',
    );
    const previewSheets = Docsify.dom.findAll(
      'link[rel="stylesheet"][data-sheet]',
    );

    function handleChange(e) {
      const elm = e.target.closest('[data-class], [data-sheet]');
      const value = elm.value;
      const groupVal = elm.getAttribute('data-group');
      const radioGroupName = elm.matches('[type="radio"]') ? elm.name : undefined;

      // Toggle class
      if (elm.matches('[data-class]')) {
        document.body.classList.toggle(value, elm.checked);
      }
      // Toggle sheet
      else {
        const themeSheet = previewSheets.find(
          sheet => sheet.getAttribute('data-sheet') === value,
        );

        themeSheet && (themeSheet.disabled = !elm.checked);
      }

      if (!elm.checked || (!groupVal && !radioGroupName)) {
        return;
      }

      // Group elements & values
      const groupElms = toggleElms.filter(elm =>
        groupVal
          ? groupVal === elm.getAttribute('data-group')
          : radioGroupName === elm.name,
      );
      const groupVals = groupElms.map(elm => elm.value);

      if (groupElms.length <= 1) {
        return;
      }

      if (groupVal) {
        // Uncheck other group elements
        groupElms.forEach(groupElm => {
          if (groupElm !== elm) {
            groupElm.checked = false;
          }
        });
      }

      // Remove group classes
      if (elm.matches('[data-class]')) {
        groupVals.forEach(className => {
          if (className !== value) {
            document.body.classList.remove(className);
          }
        });
      }
      // Disable group sheets
      else {
        const otherSheets = groupVals
          .map(val =>
            previewSheets.find(sheet => sheet.getAttribute('data-sheet') === val),
          )
          .filter(sheet => sheet && sheet.getAttribute('data-sheet') !== value);
        const disableSheets = otherSheets.length ? otherSheets : previewSheets;

        disableSheets.forEach(sheet => sheet.disabled = true);
      }
    }

    // Toggle active elms
    toggleElms.forEach(elm => {
      const value = elm.value;

      // Class toggle
      if (elm.matches('[data-class]')) {
        elm.checked = document.body.classList.contains(value);
      }
      // Sheet toggle
      else {
        const previewSheet = previewSheets.find(
          sheet => sheet.getAttribute('data-sheet') === value,
        );

        elm.checked = previewSheet && !previewSheet.disabled;
      }
    });

    toggleElms.forEach(elm => elm.addEventListener('change', handleChange));
  })();
</script>
