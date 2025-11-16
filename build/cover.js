import fs from 'fs';
import { relative } from './util.js';

const read = fs.readFileSync;
const write = fs.writeFileSync;
const pkgPath = relative(import.meta, '..', 'package.json');
const pkg = JSON.parse(read(pkgPath).toString());
const version = process.env.VERSION || pkg.version;

const file = relative(import.meta, '..', 'docs', '_coverpage.md');
let cover = read(file, 'utf8').toString();

console.log('Replace version number in cover page...');
cover = cover.replace(
  /<small>(\S+)?<\/small>/g,
  /* html */ `<small>${version}</small>`,
);
write(file, cover);
