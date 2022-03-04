const axios = require('axios');
const fs = require('fs');
const path = require('path');

const filePaths = {
  emojiMarkdown: path.resolve(process.cwd(), 'docs', 'emoji.md'),
  emojiJS: path.resolve(
    process.cwd(),
    'src',
    'core',
    'render',
    'emojify-data.js'
  ),
};

async function getEmojiData() {
  const emojiDataURL = 'https://api.github.com/emojis';
  const response = await axios.get(emojiDataURL);
  const baseURL = Object.values(response.data)
    .find(url => /unicode\//)
    .split('unicode/')[0];
  const data = { ...response.data };

  // Remove base URL from emoji URLs
  Object.entries(data).forEach(
    ([key, value]) => (data[key] = value.replace(baseURL, ''))
  );

  return {
    baseURL,
    data,
  };
}

function writeEmojiPage(emojiData) {
  const emojiPage =
    (fs.existsSync(filePaths.emojiMarkdown) &&
      fs.readFileSync(filePaths.emojiMarkdown, 'utf8')) ||
    `<!-- START -->\n\n<!-- END -->`;
  const emojiRegEx = /(<!--\s*START.*-->\n)([\s\S]*)(\n<!--\s*END.*-->)/;
  const emojiMatch = emojiPage.match(emojiRegEx);
  const emojiMarkdownStart = emojiMatch[1].trim();
  const emojiMarkdown = emojiMatch[2].trim();
  const emojiMarkdownEnd = emojiMatch[3].trim();
  const newEmojiMarkdown = Object.keys(emojiData.data)
    .reduce(
      (preVal, curVal) =>
        (preVal += `:${curVal}: ` + '`' + `:${curVal}:` + '`' + '\n\n'),
      ''
    )
    .trim();

  if (emojiMarkdown !== newEmojiMarkdown) {
    const newEmojiPage = emojiPage.replace(
      emojiMatch[0],
      `${emojiMarkdownStart}\n${newEmojiMarkdown}\n${emojiMarkdownEnd}`
    );

    fs.writeFileSync(filePaths.emojiMarkdown, newEmojiPage);
    console.info(`- Created new file: ${filePaths.emojiMarkdown}`);
  } else {
    console.info(`- No changes to file: ${filePaths.emojiMarkdown}`);
  }
}

function writeEmojiJS(emojiData) {
  const emojiJS =
    fs.existsSync(filePaths.emojiJS) &&
    fs.readFileSync(filePaths.emojiJS, 'utf8');
  const newEmojiJS = `export default ${JSON.stringify(emojiData, {}, 2)}`;

  if (!emojiJS || emojiJS !== newEmojiJS) {
    fs.writeFileSync(filePaths.emojiJS, newEmojiJS);
    console.info(`- Created new file: ${filePaths.emojiJS}`);
  } else {
    console.info(`- No changes to file: ${filePaths.emojiJS}`);
  }
}

(async () => {
  console.log('Build emoji');

  try {
    const emojiData = await getEmojiData();

    writeEmojiPage(emojiData);
    writeEmojiJS(emojiData);
  } catch (e) {
    console.error(e);
  }
})();
