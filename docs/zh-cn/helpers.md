# 文档助手

docsify 扩展了一些 Markdown 语法，可以让文档更易读。


## 强调内容

适合显示重要的提示信息，语法为 `!> 内容`。

```markdown
!> 一段重要的内容，可以和其他 **Markdown** 语法混用。
```

!> 一段重要的内容，可以和其他 **Markdown** 语法混用。


## 普通提示

普通的提示信息，比如写 TODO 或者参考内容等。

```markdown
?> *TODO* 完善示例
```

?> *TODO* 完善示例


## Ignore to compile link

Some time we will put some other relative path to the link, you have to need to tell docsify you don't need to compile this link. For example

```md
[link](/demo/)
```


It will be compiled to `<a href="/#/demo/">link</a>` and will be loaded `/demo/README.md`. Maybe you want to jump to `/demo/index.html`.

Now you can do that

```md
[link](/demo/ ":ignore")
```
You will get `<a href="/demo/">link</a>`html. Do not worry, you can still set title for link.

```md
[link](/demo/ ":ignore title")

<a href="/demo/" title="title">link</a>
```


## Set target attribute for link

```md
[link](/demo ":target=_blank")
[link](/demo2 ":target=_self")
```
