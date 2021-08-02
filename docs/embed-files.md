# Embed files

With docsify 4.6 it is now possible to embed any type of file.

You can embed these files as video, audio, iframes, or code blocks, and even Markdown files can even be embedded directly into the document.

For example, here is an embedded Markdown file. You only need to do this:

```markdown
[filename](_media/example.md ':include')
```

Then the content of `example.md` will be displayed directly here:

[filename](_media/example.md ':include')

You can check the original content for [example.md](_media/example.md ':ignore').

Normally, this will be compiled into a link, but in docsify, if you add `:include` it will be embedded. You can use single or double quotation marks around as you like.

External links can be used too - just replace the target. If you want to use a gist URL, see [Embed a gist](#embed-a-gist) section.

## Embedded file type

Currently, file extensions are automatically recognized and embedded in different ways.

These types are supported:

* **iframe** `.html`, `.htm`
* **markdown** `.markdown`, `.md`
* **audio** `.mp3`
* **video** `.mp4`, `.ogg`
* **code** other file extension

Of course, you can force the specified type. For example, a Markdown file can be embedded as a code block by setting `:type=code`.

```markdown
[filename](_media/example.md ':include :type=code')
```

You will get:

[filename](_media/example.md ':include :type=code')

## Markdown with YAML Front Matter

When using Markdown, YAML front matter will be stripped from the rendered content. The attributes cannot be used in this case.

```markdown
[filename](_media/example-with-yaml.md ':include')
```

You will get just the content

[filename](_media/example-with-yaml.md ':include')

## Embedded code fragments

Sometimes you don't want to embed a whole file. Maybe because you need just a few lines but you want to compile and test the file in CI.

```markdown
[filename](_media/example.js ':include :type=code :fragment=demo')
```

In your code file you need to surround the fragment between `/// [demo]` lines (before and after the fragment).
Alternatively you can use `### [demo]`.

Example:

[filename](_media/example.js ':include :type=code :fragment=demo')

## Tag attribute

If you embed the file as `iframe`, `audio` and `video`, then you may need to set the attributes of these tags.

?> Note, for the `audio` and `video` types, docsify adds the `controls` attribute by default. When you want add more attributes, the `controls` attribute need to be added manually if need be.
```md
[filename](_media/example.mp4 ':include :type=video controls width=100%')
```

```markdown
[cinwell website](https://cinwell.com ':include :type=iframe width=100% height=400px')
```

[cinwell website](https://cinwell.com ':include :type=iframe width=100% height=400px')

Did you see it? You only need to write directly. You can check [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) for these attributes.

## The code block highlight

Embedding any type of source code file, you can specify the highlighted language or automatically identify.

```markdown
[](_media/example.html ':include :type=code text')
```

⬇️

[](_media/example.html ':include :type=code text')

?> How to set highlight? You can see [here](language-highlight.md).

## Embed a gist

You can embed a gist as markdown content or as a code block - this is based on the approach at the start of [Embed Files](#embed-files) section, but uses a raw gist URL as the target.

?> **No** plugin or app config change is needed here to make this work. In fact, the "Embed" `script` tag that is copied from a gist will _not_ load even if you make plugin or config changes to allow an external script.

### Identify the gist's metadata

Start by viewing a gist on `gist.github.com`. For the purposes of this guide, we use this gist:

- https://gist.github.com/anikethsaha/f88893bb563bb7229d6e575db53a8c15

Identify the following items from the gist:

Field               | Example                            | Description
---                 | ---                                | ---
**Username**        | `anikethsaha`                      | The gist's owner.
**Gist ID**         | `c2bece08f27c4277001f123898d16a7c` | Identifier for the gist. This is fixed for the gist's lifetime.
**Filename**        | `content.md`                       | Select a name of a file in the gist. This needed even on a single-file gist for embedding to work.

You will need those to build the _raw gist URL_ for the target file. This has the following format:

- `https://gist.githubusercontent.com/USERNAME/GIST_ID/raw/FILENAME`

Here are two examples based on the sample gist:

- https://gist.githubusercontent.com/anikethsaha/f88893bb563bb7229d6e575db53a8c15/raw/content.md
- https://gist.githubusercontent.com/anikethsaha/f88893bb563bb7229d6e575db53a8c15/raw/script.js

?> Alternatively, you can get a raw URL directly clicking the _Raw_ button on a gist file. But, if you use that approach, just be sure to **remove** the revision number between `raw/` and the filename so that the URL matches the pattern above instead. Otherwise your embedded gist will **not** show the latest content when the gist is updated.

Continue with one of the sections below to embed the gist on a Docsify page.

### Render markdown content from a gist

This is a great way to embed content **seamlessly** in your docs, without sending someone to an external link. This approach is well-suited to reusing a gist of say installation instructions across doc sites of multiple repos. This approach works equally well with a gist owned by your account or by another user.

Here is the format:

```markdown
[LABEL](https://gist.githubusercontent.com/USERNAME/GIST_ID/raw/FILENAME ':include')
```

For example:

```markdown
[gist: content.md](https://gist.githubusercontent.com/anikethsaha/f88893bb563bb7229d6e575db53a8c15/raw/content.md ':include')
```

Which renders as:

[gist: content.md](https://gist.githubusercontent.com/anikethsaha/f88893bb563bb7229d6e575db53a8c15/raw/content.md ':include')

The `LABEL` can be any text you want. It acts as a _fallback_ message if the link is broken - so it is useful to repeat the filename here in case you need to fix a broken link. It also makes an embedded element easy to read at a glance.

### Render a codeblock from a gist

The format is the same as the previous section, but with `:type=code` added to the alt text. As with the [Embedded file type](#embedded-file-type) section, the syntax highlighting will be **inferred** from the extension (e.g. `.js` or `.py`), so you can leave the `type` set as `code`.

Here is the format:

```markdown
[LABEL](https://gist.githubusercontent.com/USERNAME/GIST_ID/raw/FILENAME ':include :type=code')
```

For example:

```markdown
[gist: script.js](https://gist.githubusercontent.com/anikethsaha/f88893bb563bb7229d6e575db53a8c15/raw/script.js ':include :type=code')
```

Which renders as:

[gist: script.js](https://gist.githubusercontent.com/anikethsaha/f88893bb563bb7229d6e575db53a8c15/raw/script.js ':include :type=code')
