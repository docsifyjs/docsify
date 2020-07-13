module.exports = {
  host: '127.0.0.1',
  port: 8080,
  get URL() {
    return `http://${this.host}:${this.port}`;
  },
};
