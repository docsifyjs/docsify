import fs from 'fs';
import path from 'path';

const tmplPath = path.resolve(__dirname, 'default-template.html');

export function getDefaultTemplate() {
  return fs.readFileSync(tmplPath).toString();
}
