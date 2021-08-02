# Doc helper

docsify extends Markdown syntax to make your documents more readable.

> Note: For the special code syntax cases, it's better to put them within code backticks to avoid any conflict from configurations or emojis.

## Important content

Important content like:

```markdown
!> **Time** is money, my friend!
```

is rendered as:

!> **Time** is money, my friend!

## General tips

General tips like:

```markdown
?> _TODO_ unit test
```

are rendered as:

?> _TODO_ unit test

## Ignore to compile link

Sometimes we will use some other relative path for the link, and we have to tell docsify that we don't need to compile this link. For example:

```md
[link](/demo/)
```

It will be compiled to `<a href="/#/demo/">link</a>` and will load `/demo/README.md`. Maybe you want to jump to `/demo/index.html`.

Now you can do that

```md
[link](/demo/ ':ignore')
```

You will get `<a href="/demo/">link</a>`html. Do not worry, you can still set the title for the link.

```md
[link](/demo/ ':ignore title')

<a href="/demo/" title="title">link</a>
```

## Set target attribute for link

```md
[link](/demo ':target=_blank')
[link](/demo2 ':target=_self')
```

## Disable link

```md
[link](/demo ':disabled')
```

## Cross-Origin link

Only when you set both the `routerMode: 'history'` and `externalLinkTarget: '_self'`, you need to add this configuration for those Cross-Origin links.

```md
[example.com](https://example.com/ ':crossorgin')
```

## GitHub Task Lists

```md
- [ ] foo
- bar
- [x] baz
- [] bam <~ not working
  - [ ] bim
  - [ ] lim
```

- [ ] foo
- bar
- [x] baz
- [] bam <~ not working
  - [ ] bim
  - [ ] lim

## Image

### Resizing

```md
![logo](https://docsify.js.org/_media/icon.svg ':size=WIDTHxHEIGHT')
![logo](https://docsify.js.org/_media/icon.svg ':size=50x100')
![logo](https://docsify.js.org/_media/icon.svg ':size=100')

<!-- Support percentage -->

![logo](https://docsify.js.org/_media/icon.svg ':size=10%')
```

![logo](https://docsify.js.org/_media/icon.svg ':size=50x100')
![logo](https://docsify.js.org/_media/icon.svg ':size=100')
![logo](https://docsify.js.org/_media/icon.svg ':size=10%')

### Customise class

```md
![logo](https://docsify.js.org/_media/icon.svg ':class=someCssClass')
```

### Customise ID

```md
![logo](https://docsify.js.org/_media/icon.svg ':id=someCssId')
```

## Customise ID for headings

```md
### Hello, world! :id=hello-world
```

## Markdown in html tag

You need to insert a space between the html and markdown content.
This is useful for rendering markdown content in the details element.

```markdown
<details>
<summary>Self-assessment (Click to expand)</summary>

- Abc
- Abc

</details>
```

<details>
<summary>Self-assessment (Click to expand)</summary>

- Abc
- Abc

</details>

Markdown content can also be wrapped in html tags.

```markdown
<div style='color: red'>

- listitem
- listitem
- listitem

</div>
```

<div style='color: red'>

- Abc
- Abc

</div>
