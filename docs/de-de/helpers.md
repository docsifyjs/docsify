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
?> _TODO_ unit test
```

wird wie folgt gerendert:

?> _TODO_ unit test

## Ignorieren bestimmter Links beim Kompilieren

Manchmal möchten wir einen bestimmten relativen Pfad als Link. Dazu müssen wir **docsify** anweisen, diesen Link nicht zu kompilieren.
Als Beispiel:

```md
[link](/demo/)
```

Daraus wird `<a href="/#/demo/">link</a>` und **docsify** lädt dann `/demo/README.md`. Vielleicht wolltest du aber zu `/demo/index.html`?

Ändere deinen Link also zu:

```md
[link](/demo/ ':ignore')
```

Nun erhälst du den Link `<a href="/demo/">link</a>`. Einen Titel kannst du wie folgt einstellen:

```md
[link](/demo/ ':ignore title')

<a href="/demo/" title="title">link</a>
```

## Setze ein target attribute für deinen Link

```md
[link](/demo ':target=_blank')
[link](/demo2 ':target=_self')
```

## Links deaktivieren

```md
[link](/demo ':disable')
```

## Github Task Lists

```md
- [ ] foo
- bar
- [x] baz
- [] bam <~ funktioniert nicht
  - [ ] bim
  - [ ] lim
```

- [ ] foo
- bar
- [x] baz
- [] bam <~ funktioniert nicht
  - [ ] bim
  - [ ] lim

## Größe von Bildern ändern

```md
![logo](https://docsify.js.org/_media/icon.svg ':size=50x100')
![logo](https://docsify.js.org/_media/icon.svg ':size=100')
```

![logo](https://docsify.js.org/_media/icon.svg ':size=50x100')
![logo](https://docsify.js.org/_media/icon.svg ':size=100')
