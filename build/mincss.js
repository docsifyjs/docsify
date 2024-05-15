import path from 'path';
import fs from 'fs';
import cssnano from 'cssnano';

const outputDir = 'dist/themes';
const files = fs
  .readdirSync(path.resolve(outputDir))
  .filter(file => !file.endsWith('min.css'));

files.forEach(file => {
  file = path.resolve(outputDir, file);
  cssnano
    .process(fs.readFileSync(file), { from: file })
    .then(result => {
      file = file.replace(/\.css$/, '.min.css');
      fs.writeFileSync(file, result.css);
    })
    .catch(e => {
      console.error(e);
      process.exit(1);
    });
});
