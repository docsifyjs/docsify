(function () {
'use strict';

function install (hook, vm) {
  var dom = Docsify.dom;

  hook.mounted(function (_) {
    var div = dom.create('div');
    div.id = 'gitalk-container';
    var main = dom.getNode('#main');
    div.style = "width: " + (main.clientWidth) + "px; margin: 0 auto 20px;";
    dom.appendTo(dom.find('.content'), div);
    var script = dom.create('script');
    var content = "gitalk.render('gitalk-container')";
    script.textContent = content;
    dom.appendTo(dom.body, script);
  });
}

$docsify.plugins = [].concat(install, $docsify.plugins);

}());
