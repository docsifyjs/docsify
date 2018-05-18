# Совместимость с Vue

Вы можете писать компоненты Vue непосредственно для файлов Markdown, и он будет проанализирован. Вы можете использовать эту функцию для совместной работы vue demo и документации.

## Основное использование

Загружает Vue из `./index.html`.

```html
<script src="//unpkg.com/vue"></script>
<script src="//unpkg.com/docsify"></script>

<!-- или использовать сжатые файлы -->
<script src="//unpkg.com/vue/dist/vue.min.js"></script>
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
```

Затем вы можете сразу же написать код Vue в файле Markdown. 
`new Vue({ el: '#main' })` скрипт выполняется по умолчанию для создания экземпляра.

*README.md*

````markdown
# Vue руководство

использование `v-for`.

```html
<ul>
  <li v-for="i in 10">{{ i }}</li>
</ul>
```

<ul>
  <li v-for="i in 10">{{ i }}</li>
</ul>
````

Вы можете вручную инициализировать экземпляр Vue.

*README.md*

```markdown
# Vue demo

<div>Привет {{ msg }}</div>

<script>
  new Vue({
    el: '#main',
    data: { msg: 'Vue' }
  })
</script>
```

!> В файле Markdown выполняется скрипт только в первом тёге скрипта.

## Комбинация Vuep для создания playground

[Vuep](https://github.com/QingWei-Li/vuep) является компонентом для рендеринга компонентов Vue с живым редактором и предварительным просмотром. Поддерживает спецификацию компонентов Vue и JSX.

*index.html*

```html
<!-- внедрить css файл -->
<link rel="stylesheet" href="//unpkg.com/vuep/dist/vuep.css">

<!-- внедрить javascript файлы -->
<script src="//unpkg.com/vue"></script>
<script src="//unpkg.com/vuep"></script>
<script src="//unpkg.com/docsify"></script>

<!-- или использовать сжатые файлы -->
<script src="//unpkg.com/vue/dist/vue.min.js"></script>
<script src="//unpkg.com/vuep/dist/vuep.min.js"></script>
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
```

*README.md*
```markdown
# Vuep

<vuep template="#example"></vuep>

<script v-pre type="text/x-template" id="example">
  <template>
    <div>Привет, {{ name }}!</div>
  </template>

  <script>
    module.exports = {
      data: function () {
        return { name: 'Vue' }
      }
    }
  </script>
</script>
```

?> Ссылка на экземпляр [vuep documentation](https://qingwei-li.github.io/vuep/).


