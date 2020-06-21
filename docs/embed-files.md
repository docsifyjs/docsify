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
