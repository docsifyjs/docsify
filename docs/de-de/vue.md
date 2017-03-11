# Kompatibel mit Vue

Du kannst Vue Komponenten direkt in den Markdown Dateien verwenden, und sie werden umgewandelt. Du kannst dies zum Beispiel verwenden, um Vue Komponenten gleichzeitig zu demonstrieren und zu dokumentieren.

## Einfache Verwendung

Lade Vue in `./index.html`.

```html
<script src="//unpkg.com/vue"></script>
<script src="//unpkg.com/docsify"></script>

<!-- oder verwende die komprimierten Dateien -->
<script src="//unpkg.com/vue/dist/vue.min.js"></script>
<script src="//unpkg.com/docsify/lib/docsify.min.js"></script>
```

Dann kannst du sofort Vue Code in deinen Markdown Dateien verwenden. `new Vue({ el: '#main' })` wird als Standard ausgeführt, um Instanzen zu erschaffen.

*README.md*

```markdown
# Vue guide

`v-for` usage.

```html
<ul>
  <li v-for="i in 10">{{ i }}</li>
</ul>
``

<ul>
  <li v-for="i in 10">{{ i }}</li>
</ul>
```

Du kannst manuell eine Vue Instanz initialisieren.

*README.md*

```markdown
# Vue demo

<div>hello {{ msg }}</div>

<script>
  new Vue({
    el: '#main',
    data: { msg: 'Vue' }
  })
</script>
```

!> In Markdown Dateien wird nur das Skript innerhalb des ersten script tag Blocks ausgeführt.

## Kombiniere Vuep um Demos zu erschaffen

[Vuep](https://github.com/QingWei-Li/vuep) ist eine Komponente zur Darstellung von Vue Komponenten mit einem Liveeditor und einer Vorschau.Unterstützt die Vue Komponenten spec und JSX.

*index.html*

```html
<!-- injizieren von CSS -->
<link rel="stylesheet" href="//unpkg.com/vuep/dist/vuep.css">

<!-- injizieren von JS -->
<script src="//unpkg.com/vue"></script>
<script src="//unpkg.com/vuep"></script>
<script src="//unpkg.com/docsify"></script>

<!-- oder verwende die komprimierten Dateien -->
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
    <div>Hello, {{ name }}!</div>
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

?> Zum Beispiel vergleich auch die [vuep Dokumentation](https://qingwei-li.github.io/vuep/).
