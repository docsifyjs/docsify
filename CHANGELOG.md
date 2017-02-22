
3.1.0 / 2017-02-22
==================

  * fix(search): incorrect anchor link, fixed #90
  * feat(emoji): add emoji plugin

3.0.5 / 2017-02-21
==================

  * feat(pwa): add sw.js
  * fix(layout.css): loading style
  * fix(event): highlight sidebar when clicked, fixed #86
  * fix(gen-tree): cache toc list, fixed #88

3.0.4 / 2017-02-20
==================

  * fix(render): execute script
  * fix(render): disable rendering sub list when loadSidebar is false

3.0.3 / 2017-02-19
==================

  * fixed look of links in blockquote
  * fix(scroll) highlight bug

3.0.2 / 2017-02-19
==================

  * fix(search): add lazy input
  * fix(compiler): link

3.0.1 / 2017-02-19
==================

  * fix(route): empty alias

3.0.0 / 2017-02-19
==================

#### Breaking change
- Not support IE9
- The route becomes: `/#/page?id=slug`. The previous route will be redirected

#### Features
- Faster rendering
- Clearer source code
- More powerful API
- Auto header for each page [#78](https://github.com/QingWei-Li/docsify/issues/78)
- Localization for search plugin [#80](https://github.com/QingWei-Li/docsify/issues/80)
- Execute the script in markdown (see `executeScript`)
