import fs from 'fs';
import path from 'path';

const dirname = path.dirname(import.meta.url.replace('file://', ''));
const tmplPath = path.resolve(dirname, 'template.html');

export function getServerHTMLTemplate() {
  return fs.readFileSync(tmplPath).toString();
}
