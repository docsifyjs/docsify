# Создание страниц

Если вам нужно больше страниц, вы можете просто создать больше файлов разметки в каталоге docsify. Если вы создаете файл с именем `guide.md`, то он доступен через `/#/guide`.

Например, структура каталогов выглядит следующим образом:

```text
.
└── docs
    ├── README.md
    ├── guide.md
    └── zh-cn
        ├── README.md
        └── guide.md
```

Соответствующие маршруты

```text
docs/README.md        => http://domain.com
docs/guide.md         => http://domain.com/guide
docs/zh-cn/README.md  => http://domain.com/zh-cn/
docs/zh-cn/guide.md   => http://domain.com/zh-cn/guide
```

## Боковая панель

Для того, чтобы иметь боковую панель, вы можете создать свой собственный `_sidebar.md` (см. [Боковая панель этой документации](https://github.com/QingWei-Li/docsify/blob/master/docs/ru-ru/_sidebar.md) для примера):

Во-первых, вам нужно установить `loadSidebar` в **true**. Подробности доступны в [пункте конфигурации](ru-ru/configuration.md#loadsidebar).

```html
<!-- index.html -->

<script>
  window.$docsify = {
    loadSidebar: true
  }
</script>
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
```

Создайте `_sidebar.md`:

```markdown
<!-- docs/_sidebar.md -->

* [Home](/)
* [Guide](guide.md)
```

Вам нужно создать `.nojekyll` в `./docs`, чтобы GitHub Pages не игнорировал файлы, начинающиеся с символа `_` подчеркивания.

`_sidebar.md` загружается на каждом уровне каталога. Если текущий каталог не имеет `_sidebar.md`, он вернется в родительский каталог. Если, например, текущий путь `/guide/quick-start`, `_sidebar.md` будет загружен из `/guide/_sidebar.md`.

Вы можете указать `alias`, во избежание ненужного отказа.

```html
<script>
  window.$docsify = {
    loadSidebar: true,
    alias: {
      '/.*/_sidebar.md': '/_sidebar.md'
    }
  }
</script>
```

## Оглавление

После создания `_sidebar.md` содержимое боковой панели автоматически создается на основе заголовков в файлах разметки.

Настраиваемая боковая панель также может автоматически генерировать оглавление, устанавлив `subMaxLevel`, подробнее [subMaxLevel конфигурация](ru-ru/configuration.md#submaxlevel).

```html
<!-- index.html -->

<script>
  window.$docsify = {
    loadSidebar: true,
    subMaxLevel: 2
  }
</script>
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
```

## Игнорирование подзаголовков

Когда `subMaxLevel` установлен, каждый заголовок автоматически добавляется к оглавлению по умолчанию. Если вы хотите игнорировать определенный заголовок, добавьте `{docsify-ignore}` к нему.

```markdown
# Getting Started

## Header {docsify-ignore}

Этот заголовок не будет отображаться в таблице содержимого боковой панели.
```

Чтобы игнорировать все заголовки на определенной странице, вы можете использовать `{docsify-ignore-all}` в первом заголовке страницы.

```markdown
# Getting Started {docsify-ignore-all}

## Header

Все заголовки не будут отображаться в таблице содержимого боковой панели.
```

Оба `{docsify-ignore}` и `{docsify-ignore-all}` не будут отображаться на странице при их использовании.

