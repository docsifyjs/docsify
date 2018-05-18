# Внедрение файлов

С docsify 4.6 теперь можно вставлять файлы любого типа.
Вы можете вставлять эти файлы в виде видео, аудио, iframe или блоков кода, и даже файлы Markdown могут быть встроены непосредственно в документ.

Например, здесь встроен файл Markdown. Вам нужно только это сделать:

```markdown
[filename](_media/example.md ':include')
```

Тогда содержимое `example.md` будет отображаться непосредственно здесь

[filename](../_media/example.md ':include')

Вы можете проверить исходное содержимое для [example.md](_media/example.md ':ignore').

Обычно это будет скомпилировано в ссылку, но в docsify, если вы добавите `:include`, он будет внедрён.

## Типы встроенных файлов

В настоящее время расширение файла автоматически распознается и внедряется по-разному.

Поддерживаемые типы:

* **iframe** `.html`, `.htm`
* **markdown** `.markdown`, `.md`
* **audio** `.mp3`
* **video** `.mp4`, `.ogg`
* **code** другие расширения файлов

Конечно, вы можете принудительно указать тип. Например, вам нужно, чтобы файл Markdown был встроен в кодовый блок.

```markdown
[filename](_media/example.md ':include :type=code')
```

Вы получите это

[filename](../_media/example.md ':include :type=code')

## Tag атрибута

Если вы вставляете файл как `iframe`,` audio` и `video`, вам может потребоваться установить атрибуты этих тёгов.

```markdown
[cinwell website](https://cinwell.com ':include :type=iframe width=100% height=400px')
```

[cinwell website](https://cinwell.com ':include :type=iframe width=100% height=400px')

Вы видели это? Вам нужно только писать напрямую. Вы можете применить атрибуты из [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) .

## Подсветка блока кода

Встраивая любой тип исходного кода, вы можете указать выделенный язык или он будет автоматически идентифицирован.

```markdown
[](_media/example.html ':include :type=code text')
```

⬇️

[](../_media/example.html ':include :type=code text')

?> Как установить подсветку? Вы можете посмотреть [здесь](ru-ru/language-highlight.md).


