# Dokumentationshelfer

docsify erweitert die Markdownsyntax, um deine Dokumente besser lesbar zu machen.

## Wichtiger Inhalt

Wichtiger Inhalt wie:

```markdown
!> **Zeit** ist Geld, mein Freund!
```

wird wie folgt gerendert:

!> **Zeit** ist Geld, mein Freund!

## Generelle Tipps

Generelle Tipps wie:

```markdown
?> *TODO* unit test
```

wird wie folgt gerendert:

?> *TODO* unit test

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
