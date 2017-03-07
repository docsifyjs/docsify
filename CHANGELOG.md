
3.3.0 / 2017-03-07
==================

  * add front-matter plugin
  * add external-script plugin
  * Fix nav showing while loading (#112)
  * Fix a typo (#111)
  * Update changelog

3.2.0 / 2017-02-28
==================

  * fix(render): Toc rendering error, fixed [#106](https://github.com/QingWei-Li/docsify/issues/106)
  * feat(search): Localization for no data tip, close [#103](https://github.com/QingWei-Li/docsify/issues/103)
  * fix(fetch): load sidebar and navbar for parent path, fixed [#100](https://github.com/QingWei-Li/docsify/issues/100)
  * feat(render) nameLink for each route, fixed [#99](https://github.com/QingWei-Li/docsify/issues/99)

3.1.2 / 2017-02-27
==================

  * fix(search): dont search nameLink, fixed [#102](https://github.com/QingWei-Li/docsify/issues/102)

3.1.1 / 2017-02-24
==================

  * fix(search): dont search nameLink, fixed [#102](https://github.com/QingWei-Li/docsify/issues/102)
  * fix(render): custom cover background image
  * fix(tpl): extra character, fixed [#101](https://github.com/QingWei-Li/docsify/issues/101)

3.1.0 / 2017-02-22
==================

  * fix(search): incorrect anchor link, fixed [#90](https://github.com/QingWei-Li/docsify/issues/90)
  * feat(emoji): add emoji plugin

3.0.5 / 2017-02-21
==================

  * feat(pwa): add sw.js
  * fix(layout.css): loading style
  * fix(event): highlight sidebar when clicked, fixed [#86](https://github.com/QingWei-Li/docsify/issues/86)
  * fix(gen-tree): cache toc list, fixed [#88](https://github.com/QingWei-Li/docsify/issues/88)

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
