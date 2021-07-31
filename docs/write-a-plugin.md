# Write a plugin

A plugin is simply a function that takes `hook` as an argument. The hook supports handling of asynchronous tasks.

## Full configuration

```js
window.$docsify = {
  plugins: [
    function(hook, vm) {
      hook.init(function() {
        // Called when the script starts running, only trigger once, no arguments,
      });

      hook.beforeEach(function(content) {
        // Invoked each time before parsing the Markdown file.
        // ...
        return content;
      });

      hook.afterEach(function(html, next) {
        // Invoked each time after the Markdown file is parsed.
        // beforeEach and afterEach support asynchronous。
        // ...
        // call `next(html)` when task is done.
        next(html);
      });

      hook.doneEach(function() {
        // Invoked each time after the data is fully loaded, no arguments,
        // ...
      });

      hook.mounted(function() {
        // Called after initial completion. Only trigger once, no arguments.
      });

      hook.ready(function() {
        // Called after initial completion, no arguments.
      });
    }
  ]
};
```

!> You can get internal methods through `window.Docsify`. Get the current instance through the second argument.

## Example

#### footer

Add a footer component to each page.

```js
window.$docsify = {
  plugins: [
    function(hook) {
      var footer = [
        '<hr/>',
        '<footer>',
        '<span><a href="https://github.com/QingWei-Li">cinwell</a> &copy;2017.</span>',
        '<span>Proudly published with <a href="https://github.com/docsifyjs/docsify" target="_blank">docsify</a>.</span>',
        '</footer>'
      ].join('');

      hook.afterEach(function(html) {
        return html + footer;
      });
    }
  ]
};
```

### Edit Button

```js
window.$docsify = {
  plugins: [
    function(hook, vm) {
      hook.beforeEach(function(html) {
        var url =
          'https://github.com/docsifyjs/docsify/blob/master/docs/' +
          vm.route.file;
        var editHtml = '[📝 EDIT DOCUMENT](' + url + ')\n';

        return (
          editHtml +
          html +
          '\n----\n' +
          'Last modified {docsify-updated}' +
          editHtml
        );
      });
    }
  ]
};
```

## Tips

### Get docsify version

```
console.log(window.Docsify.version)
```

Current version: <span id='tip-version'>loading</span>

<script>
document.getElementById('tip-version').innerText = Docsify.version
document.getElementsByClassName("lang-js")[2].innerHTML = document.getElementsByClassName("lang-js")[2].innerHTML.replace(/Last modified .*'/,"Last modified {docsify-updated<span>}'</span>")
</script>
