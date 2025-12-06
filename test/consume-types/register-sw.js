// This whole thing is ugly. It is only so that we can fix improper import
// statements in libraries from node_modules. See sw.js for how we re-map the
// import URLs.
// The convoluted code here is so that we will force the app to use a new
// service worker if in dev mode we update the service worker code in sw.js

let reloadQueued = false;
function queueReload() {
  if (reloadQueued) {
    return;
  }
  reloadQueued = true;
  // Use location.reload() after a so any late controllerchange still settles.
  window.location.reload();
}

// Register first.
const registration = await navigator.serviceWorker.register('/sw.js', {
  scope: '/',
  type: 'module',
  updateViaCache: 'none',
});

// If there is already a waiting worker, wait for it to claim this client.
if (registration.waiting) {
  const sw = registration.waiting;

  await new Promise(resolve => {
    sw.addEventListener('statechange', () => {
      // Wait until activated.
      if (sw.state === 'activated') {
        if (sw === navigator.serviceWorker.controller) {
          resolve(void 0);
        } else {
          // If the new SW activated but is not controlling yet, it changed? Not sure if this can actuall happen.
          queueReload();
        }
      }
    });
  });
}

if (navigator.serviceWorker.controller) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    queueReload();
  });
} else {
  // First-ever load: wait for controllerchange
  await new Promise(resolve => {
    navigator.serviceWorker.addEventListener('controllerchange', resolve, {
      once: true,
    });
  });
}

// Track new installs.
registration.addEventListener('updatefound', () => {
  const sw = registration.installing;
  if (!sw) {
    return;
  }
  sw.addEventListener('statechange', () => {
    // When installed AND there is already a controller, a reload will let new SW control.
    if (sw.state === 'installed' && navigator.serviceWorker.controller) {
      // If skipWaiting ran inside new SW, controllerchange may fire soon; still queue.
      queueReload();
    }
  });
});

// Force update check after listeners.
// For purposes of testing the example, force update on page load so we
// always test the latest service worker.
await registration.update();

// Wait until there is an active worker (first load).
await navigator.serviceWorker.ready;

if (reloadQueued) {
  await new Promise(() => {});
}
console.log(
  'Service worker ready and controlling. Continue app bootstrap here.',
);

export {};
