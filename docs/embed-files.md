# Embed files

With docsify 4.6 it is now possible to embed any type of file.

You can embed these files as video, audio, iframes, or code blocks, and even Markdown files can even be embedded directly into the document.

For example, here is an embedded Markdown file. You only need to do this:

```markdown
[filename](_media/example.md ':include')
```

Then the content of `example.md` will be displayed directly here;

[filename](_media/example.md ':include')

You can check the original content for [example.md](_media/example.md ':ignore').

Normally, this will compiled into a link, but in docsify, if you add `:include` it will be embedded.

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

You can embed a gist as markdown content or as a code block. No plugin or app config change is needed - just an element which follows the formatting covered in [Embed files](#embed-files) and uses a raw gist URL.

Start by viewing a gist on `gist.github.com`. 

For the purposes of the examples below, we assume is this is a valid gist URL.

- https://gist.github.com/docsify/c2bece08f27c4277001f123898d16a7c

Identify the following:

- **Github username** - e.g. `docsify`
- **Gist ID** - e.g. `c2bece08f27c4277001f123898d16a7c`
- **Filename** - choose any valid filename in the gist e.g. `instructions.md`

Next, you can create the full URL for the file on the `gist.githubusercontent.com` domain. See below for markdown or codeblock approaches.

### Render markdown content from gist

Embed markdown content on your Docsify page. This is a great way to embed content seemlessly without an external link, whether the gist was created by yourself or another account. 

Here is the format:

```markdown
[LABEL](https://gist.githubusercontent.com/USERNAME/GIST_ID/raw/FILENAME ':include')
```

Note that the `LABEL` will be the fallback text if the link is broken - so if the filename is there it helps for debugging.

Using the example case, the element would be:

```markdown
[instructions.md](https://gist.githubusercontent.com/docsify/c2bece08f27c4277001f123898d16a7c/raw/instructions.md ':include')
```

### Render codeblock from gist

Embed a gist on your Docsify page as a code block. The format is the same as the previous section except it just has `:type=code` added on in the alt text. 

As with the [Embedded file type](#embedded-file-type) section, the syntax highlighting will be inferred from the extension (e.g. `.js` or `.py`) so you can leave the type as `code`.
 
Here is the format:

```markdown
[LABEL](https://gist.githubusercontent.com/USERNAME/GIST_ID/raw/FILENAME ':include :type=code')
```

Using the example case, the element would be:

```markdown
[instructions.md](https://gist.githubusercontent.com/docsify/c2bece08f27c4277001f123898d16a7c/raw/instructions.md ':include :type=code')
```
 
