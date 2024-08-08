# Doc helper

docsify extends Markdown syntax to make your documents more readable.

> Note: For the special code syntax cases, it's better to put them within code backticks to avoid any conflict from configurations or emojis.

## Callouts

Docsify supports [GitHub style](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts) callouts (also known as "admonitions" or "alerts").

<!-- prettier-ignore -->
> [!CAUTION]
> **Caution** callouts communicate negative potential consequences of an action.

<!-- prettier-ignore -->
> [!IMPORTANT]
> **Important** callouts communicate information necessary for users to succeed.

<!-- prettier-ignore -->
> [!NOTE]
> **Note** callouts communicate information that users should take into account.

<!-- prettier-ignore -->
> [!TIP]
> **Tip** callouts communicate optional information to help a user be more successful.

<!-- prettier-ignore -->
> [!WARNING]
> **Warning** callouts communicate potential risks user should be aware of.

**Markdown**

<!-- prettier-ignore -->
```markdown
> [!CAUTION]
> **Caution** callouts communicate negative potential consequences of an action.

> [!IMPORTANT]
> **Important** callouts communicate information necessary for users to succeed.

> [!NOTE]
> **Note** callouts communicate information that users should take into account.

> [!TIP]
> **Tip** callouts communicate optional information to help a user be more successful.

> [!WARNING]
> **Warning** callouts communicate potential risks user should be aware of.
```

### Legacy Style ⚠️

The following Docsify v4 callout syntax has been deprecated and will be removed in a future version.

!> Legacy **Important** callouts are deprecated.

?> Legacy **Tip** callouts are deprecated.

**Markdown**

```markdown
!> Legacy **Important** callouts are deprecated.

?> Legacy **Tip** callouts are deprecated.
```

## Link attributes

### disabled

```markdown
[link](/demo ':disabled')
```

### href

Sometimes we will use some other relative path for the link, and we have to tell docsify that we don't need to compile this link. For example:

```markdown
[link](/demo/)
```

It will be compiled to `<a href="/#/demo/">link</a>` and will load `/demo/README.md`. Maybe you want to jump to `/demo/index.html`.

Now you can do that

```markdown
[link](/demo/ ':ignore')
```

You will get `<a href="/demo/">link</a>`html. Do not worry, you can still set the title for the link.

```markdown
[link](/demo/ ':ignore title')

<a href="/demo/" title="title">link</a>
```

### target

```markdown
[link](/demo ':target=_blank')
[link](/demo2 ':target=_self')
```

## Task lists

```markdown
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

## Images

### Class names

```markdown
![logo](https://docsify.js.org/_media/icon.svg ':class=someCssClass')
```

### IDs

```markdown
![logo](https://docsify.js.org/_media/icon.svg ':id=someCssId')
```

### Sizes

```markdown
![logo](https://docsify.js.org/_media/icon.svg ':size=WIDTHxHEIGHT')
![logo](https://docsify.js.org/_media/icon.svg ':size=50x100')
![logo](https://docsify.js.org/_media/icon.svg ':size=100')

<!-- Support percentage -->

![logo](https://docsify.js.org/_media/icon.svg ':size=10%')
```

![logo](https://docsify.js.org/_media/icon.svg ':size=50x100')
![logo](https://docsify.js.org/_media/icon.svg ':size=100')
![logo](https://docsify.js.org/_media/icon.svg ':size=10%')

## Heading IDs

```markdown
### Hello, world! :id=hello-world
```

## Markdown + HTML

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

- listitem
- listitem
- listitem

</div>
