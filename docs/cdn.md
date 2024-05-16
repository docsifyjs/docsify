# CDN

The docsify [npm package](https://www.npmjs.com/package/docsify) is auto-published to CDNs with each release. The contents can be viewed on each CDN.

Docsify recommends [jsDelivr](//cdn.jsdelivr.net) as its preferred CDN:

- https://cdn.jsdelivr.net/npm/docsify/

Other CDNs are available and may be required in locations where jsDelivr is not available:

- https://cdnjs.com/libraries/docsify
- https://unpkg.com/browse/docsify/
- https://www.bootcdn.cn/docsify/

## Specifying versions

Note the `@` version lock in the CDN URLs below. This allows specifying the latest major, minor, patch, or specific [semver](https://semver.org) version number.

- MAJOR versions include breaking changes<br>
  `1.0.0` → `2.0.0`
- MINOR versions include non-breaking new functionality<br>
  `1.0.0` → `1.1.0`
- PATCH versions include non-breaking bug fixes<br>
  `1.0.0` → `1.0.1`

Uncompressed resources are available by omitting the `.min` from the filename.

## Latest "major" version

Specifying the latest major version allows your site to receive all non-breaking enhancements ("minor" updates) and bug fixes ("patch" updates) as they are released. This is good option for those who prefer a zero-maintenance way of keeping their site up to date with minimal risk as new versions are published.

?> When a new major version is released, you will need to manually update the major version number after the `@` symbol in your CDN URLs.

<!-- prettier-ignore -->
```html
<!-- Theme -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5/themes/vue.min.css" />

<!-- Docsify -->
<script src="//cdn.jsdelivr.net/npm/docsify@5/dist/docsify.min.js"></script>
```

## Specific version

Specifying an exact version prevents any future updates from affecting your site. This is good option for those who prefer to manually update their resources as new versions are published.

?> When a new version is released, you will need to manually update the version number after the `@` symbol in your CDN URLs.

<!-- prettier-ignore -->
```html
<!-- Theme -->
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@5.0.0/themes/vue.min.css" />

<!-- Docsify -->
<script src="//cdn.jsdelivr.net/npm/docsify@5.0.0/dist/docsify.min.js"></script>
```
