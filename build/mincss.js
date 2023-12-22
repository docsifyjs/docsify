import path from 'path';
import fs from 'fs';
import cssnano from 'cssnano';

const files = fs
  .readdirSync(path.resolve('lib/themes'))
  .filter(file => !file.endsWith('min.css'));

files.forEach(file => {
  file = path.resolve('lib/themes', file);
  cssnano
    .process(fs.readFileSync(file))
    .then(result => {
      file = file.replace(/\.css$/, '.min.css');
      fs.writeFileSync(file, result.css);
    })
    .catch(e => {
      console.error(e);
      process.exit(1);
    });
});
