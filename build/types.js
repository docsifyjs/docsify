import fs from 'node:fs/promises';
import path from 'node:path';

const projectDir = path.join(import.meta.dirname, '..');
const sourcePath = path.join(projectDir, 'src/core/module.d.ts');
const outputDir = path.join(projectDir, 'dist');
const outputNames = ['docsify.module.d.ts', 'docsify.module.min.d.ts'];

const declaration = (await fs.readFile(sourcePath, 'utf8'))
  .replaceAll('"./', '"../src/core/')
  .replace(/\/\/# sourceMappingURL=.*\n?$/, '');

await fs.mkdir(outputDir, { recursive: true });
await Promise.all(
  outputNames.map(outputName =>
    fs.writeFile(path.join(outputDir, outputName), declaration),
  ),
);
