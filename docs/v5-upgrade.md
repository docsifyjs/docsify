# Upgrading v4 to v5

The main changes when upgrading a Docsify v4 site to v5 involve updating CDN URLs and theme files. Your configuration settings remain mostly the same, so the upgrade is fairly straightforward.

## Before You Begin

Some older Docsify sites may use non-version-locked URLs like:

```html
<script src="//cdn.jsdelivr.net/npm/docsify/lib/docsify.min.js"></script>
```

If your site uses URLs without `@4` or a specific version number, follow the same steps below. You'll need to update both the version specifier and the path structure.

## Step-by-Step Instructions

### 1. Update the Theme CSS

**Replace the theme (v4):**

```html
<link
  rel="stylesheet"
  href="//cdn.jsdelivr.net/npm/docsify@4/lib/themes/vue.css"
/>
<!-- OR if you have non-versioned URL: -->
<link
  rel="stylesheet"
  href="//cdn.jsdelivr.net/npm/docsify/lib/themes/vue.css"
/>
```

**With this (v5):**

```html
<!-- Core Theme -->
<link
  rel="stylesheet"
  href="//cdn.jsdelivr.net/npm/docsify@5/dist/themes/core.min.css"
/>
<!-- Optional: Dark Mode Support -->
<link
  rel="stylesheet"
  href="//cdn.jsdelivr.net/npm/docsify@5/dist/themes/addons/core-dark.min.css"
  media="(prefers-color-scheme: dark)"
/>
```

**Note:** If you were using a different v4 theme (buble, dark, pure), the v5 core theme replaces these, though Vue and Dark themes are available as add-ons if preferred.

View [Themes](themes.md) for more details.

### 2. Add Optional Body Class (for styling)

**Update your opening body tag:**

```html
<body class="sidebar-chevron-right"></body>
```

This adds a chevron indicator to the sidebar. You can omit this if you prefer.

View [Theme Classes](themes.md?id=classes) for more details.

### 3. Update the Main Docsify Script

**Change:**

```html
<script src="https://cdn.jsdelivr.net/npm/docsify@4/lib/docsify.min.js"></script>
<!-- OR if you have non-versioned URL: -->
<script src="//cdn.jsdelivr.net/npm/docsify/lib/docsify.min.js"></script>
```

**To:**

```html
<script src="https://cdn.jsdelivr.net/npm/docsify@5/dist/docsify.min.js"></script>
```

### 4. Update Plugin URLs

**Search Plugin:**

```html
<!-- v4 -->
<script src="https://cdn.jsdelivr.net/npm/docsify@4/lib/plugins/search.js"></script>
<!-- OR non-versioned: -->
<script src="//cdn.jsdelivr.net/npm/docsify/lib/plugins/search.js"></script>

<!-- v5 -->
<script src="https://cdn.jsdelivr.net/npm/docsify@5/dist/plugins/search.min.js"></script>
```

**Zoom Plugin:**

```html
<!-- v4 -->
<script src="https://cdn.jsdelivr.net/npm/docsify@4/lib/plugins/zoom-image.min.js"></script>
<!-- OR non-versioned: -->
<script src="//cdn.jsdelivr.net/npm/docsify/lib/plugins/zoom-image.min.js"></script>

<!-- v5 -->
<script src="https://cdn.jsdelivr.net/npm/docsify@5/dist/plugins/zoom.min.js"></script>
```

**Note:** If you're using additional Docsify plugins (such as emoji, external-script, front-matter, etc.), you'll need to update those URLs as well following the same pattern:

- Change `/lib/plugins/` to `/dist/plugins/`
- Update version from `@4` (or non-versioned) to `@5`
- Example: `//cdn.jsdelivr.net/npm/docsify/lib/plugins/emoji.min.js` becomes `https://cdn.jsdelivr.net/npm/docsify@5/dist/plugins/emoji.min.js`

## Key Differences Summary

- **CDN Path**: Changed from `/lib/` to `/dist/`
- **Version**: Updated from `@4` to `@5`
- **Themes**: v5 uses a core theme (with optional add-ons available)
- **Plugin Names**: `zoom-image` → `zoom`

## Additional Notes

- Your configuration in `window.$docsify` stays the same
- All your markdown content remains unchanged
- The upgrade is non-breaking for most sites (however, legacy browsers like Internet Explorer 11 are no longer supported)
- Custom CSS targeting v4 theme-specific classes or elements may need to be updated for v5
- The v5 core theme can be customized using CSS variables - view [Theme Customization](themes.md?id=customization) for more details

That's it! Your Docsify site should now be running on v5.
