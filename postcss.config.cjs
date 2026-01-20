module.exports = ctx => ({
  map: ctx.options.map,
  plugins: {
    'postcss-import': {},
    'postcss-nesting': {
      edition: '2024-02',
    },
    './build/postcss-replace-color-mix.cjs': {},
    cssnano: ctx.env === 'production' ? { preset: 'default' } : false,
  },
});
