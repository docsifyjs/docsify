import { create } from 'browser-sync';
import serverConfigs from './server.config.js';

const bsServer = create();
const args = process.argv.slice(2);
const configName =
  Object.keys(serverConfigs).find(name => args.includes(`--${name}`)) || 'prod';
const settings = serverConfigs[configName];
const isWatch = Boolean(settings.files) && settings.watch !== false;
const urlType = configName === 'prod' ? 'CDN' : 'local';

// prettier-ignore
console.log(`\nStarting ${configName} server (${urlType} URLs, watch: ${isWatch})\n`);

bsServer.init(settings);
