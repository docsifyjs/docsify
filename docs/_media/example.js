import fetch from 'fetch';

const URL = 'https://example.com';
const PORT = 8080;

/// [demo]
const result = fetch(`${URL}:${PORT}`)
  .then(response => {
    return response.json();
  })
  .then(myJson => {
    console.log(JSON.stringify(myJson));
  });
/// [demo]

result.then(console.log).catch(console.error);
