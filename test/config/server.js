import * as process from 'node:process';
import { create } from 'browser-sync';
import config from '../../server.config.js';

const bsServer = create();

export async function startServer() {
  // Wait for server to start
  return new Promise(resolve => {
    const settings = config.test;

    console.log('\n');

    bsServer.init(settings, () => {
      // Exit process if specified port is not available. BrowserSync
      // auto-selects a new port if the specified port is unavailable. This is
      // problematic for testing and CI/CD.
      if (bsServer.getOption('port') !== settings.port) {
        console.log(
          `\nPort ${settings.port} not available. Exiting process.\n`
        );
        process.exit(0);
      }

      resolve(bsServer);
    });
  });
}

export function stopServer() {
  bsServer.exit();
}
