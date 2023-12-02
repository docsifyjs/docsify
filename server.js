import { create } from 'browser-sync';
import config from './server.config.js';

const bsServer = create();
const isDev = process.argv.includes('--dev');
const settings = config[isDev ? 'dev' : 'prod'];

console.log(
  [
    '\n',
    'Starting',
    isDev ? 'development' : 'standard',
    'server',
    `(watch: ${isDev})`,
    '\n',
  ].join(' ')
);

bsServer.init(settings);
