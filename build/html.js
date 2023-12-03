import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Preview
// =============================================================================
function generatePreview() {
  const file = 'index.html';
  const srcPath = path.resolve(__dirname, '..', 'docs');
  const srcHTML = fs.readFileSync(path.resolve(srcPath, file), 'utf8');
  const outPath = path.resolve(__dirname, '..');
  const outHTML = srcHTML
    // Replace CDN URLs with local paths
    .replace(/\/\/cdn.jsdelivr.net\/npm\/docsify@4\//g, '/');

  fs.writeFileSync(path.resolve(outPath, file), outHTML);
}

generatePreview();
