/**
 * PostCSS plugin to replace color-mix() with pre-computed values
 * This plugin handles the specific color-mix usage in docsify
 */

// Pre-computed color values based on the default theme
const colorReplacements = {
  // Monochrome scale: mix of #fff and #333
  'color-mix(in srgb, var(--color-mono-min), var(--color-mono-max) 5%)':
    '#f5f5f5',
  'color-mix(in srgb, var(--color-mono-min), var(--color-mono-max) 10%)':
    '#ebebeb',
  'color-mix(in srgb, var(--color-mono-min), var(--color-mono-max) 20%)':
    '#d6d6d6',
  'color-mix(in srgb, var(--color-mono-min), var(--color-mono-max) 32%)':
    '#bebebe',
  'color-mix(in srgb, var(--color-mono-max), var(--color-mono-min) 50%)':
    '#999999',
  'color-mix(in srgb, var(--color-mono-max), var(--color-mono-min) 32%)':
    '#747474',
  'color-mix(in srgb, var(--color-mono-max), var(--color-mono-min) 20%)':
    '#5c5c5c',
  'color-mix(in srgb, var(--color-mono-max), var(--color-mono-min) 10%)':
    '#474747',
  'color-mix(in srgb, var(--color-mono-max), var(--color-mono-min) 5%)':
    '#3d3d3d',

  // Theme color tints: mix of #0b85d7 with white (#fff)
  'color-mix(in srgb, var(--theme-color), var(--color-mono-min) 90%)':
    '#e7f3fb',
  'color-mix(in srgb, var(--theme-color), var(--color-mono-min) 75%)':
    '#c2e1f5',
  'color-mix(in srgb, var(--theme-color), var(--color-mono-min) 55%)':
    '#91c8ed',
  'color-mix(in srgb, var(--theme-color), var(--color-mono-min) 30%)':
    '#54aae3',

  // Theme color shades: mix of #0b85d7 with dark gray (#333)
  'color-mix(in srgb, var(--theme-color), var(--color-mono-max) 30%)':
    '#176ca6',
  'color-mix(in srgb, var(--theme-color), var(--color-mono-max) 55%)':
    '#21587d',
  'color-mix(in srgb, var(--theme-color), var(--color-mono-max) 75%)':
    '#29485c',
  'color-mix(in srgb, var(--theme-color), var(--color-mono-max) 90%)':
    '#2f3b43',

  // Strong colors
  'color-mix(in srgb, var(--color-text), black 35%)': '#212121',
  'color-mix(in srgb, var(--color-text), white 35%)': '#e9e9e9',

  // Sidebar toggle with transparency: 10% theme color with 90% transparent
  'color-mix( in srgb, var(--sidebar-toggle-bg-hover) 10%, transparent )':
    'rgba(11, 133, 215, 0.1)',
};

// Normalize whitespace in color-mix functions for matching
function normalizeColorMix(str) {
  return str.replace(/\s+/g, ' ').trim();
}

module.exports = () => {
  return {
    postcssPlugin: 'postcss-replace-color-mix',
    Declaration(decl) {
      const value = decl.value;

      // Check if the value contains color-mix
      if (value.includes('color-mix')) {
        const normalized = normalizeColorMix(value);

        // Replace with pre-computed value if found
        if (colorReplacements[normalized]) {
          decl.value = colorReplacements[normalized];
        }
      }
    },
  };
};

module.exports.postcss = true;
