module.exports = ctx => ({
  map: ctx.options.map,
  plugins: {
    'postcss-import': {},
    'postcss-nesting': {
      edition: '2024-02',
    },
    cssnano: ctx.env === 'production' ? { preset: 'default' } : false,
  },
});
