# Themes

Docsify's theme system is designed to work with two types of themes:

- [**Core Themes:**](#core) A complete collection of CSS rules that style all Docsify site elements (cover, navbar, sidebar, markdown, etc.). A core theme is required to render a Docsify site. Core themes do not require other themes or add-ons.
- [**Theme Add-ons:**](#add-ons) A partial collection of CSS rules used to customize a core theme. Add-ons contain custom [theme properties](#theme-property) values and/or style declarations. Add-ons require the use of a core theme and can often (but not always) be used with other add-ons.

Separating the "core" styles required to render a Docsify site from the "add-on" styles typically associated with theming provides several important benefits. For site administrators, the ability to use the official "core" theme with multiple add-ons provides both stability and flexibility. For Docsify maintainers and community contributors, the separation of styles makes working on customizations faster, simpler, and easier to maintain.

?> Official themes are available on multiple [CDNs](cdn). Uncompressed themes are available by omitting `.min` from the filename.

## Core

The official Docsify core theme contains styles and default [theme property](#theme-properties) values needed to render a Docsify site. It can serve as a production-ready theme on its own or as a starting point for use with [add-ons](#add-ons) or [customization](#customization).

<!-- prettier-ignore -->
```html
<!-- Core Theme -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/core.min.css" />
```

<a href="#" class="button primary" data-theme="">Preview</a>

## Add-ons

### Sidebar Chevrons

Adds expand/collapse icons to page links in the sidebar.

#### Right

<!-- prettier-ignore -->
```html
<!-- Sidebar Chevrons Right (add-on) -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/addons/sidebar-chevrons-right.min.css" />
```

<a href="#" class="button primary" data-theme="sidebar-chevrons-right">Preview</a>

#### Left

<!-- prettier-ignore -->
```html
<!-- Sidebar Chevrons Left (add-on) -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/addons/sidebar-chevrons-left.min.css" />
```

<a href="#" class="button primary" data-theme="sidebar-chevrons-left">Preview</a>

### Vue (Add-on)

The popular Docsify v4 theme, now available as a theme add-on using Docsify [theme properties](#theme-properties).

<!-- prettier-ignore -->
```html
<!-- Vue Theme (add-on) -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/addons/vue.min.css" />
```

<a href="#" class="button primary" data-theme="vue">Preview</a>

<details>
  <summary><h3>Legacy themes (Add-on)</h3></summary>

!> The following legacy themes have been deprecated as of v5 and will be removed in the next major version of Docsify.

<!-- prettier-ignore -->
```html
<!-- Buble theme (add-on) -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/buble.min.css" />
```

<a href="#" class="button" data-theme="buble">Preview</a>

<!-- prettier-ignore -->
```html
<!-- Dark theme (add-on) -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/dark.min.css" />
```

<a href="#" class="button" data-theme="dark">Preview</a>

<!-- prettier-ignore -->
```html
<!-- Dolphin theme (add-on) -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/dolphin.min.css" />
```

<a href="#" class="button" data-theme="dolphin">Preview</a>

<!-- prettier-ignore -->
```html
<!-- Pure theme (add-on) -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/pure.min.css" />
```

<a href="#" class="button" data-theme="pure">Preview</a>

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
  (function() {
    const previewAttr = 'data-theme';
    const previewSelector = `a[${previewAttr}]`;
    const previewElms = Docsify.dom.findAll(previewSelector);
    const stylesheetElms = Docsify.dom.findAll('link[rel="stylesheet"][title]');

    previewElms.forEach(elm => {
      elm.onclick = (e) => {
        const title = e.target.closest(previewSelector).getAttribute(previewAttr);
        const newSheet = stylesheetElms.find(sheet => sheet.title === title);

        e.preventDefault();

        if (newSheet) {
          newSheet.disabled = false;
        }

        stylesheetElms.forEach(sheet => {
          sheet.disabled = !title || sheet.title !== title;
        });
      };
    });
  })();
</script>
