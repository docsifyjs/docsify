import server from './server.js';

export default async config => {
  await server.startAsync();
};
