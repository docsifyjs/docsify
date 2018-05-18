# Обложка

Активируйте функцию обложки, установив `coverpage` на **true**, подробнее [coverpage конфигурация](ru-ru/configuration.md#coverpage).

## Основное использование

Установите `coverpage` в **true**, и создайте `_coverpage.md`:

```html
<!-- index.html -->

<script>
  window.$docsify = {
    coverpage: true
  }
</script>
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
```

```markdown
<!-- _coverpage.md -->

![logo](_media/icon.svg)

# docsify <small>4.6.10</small>

> Магический генератор сайта документации

* Простой и легковесный (~19kB gzipped)
* Нет статически построенных html файлов
* Множество тем оформления

[GitHub](https://github.com/QingWei-Li/docsify/)
[Начать](#docsify)
```

!> На сайте документа может быть только одна обложка!

## Настройка background

По умолчанию фоновый цвет генерируется случайным образом. Вы можете настроить цвет фона или фоновое изображение:

```markdown
<!-- _coverpage.md -->

# docsify <small>3.5</small>

[GitHub](https://github.com/QingWei-Li/docsify/)
[Начать](#quick-start)

<!-- background image -->

![](_media/bg.png)

<!-- background color -->

![color](#f0f0f0)
```

## Обложка как главная страница 

Обычно, одновременно отображаются страница обложки и домашняя страница. Конечно, вы также можете отделить обложку через [опцию onlyCover](ru-ru/configuration.md#onlycover).

## Несколько обложек

Если ваш сайт документов находится на нескольких языках, может оказаться полезным установить несколько обложек.

Например, структура ваших документов выглядит так:

```text
.
└── docs
    ├── README.md
    ├── guide.md
    ├── _coverpage.md
    └── zh-cn
        ├── README.md
        └── guide.md
        └── _coverpage.md
```

Теперь вы можете установить

```js
window.$docsify = {
  coverpage: ['/', '/zh-cn/']
};
```

Или через специальное имя файла

```js
window.$docsify = {
  coverpage: {
    '/': 'cover.md',
    '/zh-cn/': 'cover.md'
  }
};
```


