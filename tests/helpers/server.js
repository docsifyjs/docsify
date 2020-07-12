module.exports = {
  host: 'localhost',
  port: 8080,
  get URL() {
    return `http://${this.host}:${this.port}`;
  },
};
