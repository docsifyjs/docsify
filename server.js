import { create } from 'browser-sync';
import { devConfig, prodConfig } from './server.configs.js';

const bsServer = create();
const args = process.argv.slice(2);
const config = args.includes('--dev') ? devConfig : prodConfig;
const isWatch = Boolean(config.files) && config.watch !== false;
const urlType = configName === 'prod' ? 'CDN' : 'local';

// prettier-ignore
console.log(`\nStarting ${configName} server (${urlType} URLs, watch: ${isWatch})\n`);

bsServer.init(config);
