# Module guide

<p id="module-result">Loading module…</p>

<script type="module">
  import { renderResult } from './demo-module.js';
  const { message } = await import('../shared.js');

  renderResult(document.querySelector('#module-result'), message);
</script>

[Return home](../README.md)
