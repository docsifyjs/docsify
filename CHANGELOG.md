# Changelog

4.1.14 / 2017-06-24

  * feat: add context attribute, fixed #191
  * fix: get file path
  * Merge pull request #195 from crawt/master
  * Filter picture
  * Update doc for external link target (#194)

4.1.13 / 2017-06-11

  * fix ga

4.1.12 / 2017-06-03

  * fix(render): ubtitle in side bar shows undefined, fixed [#182](https://github.com/QingWei-Li/docsify/issues/182)

4.1.11 / 2017-06-02

  * fix(render): autoHeader does not work
  * fix(compiler): force reset toc when rendering sidebar fixed [#181](https://github.com/QingWei-Li/docsify/issues/181)

4.1.10 / 2017-06-02

  * fix(hash): hash routing crashes when url has querystring

4.1.9 / 2017-05-31

  * fix(lifecycle): continue to handle data
  * fix: can't render toc on first load, fixed [#171](https://github.com/QingWei-Li/docsify/issues/171)
  * fix(render): broken name link, fixed [#167](https://github.com/QingWei-Li/docsify/issues/167)

## 4.1.8(since 4.1.1) / 2017-05-31

  * fix(pure-css):add coverpage style, fixed [#165](https://github.com/QingWei-Li/docsify/issues/165)
  * feat: add edit button demo, close [#162](https://github.com/QingWei-Li/docsify/issues/162)
  * fix some ssr bugs

## 4.1.0 / 2017-05-30 🎂 to me


  * feat: Support server client renderer [See detail](//docsify.js.org/#/ssr)
  * feat: Support HTML5 history API. `$docsify.routerMode = 'history'`
  * Breaking change: Clean global API

## 3.7.3 / 2017-05-22

  * fix(render): find => filter, Compatible with old browser
  * Pretty dir tree

## 3.7.2 / 2017-05-19

  * tweaks

## 3.7.1 / 2017-05-19

  * fix: docsify-updated is undefined

## 3.7.0 / 2017-05-16

  * feat: add externalLinkTarget, close ([#149](https://github.com/QingWei-Li/docsify/issues/149)
  * feat: add **{docsify-updated<span>}</span>**, close ([#158](https://github.com/QingWei-Li/docsify/issues/158)

## 3.6.6 / 2017-05-06

  * feat: support query string for the search, likes `https://docsify.js.org/#/?s=navbar`, fixed ([#156](https://github.com/QingWei-Li/docsify/issues/156)

## 3.6.5 / 2017-04-28

  * fix(util): fix crash, fixed ([#154](https://github.com/QingWei-Li/docsify/issues/154)

## 3.6.4 / 2017-04-28

  * fix(util): correctly clean up duplicate slashes, fixed ([#153](https://github.com/QingWei-Li/docsify/issues/153)

## 3.6.3 / 2017-04-25

  * fix(external-script): script attrs

## 3.6.2/ 2017-04-12

  * feat(external-script): detect more than one script dom, fixed ([#146](https://github.com/QingWei-Li/docsify/issues/146)
  * GA: Send hash instead of complete href ([#147](https://github.com/QingWei-Li/docsify/issues/147)

## 3.6.1 / 2017-04-09

  * feat(event): Collapse the sidebar when click outside element in the small screen

## 3.6.0 / 2017-04-09

  * feat(render): add mergeNavbar option, close ([#125](https://github.com/QingWei-Li/docsify/issues/125)

## 3.5.2/ 2017-04-05

  * add optional current route param to toURL and use it to properly compose local anchor links
  * fix code style by removing semicolons
  * in toURL test for anchor links and if so prepend the currentPath to the generated path. fixes ([#142](https://github.com/QingWei-Li/docsify/issues/142))

## 3.5.1 / 2017-03-25

  * fix: .md file extension regex

## 3.5.0 / 2017-03-25

  * feat(route): auto remove .md extension
  * fix: adjust display on small screens [@jrappen](https://github.com/jrappen)
  * fix: navbar labels for German [@jrappen](https://github.com/jrappen)

## 3.4.4 / 2017-03-17

  * fix(search): fix input style
  * fix search plugin match bug

## 3.4.3 / 2017-03-16

  * Add ability to ignore headers when generating toc ([#127](https://github.com/QingWei-Li/docsify/issues/127) [@christopherwk210](https://github.com/christopherwk210))
  * fix external-script not inserting script at right place [@Leopoldthecoder](https://github.com/Leopoldthecoder)
  * add German docs [@jrappen](https://github.com/jrappen)

## 3.4.2 / 2017-03-11

* feat(emojify): add no-emoji option

## 3.4.1 / 2017-03-10

* fix(dom): Disable the dom cache when vue is present, fixed [#119](https://github.com/QingWei-Li/docsify/issues/119)
* update english docs, [@jrappen](https://github.com/jrappen)

## 3.4.0 / 2017-03-09

* feat(zoom-image): add plugin

## 3.3.0 / 2017-03-07

* add front-matter plugin
* add external-script plugin, [@Leopoldthecoder](https://github.com/Leopoldthecoder)
* Fix nav showing while loading ([#112](https://github.com/QingWei-Li/docsify/issues/112))

## 3.2.0 / 2017-02-28

* fix(render): Toc rendering error, fixed [#106](https://github.com/QingWei-Li/docsify/issues/106)
* feat(search): Localization for no data tip, close [#103](https://github.com/QingWei-Li/docsify/issues/103)
* fix(fetch): load sidebar and navbar for parent path, fixed [#100](https://github.com/QingWei-Li/docsify/issues/100)
* feat(render) nameLink for each route, fixed [#99](https://github.com/QingWei-Li/docsify/issues/99)

## 3.1.2 / 2017-02-27

* fix(search): dont search nameLink, fixed [#102](https://github.com/QingWei-Li/docsify/issues/102)

## 3.1.1 / 2017-02-24

* fix(search): dont search nameLink, fixed [#102](https://github.com/QingWei-Li/docsify/issues/102)
* fix(render): custom cover background image
* fix(tpl): extra character, fixed [#101](https://github.com/QingWei-Li/docsify/issues/101)

## 3.1.0 / 2017-02-22

* fix(search): incorrect anchor link, fixed [#90](https://github.com/QingWei-Li/docsify/issues/90)
* feat(emoji): add emoji plugin

## 3.0.5 / 2017-02-21

* feat(pwa): add sw.js
* fix(layout.css): loading style
* fix(event): highlight sidebar when clicked, fixed [#86](https://github.com/QingWei-Li/docsify/issues/86)
* fix(gen-tree): cache toc list, fixed [#88](https://github.com/QingWei-Li/docsify/issues/88)

## 3.0.4 / 2017-02-20

* fix(render): execute script
* fix(render): disable rendering sub list when loadSidebar is false

## 3.0.3 / 2017-02-19

* fixed look of links in blockquote
* fix(scroll) highlight bug

## 3.0.2 / 2017-02-19

* fix(search): add lazy input
* fix(compiler): link

## 3.0.1 / 2017-02-19

* fix(route): empty alias

## 3.0.0 / 2017-02-19

##### Breaking change

* Not support IE9
* The route becomes: `/#/page?id=slug`. The previous route will be redirected

##### Features

* Faster rendering
* Clearer source code
* More powerful API
* Auto header for each page [#78](https://github.com/QingWei-Li/docsify/issues/78)
* Localization for search plugin [#80](https://github.com/QingWei-Li/docsify/issues/80)
* Execute the script in markdown (see `executeScript`)
