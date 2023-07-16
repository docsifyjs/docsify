import fs from 'fs';
import { relative } from './util.js';
var read = fs.readFileSync;
var write = fs.writeFileSync;
const pkgPath = relative(import.meta, '..', 'package.json');
const pkg = JSON.parse(read(pkgPath).toString());
var version = process.env.VERSION || pkg.version;

var file = relative(import.meta, '..', 'docs', '_coverpage.md');
var cover = read(file, 'utf8').toString();

console.log('Replace version number in cover page...');
cover = cover.replace(
  /<small>(\S+)?<\/small>/g,
  '<small>' + version + '</small>'
);
write(file, cover);
