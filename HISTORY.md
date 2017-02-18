### 2.4.3

> 2017-02-15

#### Bug fixes
* fix emoji replacing error (#76)

### 2.4.2

> 2017-02-14

#### Bug fixes
- fix(index): load file path error


### 2.4.1

> 2017-02-13

#### Bug fixes
- fix(index): cover page

### 2.4.0

> 2017-02-13

#### Features

- feat(hook): add `doneEach`


### 2.3.0

> 2017-02-13

#### Features

- feat(src): add alias feature
- docs: update all documents
- feat(src): dynamic title
- feat(hook): support custom plugin
- feat(themes): add dark theme

#### Bug fixes
- fix(event): `auto2top` has no effect on a FF mobile browser, fixed #67
- fix: sidebar style
- fix(render): fix render link

### 2.2.1

> 2017-02-11

#### Bug fixes
- fix(search): crash when not content, fixed #68
- fix(event): scroll active sidebar
- fix(search): not work in mobile

### 2.2.0

#### Features
- Add `Google Analytics` plugin.
```html
<script src="//unpkg.com/docsify" data-ga="UA-XXXXX-Y"></script>
<script src="//unpkg.com/docsify/lib/plugins/ga.js"></script>
```

### 2.1.0
#### Features
- Add search plugin
```html
<script src="//unpkg.com/docsify"></script>
<script src="//unpkg.com/docsify/lib/plugins/search.js"></script>
```

#### Bug fixes
- fix sidebar style

### 2.0.3
#### Bug fixes
- fix: rendering emojis
- fix: css var polyfill

### 2.0.2

#### Bug fixes
- fix button style in cover page.

### 2.0.1
#### Bug fixes
- border style.

### 2.0.0
#### Features
- Customize the theme color

#### Break change
- Remove `data-router`, `data-sidebar`, `data-sidebar-toggle` APIs


### 1.10.5
#### Bug fixes
- fix initialize the Vue instance

### 1.10.4
#### Bug fixes
- fix execute script

### 1.10.3
#### Bug fixes
- compatible vuep QingWei-Li/vuep/issues/2
- fix sidebar scroll, fixed #63

### 1.10.2
#### Bug fixes
- Fix render emojis again

### 1.10.1
#### Bug fixes
- Fix render emojis

### 1.10.0
#### Features
- Support emoji :laughing:

### 1.9.0

#### Bug fixes
- Destroys the vue instance when the route is changed

#### Features
- Add `!>` and `?>` doc helper.

#### Break change
- Remove `!` doc helper.

### 1.8.0
#### Bug fixes
- Using `v-pre` skip compilation.

### Features
- Execute script when vue exists.

### 1.7.4
#### Bug fixes
- Fix bugs caused by the previous version

### 1.7.3
#### Bug fixes
- Add `hr` style
- Fixed option is an empty string

### 1.7.2
#### Bug fixes
- Fix sidebar click event in mobile browser.

### 1.7.1
#### Bug fixes
- Fix sidebar style in mobile browser.

### 1.7.0

#### Bug fixes
- Fixed custom cover background, fixed #52
- Fixed sticky sidebar

### Features
- Add `name` and `nameLink`

### 1.6.1
#### Bug fixes
- Fixed sidebar bug when the coverpage exist

### 1.6.0
#### Features
- Improve sidebar performance. The active item is automatically scrolled in the visible view.
- New doc helper: `! `. e.g. `! content` will be rendered as `<p class="tip">content</p>`

### 1.5.2
#### Bug fixes
- Fixed number at the beginning of the slug

### 1.5.1
#### Bug fixes
- Remove HTML tag when handling slug

### 1.5.0

#### Bug fixes
- Fix slugify.
- Fix nav highlight.

#### Features
- Initialize the configuration by `window.$docsify`.
- Markdown parser is configurable.

### 1.4.3
#### Bug fixes
- Tweak style.

### 1.4.2

#### Bug fixes
- Fix toggle button style.
- Support `mailto`, `tel`, etc. href type
- Fix scroll to top.


### 1.4.1
#### Bug fixes
- Fix generate slug.

### 1.4.0 Happly new year 🎉
#### Features
- Display TOC in the custom sidebar, `data-sub-max-level`.
- Custom background in coverpage.

#### Bug fixes
- Fix scroll highlight when Vue exist.

### 1.3.5
#### Bug fixes
- Fix vue

### 1.3.4
#### Bug fixes

- Supports [vuep](https://github.com/QingWei-Li/vuep)

### 1.3.3
#### Bug fixes
- Fixed cover rendering timing

### 1.3.2

#### Bug fixes
- Fixed render link

### 1.3.1

#### Bug fixes
- Fixed cover page style
- Generate the correct link when rendering the article

### 1.3.0
#### Features
- Add cover page
- add `<kbd>` style
- headling can be cliked

#### Bug fixes
- sidebar highlight


#### break change
- Navbar no longer fixed at the top

### 1.2.0
#### Features
- custom basePath
- custom homepage

### 1.1.7
#### Bug fixes
- Optimize progress bar

### 1.1.6
#### Features
- Add logo 😂

#### Bug fixes
- Remove table background color
- Fixed highlight sidebar using chinese ids

### 1.1.5
#### Features
- Add table style

#### Bug fixes
- Not fixed position of hte navbar in the mobile browser
- Correct calculation of whether the mobile browser

### 1.1.4
#### Bug fixes
- Fixed chinese auchor link

### 1.1.3
#### Bug fixes
- Optimize progress bar again

### 1.1.2
#### Bug fixes
- fix failed `auto2top` in mobile


### 1.1.1
#### Bug fixes
- Optimize progress bar

### 1.1.0
#### Features
- Add progress bar
- Add `auto2top` option for hash router

### 1.0.3
#### Bug fixes
- Fix cache

### 1.0.2
#### Bug fixes
- Fix binding events bug, fixed #24
- Fix regular expression, fixed #23

### 1.0.1
#### Bug fixes
- `img` style

### 1.0.0
#### Features
- Support hash router

#### Bug fixes
- Improved scrolling on mobile

### 0.7.0
#### Breaking change
- `themes/` was removed, only exists in the npm package.

#### Bug fixes
- Fix style.
- Fix sidebar animation again.

### 0.6.1
#### Bug fixes
- In the mobile, it should collapse the sidebar when toggle is clicked.
- Fix the dropdown list style.
- Fix sidebar animation.

### 0.6.0
#### Features
- Navbar support dropdown list, #6
- Sidebar with toggle

#### Bug fixes
- Fix ineffective option, fixed #10

### 0.5.0
#### Features
- Custom sidebars and navbars by markdown file

### 0.4.2
#### Bug fixes
- Correct catch ajax error

### 0.4.1
#### Bug fixes
- catch ajax error

### 0.4.0
#### Features
- Custom sidebar

#### Bug fixes
- Fix undefined language

### 0.3.1
#### Bug fixes
- Strip HTML tag when rendering the headings

### 0.3.0
#### Features
- Add minified css files
- Add max level option
- Add pure.css

### 0.2.1
#### Bug fixes
- Fix vue.css

### 0.2.0
#### Bug fixes
- Fix route
- Remove dynamic title

### 0.1.0
#### Features
- Add buble.css