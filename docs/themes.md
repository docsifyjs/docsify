# Themes

## Official

Docsify offers several official themes. Click a theme name below to preview theme styles.

- <a href="#" data-theme="core">Core</a> - Core styles only. Ready for [customization](#customization) via [theme properties](#theme-properties).
- <a href="#" data-theme="vue">Vue</a> - Popular Docsify v4 theme. Updated for Docsify v5.

Official themes are available on multiple [CDNs](cdn). Uncompressed themes are available by omitting `.min` from the filename.

<!-- prettier-ignore -->
```html
<!-- Core -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/core.min.css" />
```

<!-- prettier-ignore -->
```html
<!-- Vue -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/vue.min.css" />
```

<details>
  <summary>Legacy Themes</summary>

The following legacy themes have been updated for use with v5, however they are now considered deprecated and will be removed in the next major version of Docisfy (v6).

- <a href="#" data-theme="buble">Buble</a>
- <a href="#" data-theme="dark">Dark</a>
- <a href="#" data-theme="dolphin">Dolphin</a>
- <a href="#" data-theme="pure">Pure</a>

<!-- prettier-ignore -->
```html
<!-- Buble -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/buble.min.css" />
```

<!-- prettier-ignore -->
```html
<!-- Dark -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/dark.min.css" />
```

<!-- prettier-ignore -->
```html
<!-- Dolphin -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/dolphin.min.css" />
```

<!-- prettier-ignore -->
```html
<!-- Pure -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/pure.min.css" />
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
     --color-primary: red;
     --font-size    : 15px;
     --line-height  : 1.5;
   }
   ```

   Custom [theme properties](#theme-properties) can be conditionally applied in light and/or dark mode.

   <!-- prettier-ignore -->
   ```css
   /* Light and dark mode */
   :root {
     --color-primary: pink;
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

   !> **Theme authors**: Provide instructions to users for loading your recommended web fonts manually instead of including them using `@import` in your theme CSS. This allows users who prefer a different font to avoid loading your recommended web font(s) unnecessarily.

4. Advanced styling may require custom CSS declarations. This is expected, however custom CSS declarations may break when new versions of Docsify are released. When possible, leverage [theme properties](#theme-properties) instead of custom declarations or lock your [CDN](cdn) URLs to a [specific version](cdn#specific-version) to avoid potential issues.

   ```css
   .sidebar li.active > a {
     border-right: 3px solid var(--color-primary);
   }
   ```

## Theme Properties

The following properties are available in all official Docsify themes. Default values are shown and available in the [official](#official) "Core" theme.

?> **Theme and plugin authors**: We encourage you to leverage these custom theme properties and to offer similar customization options in your projects.

<!-- TODO: Replace with include from CDN /src/themes/shared/_vars.css -->

```css
/* Variables */
/* ========================================================================== */
/* prettier-ignore */
:root {
  /* Base */
  --border-radius    : 3px; /* Single value */
  --color-bg         : #fff;
  --color-primary    : var(--theme-color, #0071e3);
  --color-text       : #444;
  --color-mono-0     : color-mix(in srgb, var(--color-text) 4%, var(--color-bg));
  --color-mono-1     : color-mix(in srgb, var(--color-text) 10%, var(--color-bg));
  --color-mono-2     : color-mix(in srgb, var(--color-text) 20%, var(--color-bg));
  --color-mono-3     : color-mix(in srgb, var(--color-text) 30%, var(--color-bg));
  --color-mono-4     : color-mix(in srgb, var(--color-text) 40%, var(--color-bg));
  --color-mono-5     : color-mix(in srgb, var(--color-text) 50%, var(--color-bg));
  --color-mono-6     : color-mix(in srgb, var(--color-text) 60%, var(--color-bg));
  --color-mono-7     : color-mix(in srgb, var(--color-text) 70%, var(--color-bg));
  --color-mono-8     : color-mix(in srgb, var(--color-text) 80%, var(--color-bg));
  --color-mono-9     : color-mix(in srgb, var(--color-text) 90%, var(--color-bg));
  --font-family      : system-ui, sans-serif;
  --font-family-emoji: 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  --font-family-mono : ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace;
  --font-size        : 16px;
  --font-size-xxxl   : calc(var(--font-size-xxl) * var(--modular-scale));
  --font-size-xxl    : calc(var(--font-size-xl) * var(--modular-scale));
  --font-size-xl     : calc(var(--font-size-l) * var(--modular-scale));
  --font-size-l      : calc(1rem * var(--modular-scale));
  --font-size-m      : var(--font-size);
  --font-size-s      : max(13px, calc(var(--font-size-m) / var(--modular-scale)));
  --font-size-xs     : max(11px, calc(var(--font-size-s) / var(--modular-scale)));
  --font-size-emoji  : 1.2em;
  --font-size-mono   : 0.9375em;
  --font-weight      : 400;
  --font-weight-mono : 400;
  --line-height      : 1.6;
  --margin-block     : 1em;
  --max-width        : 72ch; /* 725px / 98 characters */
  --modular-scale    : 1.250; /* 1.067, 1.125, 1.200, 1.250, 1.333, 1.414, 1.500, 1.618 */

  /* Cover */
  --cover-bg         : ;
  --cover-bg-overlay : ;
  --cover-color      : ;
  --cover-title-color: ;
  --cover-title-font : 300 var(--font-size-xxxl) var(--font-family);

  /* Elements */
  --blockquote-bg                 : ;
  --blockquote-border-color       : var(--color-primary);
  --blockquote-border-radius      : 0;
  --blockquote-border-width       : 0 0 0 4px;
  --blockquote-padding            : 0 0 0 1.5em;
  --blockquote-text               : var(--color-mono-6);
  --button-bg                     : var(--color-primary);
  --button-border-radius          : 100vh;
  --button-color                  : #fff;
  --button-padding                : 0.3em 1.25em 0.315em 1.25em;
  --code-bg                       : var(--color-mono-0);
  --code-color                    : ;
  --codeblock-bg                  : var(--color-mono-0);
  --codeblock-color               : ;
  --form-element-bg               : ;
  --form-element-border           : 1px solid var(--color-mono-2);
  --form-element-border-radius    : var(--border-radius);
  --form-element-color            : ;
  --h1-font-size                  : var(--font-size-xxxl);
  --h1-font-weight                : var(--heading-font-weight);
  --h2-font-size                  : var(--font-size-xxl);
  --h2-font-weight                : var(--heading-font-weight);
  --h3-font-size                  : var(--font-size-xl);
  --h3-font-weight                : var(--heading-font-weight);
  --h4-font-size                  : var(--font-size-l);
  --h4-font-weight                : var(--heading-font-weight);
  --h5-font-size                  : var(--font-size-m);
  --h5-font-weight                : var(--heading-font-weight);
  --h6-font-size                  : var(--font-size-s);
  --h6-font-weight                : var(--heading-font-weight);
  --heading-color                 : inherit;
  --heading-font-weight           : 600;
  --kbd-bg                        : var(--color-mono-0);
  --kbd-border-radius             : 4px;
  --kbd-box-shadow                : 0 2px 0 1px var(--color-mono-2);
  --kbd-color-text                : ;
  --kbd-font-size                 : var(--font-size-m);
  --link-text-decoration-thickness: 2px;
  --name-color                    : ;
  --name-font-family              : var(--font-family);
  --name-font-size                : var(--font-size-xl);
  --name-font-weight              : 400;
  --strong-color                  : #2c3e50;
  --strong-font-weight            : 600;
  --table-row-alt-bg              : #f8f8f8;

  /* Callouts */
  --callout-border-radius      : 0 var(--border-radius) var(--border-radius) 0;
  --callout-border-width       : 0 0 0 4px;
  --callout-charm-border-radius: 100vh;
  --callout-charm-font-size    : 1.2em;
  --callout-charm-inset        : 50% auto auto -2px;
  --callout-charm-size         : 1.3em;
  --callout-charm-translate    : -50% -50%;
  --callout-padding            : 1em 1em 1em var(--callout-charm-size);
  --important-bg               : var(--color-mono-0);
  --important-border-color     : #f66;
  --important-charm-bg         : var(--important-border-color);
  --important-charm-color      : #fff;
  --important-charm-content    : '!';
  --important-color            : ;
  --tip-bg                     : color-mix(in srgb, var(--color-primary), transparent 90%);
  --tip-border-color           : var(--color-primary);
  --tip-charm-bg               : var(--tip-border-color);
  --tip-charm-color            : #fff;
  --tip-charm-content          : 'i';
  --tip-color                  : ;

  /* Navbar */
  --navbar-font-size        : var(--font-size);
  --navbar-height           : 60px;
  --navbar-link-color       : ;
  --navbar-link-color-active: var(--color-primary);
  --navbar-link-line-height : 2.5;

  /* Sidebar */
  --sidebar-bg               : var(--color-bg);
  --sidebar-color            : #364149;
  --sidebar-font-size        : var(--font-size);
  --sidebar-link-color       : var(--color-text);
  --sidebar-link-color-active: var(--color-primary);
  --sidebar-link-line-height : 2.25;
  --sidebar-width            : 280px;
}
```

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
