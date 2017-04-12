# 3.6.2/ 2017-04-12

  * feat(external-script): detect more than one script dom, fixed #146
  * GA: Send hash instead of complete href (#147)

# 3.6.1 / 2017-04-09

  * feat(event): Collapse the sidebar when click outside element in the small screen

# 3.6.0 / 2017-04-09

  * feat(render): add mergeNavbar option, close ([#125](https://github.com/QingWei-Li/docsify/issues/125)

# 3.5.2/ 2017-04-05

  * add optional current route param to toURL and use it to properly compose local anchor links
  * fix code style by removing semicolons
  * in toURL test for anchor links and if so prepend the currentPath to the generated path. fixes ([#142](https://github.com/QingWei-Li/docsify/issues/142))

# 3.5.1 / 2017-03-25

  * fix: .md file extension regex

# 3.5.0 / 2017-03-25

  * feat(route): auto remove .md extension
  * fix: adjust display on small screens [@jrappen](https://github.com/jrappen)
  * fix: navbar labels for German [@jrappen](https://github.com/jrappen)

# 3.4.4 / 2017-03-17

  * fix(search): fix input style
  * fix search plugin match bug

# 3.4.3 / 2017-03-16

  * Add ability to ignore headers when generating toc ([#127](https://github.com/QingWei-Li/docsify/issues/127) [@christopherwk210](https://github.com/christopherwk210))
  * fix external-script not inserting script at right place [@Leopoldthecoder](https://github.com/Leopoldthecoder)
  * add German docs [@jrappen](https://github.com/jrappen)

# 3.4.2 / 2017-03-11

* feat(emojify): add no-emoji option

# 3.4.1 / 2017-03-10

* fix(dom): Disable the dom cache when vue is present, fixed [#119](https://github.com/QingWei-Li/docsify/issues/119)
* update english docs, [@jrappen](https://github.com/jrappen)

# 3.4.0 / 2017-03-09

* feat(zoom-image): add plugin

# 3.3.0 / 2017-03-07

* add front-matter plugin
* add external-script plugin, [@Leopoldthecoder](https://github.com/Leopoldthecoder)
* Fix nav showing while loading ([#112](https://github.com/QingWei-Li/docsify/issues/112))

# 3.2.0 / 2017-02-28

* fix(render): Toc rendering error, fixed [#106](https://github.com/QingWei-Li/docsify/issues/106)
* feat(search): Localization for no data tip, close [#103](https://github.com/QingWei-Li/docsify/issues/103)
* fix(fetch): load sidebar and navbar for parent path, fixed [#100](https://github.com/QingWei-Li/docsify/issues/100)
* feat(render) nameLink for each route, fixed [#99](https://github.com/QingWei-Li/docsify/issues/99)

# 3.1.2 / 2017-02-27

* fix(search): dont search nameLink, fixed [#102](https://github.com/QingWei-Li/docsify/issues/102)

# 3.1.1 / 2017-02-24

* fix(search): dont search nameLink, fixed [#102](https://github.com/QingWei-Li/docsify/issues/102)
* fix(render): custom cover background image
* fix(tpl): extra character, fixed [#101](https://github.com/QingWei-Li/docsify/issues/101)

# 3.1.0 / 2017-02-22

* fix(search): incorrect anchor link, fixed [#90](https://github.com/QingWei-Li/docsify/issues/90)
* feat(emoji): add emoji plugin

# 3.0.5 / 2017-02-21

* feat(pwa): add sw.js
* fix(layout.css): loading style
* fix(event): highlight sidebar when clicked, fixed [#86](https://github.com/QingWei-Li/docsify/issues/86)
* fix(gen-tree): cache toc list, fixed [#88](https://github.com/QingWei-Li/docsify/issues/88)

# 3.0.4 / 2017-02-20

* fix(render): execute script
* fix(render): disable rendering sub list when loadSidebar is false

# 3.0.3 / 2017-02-19

* fixed look of links in blockquote
* fix(scroll) highlight bug

# 3.0.2 / 2017-02-19

* fix(search): add lazy input
* fix(compiler): link

# 3.0.1 / 2017-02-19

* fix(route): empty alias

# 3.0.0 / 2017-02-19

#### Breaking change

* Not support IE9
* The route becomes: `/#/page?id=slug`. The previous route will be redirected

#### Features

* Faster rendering
* Clearer source code
* More powerful API
* Auto header for each page [#78](https://github.com/QingWei-Li/docsify/issues/78)
* Localization for search plugin [#80](https://github.com/QingWei-Li/docsify/issues/80)
* Execute the script in markdown (see `executeScript`)
