module.exports = {
  serverIP: '127.0.0.1',
  serverPort: 8080,
  get serverURL() {
    return `http://${this.serverIP}:${this.serverPort}`;
  },
};
