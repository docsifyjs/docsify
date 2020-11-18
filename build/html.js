const fs = require('fs');
const nunjucks = require('nunjucks');
const path = require('path');
const prettier = require('prettier');

const renderJobs = [
  // Preview index.html
  {
    isProduction: false,
    inputPath: path.resolve(__dirname, '../src/html/index.njk'),
    outputPath: path.resolve(__dirname, '../index.html'),
  },
  // Production index.html
  {
    isProduction: true,
    inputPath: path.resolve(__dirname, '../src/html/index.njk'),
    outputPath: path.resolve(__dirname, '../docs/index.html'),
  },
];

for (const job of renderJobs) {
  console.log(`[Build HTML] ${job.outputPath}`);

  const template = fs.readFileSync(job.inputPath, 'utf8').toString();
  const html = nunjucks.renderString(template, job);
  const htmlFormatted = prettier.format(html, { parser: 'html' });

  fs.writeFileSync(job.outputPath, htmlFormatted);
}
