# Themes

## Core Theme

The Docsify "core" theme contains all of the styles and [theme properties](#theme-properties) needed to render a Docsify site. This theme is designed to serve as a minimalist theme on its own or [customized](#customization) using core [classes](#classes) and/or [add-ons](#add-ons).

<label>
  <input class="toggle" type="checkbox" checked disabled>
  Preview Core (Required)
</label>

<!-- prettier-ignore -->
```html
<!-- Core Theme -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/core.min.css" />
```

## Classes

The [core theme](#core-theme) provides several CSS classes for customizing your Docsify site. These classes should be applied to the `<body>` element within your `index.html` page.

<!-- prettier-ignore -->
```html
<body class="sidebar-chevron-right sidebar-group-box">
```

### Sidebar chevrons

Display expand/collapse icons on page links in the sidebar.

<label>
  <input class="toggle" type="checkbox" value="sidebar-chevron-right" data-class data-group="sidebar-chevron"> Preview <code>sidebar-chevron-right</code>
</label>
<br>
<label>
  <input class="toggle" type="checkbox" value="sidebar-chevron-left" data-class data-group="sidebar-chevron"> Preview <code>sidebar-chevron-left</code>
</label>

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

### Sidebar link clamp

Limit multi-line sidebar links to a single line followed by an ellipses.

<label>
  <input class="toggle" type="checkbox" value="sidebar-link-clamp" data-class>
  Preview <code>sidebar-link-clamp</code>
</label>

## Add-ons

Theme add-ons contain a partial collection of CSS rules used to customize a core theme using [theme properties](#theme-properties) values and/or style declarations. Add-ons require the use of a [core theme](#core-theme) and can often (but not always) be used with other add-ons.

### Core Dark (Add-on)

Dark mode styles for the Docsify [core theme](#core-theme). Styles can conditionally be applied only when an operating system's dark mode is active by specifying a `media` attribute.

<label>
  <input class="toggle" type="checkbox" value="core-dark" data-theme data-group="theme">
  Preview Core Dark
</label>
<br>
<label>
  <input class="toggle" type="checkbox" value="core-dark-auto" data-theme data-group="theme">
  Preview Core Dark (Dark Mode Only)
</label>

<!-- prettier-ignore -->
```html
<!-- Core Dark (add-on) -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/addons/core-dark.min.css" />
```

```html
<!-- Core Dark / Dark Mode Only (add-on) -->
<link
  rel="stylesheet"
  href="//cdn.jsdelivr.net/npm/docsify@5/themes/addons/core-dark.min.css"
  media="(prefers-color-scheme: dark)"
/>
```

<details>
  <summary><h3>Legacy themes</h3></summary>

The following Docsify v4 themes have been converted to theme add-ons for use with the Docsify v5 [core theme](#core-theme) theme.

!> These legacy themes have been deprecated and will be removed in the next major version of Docsify.

#### Buble (Add-on)

<label>
  <input class="toggle" type="checkbox" value="buble" data-theme data-group="theme">
  Preview Buble
</label>

<!-- prettier-ignore -->
```html
<!-- Buble theme (add-on) -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/buble.min.css" />
```

#### Dark (Add-on)

<label>
  <input class="toggle" type="checkbox" value="dark" data-theme data-group="theme">
  Preview Dark
</label>

<!-- prettier-ignore -->
```html
<!-- Dark theme (add-on) -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/dark.min.css" />
```

#### Dolphin (Add-on)

<label>
  <input class="toggle" type="checkbox" value="dolphin" data-theme data-group="theme">
  Preview Dolphin
</label>

<!-- prettier-ignore -->
```html
<!-- Dolphin theme (add-on) -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/dolphin.min.css" />
```

#### Pure (Add-on)

<label>
  <input class="toggle" type="checkbox" value="pure" data-theme data-group="theme">
  Preview Pure
</label>

<!-- prettier-ignore -->
```html
<!-- Pure theme (add-on) -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/pure.min.css" />
```

#### Vue Theme (Add-on)

<label>
  <input class="toggle" type="checkbox" value="vue" data-theme data-group="theme">
  Preview Vue
</label>

<!-- prettier-ignore -->
```html
<!-- Vue Theme (add-on) -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/addons/vue.min.css" />
```

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

### Common

Below are the most commonly modified theme properties. [Advanced](#advanced) theme properties are also available for use but typically do not need to be modified.

**TBD**

<!-- TODO: Replace with include from CDN /src/themes/shared/_vars.css -->

### Advanced

Advanced theme properties are also available for use but typically do not need to be modified. Values derived from [common](#common) theme properties but can be set explicitly if preferred.

**TBD**

<!-- TODO: Replace with include from CDN /src/themes/shared/_vars-advanced.css -->

<script>
  (function() {
    const toggleElms = Docsify.dom.findAll('input:where([data-class], [data-theme])');
    const previewSheets = Docsify.dom.findAll('link[rel="stylesheet"][data-theme]');

    function handleChange(e) {
      const elm = e.target.closest('[data-class], [data-theme]')
      const value = elm.value
      const groupVal = elm.getAttribute('data-group');

      // Toggle class
      if (elm.matches('[data-class]')) {
        document.body.classList.toggle(value, elm.checked);
      }
      // Toggle sheet
      else {
        const themeSheet = previewSheets.find(sheet => sheet.getAttribute('data-theme') === value);

        themeSheet && (themeSheet.disabled = !elm.checked);
      }

      if (!elm.checked || !groupVal) {
        return;
      }

      // Group elements & values
      const groupElms = toggleElms
        .filter(elm => elm.getAttribute('data-group') === groupVal);
      const groupVals = groupElms
        .map(elm => elm.value);

      // Uncheck other group elements
      groupElms.forEach(groupElm => {
        if (groupElm !== elm) {
          groupElm.checked = false;
        }
      });

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
        const groupSheets = groupVals
          .map(val => previewSheets.find(sheet => sheet.getAttribute('data-theme') === val))
          .filter(sheet => sheet);

        (groupSheets || previewSheets).forEach(sheet => {
          sheet.disabled = !value || sheet.getAttribute('data-theme') !== value;
        });
      }
    };

    // Toggle active elms
    toggleElms.forEach(elm => {
      const value = elm.value;

      // Class toggle
      if (elm.matches('[data-class]')) {
        elm.checked = document.body.classList.contains(value);
      }
      // Sheet toggle
      else {
        const previewSheet = previewSheets.find(sheet => sheet.getAttribute('data-theme') === value);

        elm.checked = previewSheet && !previewSheet.disabled;
      }
    });

    toggleElms.forEach(elm => elm.addEventListener('change', handleChange));
  }());
</script>
