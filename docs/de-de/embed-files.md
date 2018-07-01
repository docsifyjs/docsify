# Einbinden von Dateien

Mit docsify `4.6` ist es jetzt möglich, jede Art von Datei einzubinden.
Du kannst Dateien als Video, Audio, iframes oder Code Blöcke einbinden. Markdown Dateien können sogar direkt eingebunden werden.

Als Beispiel binden wir hier eine Markdown Datei ein:

```markdown
[Dateiname](_media/example.md ':include')
```

Dabei wird der Inhalt der Datei `example.md` direkt eingebunden. Zum Beispiel wie folgt:

[Dateiname](_media/example.md ':include')

Vergleiche diesen Link: [example.md](_media/example.md ':ignore').

Für gewöhnlich wäre dies ein Link. Bei der Verwendung von `:include` bindet **`docsify`** diese Datei jedoch direkt ein.

## Einbinden bestimmter Dateitypen

Aktuell werden Dateiendungen automatisch erkannt. **docsify** bindet abhängig davon Dateien unterschiedlich ein.

Unterstützt werden derzeit:

* **iframe** `.html`, `.htm`
* **markdown** `.markdown`, `.md`
* **audio** `.mp3`
* **video** `.mp4`, `.ogg`
* **code** other file extension

Natürlich kannst du auch einen bestimmten Typ bei der Einbindung einer Datei erzwingen:

```markdown
[Dateiname](_media/example.md ':include :type=code')
```

Obiges Beispiel hier:

[Dateiname](_media/example.md ':include :type=code')

## Tag attribute

Wenn du eine Datei als `iframe`, `audio` oder `video` einbindest, kann dies das Definieren bestimmter Attribute erfordern.

```markdown
[cinwell website](https://cinwell.com ':include :type=iframe width=100% height=400px')
```

[cinwell website](https://cinwell.com ':include :type=iframe width=100% height=400px')

Hast du die Seite gesehen? Du kannst also direkt über einen Markdown-Link Webseiten einfügen. Vergleiche [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) für eine Liste von Attributen.

## Hervorhebung von Code Blöcken

Beim Einbinden von Source Code Dateien jeglichen Typs kannst du die hervorgehobene Sprache automatisch erkennen lassen oder auch selbst definieren.

```markdown
[](_media/example.html ':include :type=code text')
```

⬇️

[](_media/example.html ':include :type=code text')

?> Wie genau ging das nochmal mit der Hervorhebung? Vergleiche [diese Seite](language-highlight.md).
