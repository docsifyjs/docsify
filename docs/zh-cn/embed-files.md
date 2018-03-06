# 文件嵌入

docsify 4.6 开始支持嵌入任何类型的文件到文档里。你可以将文件当成 `iframe`、`video`、`audio` 或者 `code block`，如果是 Markdown 文件，甚至可以直接插入到当前文档里。

这是一个嵌入 Markdown 文件的例子。

```markdown
[filename](../_media/example.md ':include')
```

`example.md` 文件的内容将会直接显示在这里

[filename](../_media/example.md ':include')

你可以查看 [example.md](../_media/example.md ':ignore') 原始内容对比效果。

通常情况下，这样的语法将会被当作链接处理。但是在 docsify 里，如果你添加一个 `:include` 选项，它就会被当作文件嵌入。

## 嵌入的类型

当前，嵌入的类型是通过文件后缀自动识别的，这是目前支持的类型：

* **iframe** `.html`, `.htm`
* **markdown** `.markdown`, `.md`
* **audio** `.mp3`
* **video** `.mp4`, `.ogg`
* **code** other file extension

当然，你也可以强制设置嵌入类型。例如你想将 Markdown 文件当作一个 `code block` 嵌入。

```markdown
[filename](../_media/example.md ':include :type=code')
```

你将得到

[filename](../_media/example.md ':include :type=code')

## 标签属性

如果你嵌入文件是一个 `iframe`、`audio` 或者 `video`，你可以给这些标签设置属性。

```markdown
[cinwell website](https://cinwell.com ':include :type=iframe width=100% height=400px')
```

[cinwell website](https://cinwell.com ':include :type=iframe width=100% height=400px')

看见没？你只需要直接写属性就好了，每个标签有哪些属性建议你查看 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)。

## 代码块高亮

如果是嵌入一个代码块，你可以设置高亮的语言，或者让它自动识别。这里是手动设置高亮语言

```markdown
[](../_media/example.html ':include :type=code text')
```

⬇️

[](../_media/example.html ':include :type=code text')

?> 如何高亮代码？你可以查看[这份文档](language-highlight.md).
