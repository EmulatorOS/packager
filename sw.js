// These will be replaced at build-time by generate-service-worker-plugin.js
const ASSETS = ["","js/download-project.d6f411275499235a1d84.worker.js","js/sha256.52086ae4fb19cece366a.worker.js","assets/reset.80a6e1615fc013684ad8047dba5ce064.svg","assets/default-icon.290e09e569a1cab8e61ba93b0d23863f.png","js/vendors~icns~jszip.d8658d1ecc32bd70b3a6.js","js/icns.3dc4617807ae76701d6a.js","js/jszip.afd693160fea2da91e22.js","js/p4.796a8351e03a2a1b8047.js","js/packager-options-ui.14490c57974715b92a4c.js"];
const CACHE_NAME = "p4-160aa0bd088590e2bf05166d1249dc053e7cd970af4a253b4a473a6b39c930ae";
const IS_PRODUCTION = true;

const base = location.pathname.substr(0, location.pathname.indexOf('sw.js'));

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS.map(i => i === '' ? base : i))));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(i => i !== CACHE_NAME).map(i => caches.delete(i))))
  );
});

const fetchWithTimeout = (req) => new Promise((resolve, reject) => {
  const timeout = setTimeout(reject, 5000);
  fetch(req)
    .then((res) => {
      clearTimeout(timeout);
      resolve(res);
    })
    .catch((err) => {
      clearTimeout(timeout);
      reject(err);
    });
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;
  const relativePathname = url.pathname.substr(base.length);
  if (IS_PRODUCTION && ASSETS.includes(relativePathname)) {
    url.search = '';
    const immutable = !!relativePathname;
    if (immutable) {
      event.respondWith(
        caches.match(new Request(url)).then((res) => res || fetch(event.request))
      );
    } else {
      event.respondWith(
        fetchWithTimeout(event.request).catch(() => caches.match(new Request(url)))
      );
    }
  }
});
