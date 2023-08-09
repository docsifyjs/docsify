import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const relative = path => new URL(path, import.meta.url);
const args = process.argv.slice(2);
fs.readdir(relative('../src/themes'), (err, files) => {
  if (err) {
    console.error('err', err);
    process.exit(1);
  }
  files.map(async file => {
    if (/\.styl/g.test(file)) {
      const stylusBin = ['node_modules', 'stylus', 'bin', 'stylus'].join(
        path.sep
      );
      let cmdargs = [
        stylusBin,
        `src/themes/${file}`,
        '-u',
        'autoprefixer-stylus',
      ];
      cmdargs = [...cmdargs, ...args];

      const stylusCMD = spawn('node', cmdargs, { shell: true });

      stylusCMD.stdout.on('data', data => {
        console.log(`[Stylus Build ] stdout: ${data}`);
      });

      stylusCMD.stderr.on('data', data => {
        console.error(`[Stylus Build ] stderr: ${data}`);
      });

      stylusCMD.on('close', code => {
        const message = `[Stylus Build ] child process exited with code ${code}`;

        if (code !== 0) {
          console.error(message);
          process.exit(code);
        }
        console.log(message);
      });
    } else {
      return;
    }
  });
});
