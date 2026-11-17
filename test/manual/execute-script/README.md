# Manual module import test

Run these commands from the repository root:

```sh
npm run build
node test/manual/execute-script/server.js
```

Open either mode:

- Hash: <http://127.0.0.1:4173/module-demo/hash/>
- History: <http://127.0.0.1:4173/module-demo/history/>

Follow the guide link. Expect `Static and dynamic imports succeeded; executions: 1`.
Return home and open the guide again: expect the execution count to increase.
Refresh the guide: expect success with the count reset to 1 in both modes.
The server includes history fallback so deep links also work.

The guide imports `./demo-module.js` and `../shared.js` from its Markdown
directory, which differs from the HTML entry URL in both modes.
