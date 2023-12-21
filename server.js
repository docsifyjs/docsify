import { create } from 'browser-sync';
import serverConfigs from './server.config.js';

const bsServer = create();
const args = process.argv.slice(2);
const configName =
  Object.keys(serverConfigs).find(name => args.includes(`--${name}`)) || 'prod';
const settings = serverConfigs[configName];

// prettier-ignore
console.log(`\nStarting ${configName} server (watch: ${Boolean(settings.files)})\n`);

bsServer.init(settings);
