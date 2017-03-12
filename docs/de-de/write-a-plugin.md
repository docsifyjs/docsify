# Schreiben einer Erweiterung

Eine Erweiterung ist schlicht eine Funktion, welche `hook` als Argument nimmt. hook unterstützt dabei das Verwalten von asynchrononen Tasks.

## Volle Konfiguration

```js
window.$docsify = {
 plugins: [
  function (hook, vm) {
    hook.init(function() {
      // Called when the script starts running, only trigger once, no arguments,
    })

    hook.beforeEach(function(content) {
      // Invoked each time before parsing the Markdown file.
      // ...
      return content
    })

    hook.afterEach(function(html, next) {
      // Invoked each time after the Markdown file is parsed.
      // beforeEach and afterEach support asynchronous。
      // ...
      // call `next(html)` when task is done.
      next(html)
    })

    hook.doneEach(function() {
      // Invoked each time after the data is fully loaded, no arguments,
      // ...
    })

    hook.mounted(function() {
      // Called after initial completion. Only trigger once, no arguments.
    })

    hook.ready(function() {
      // Called after initial completion, no arguments.
    })
  }
 ]
}
```

!> Du kannst auf interne Methoden über `window.Docsify` zugreifen. Greife auf die aktuelle Instanz über das zweite Argument zu.

## Beispiel

Füge jeder Seite eine footer Komponente hinzu:

```js
window.$docsify = {
  plugins: [
    function (hook) {
      var footer = [
        '<hr/>',
        '<footer>',
        '<span><a href="https://github.com/QingWei-Li">cinwell</a> &copy;2017.</span>',
        '<span>Proudly published with <a href="https://github.com/QingWei-Li/docsify" target="_blank">docsify</a>.</span>',
        '</footer>'
      ].join('')

      hook.afterEach(function (html) {
        return html + footer
      })
    }
  ]
}
```
