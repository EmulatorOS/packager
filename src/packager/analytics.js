const PLAUSIBLE_API = process.env.PLAUSIBLE_API;
const PLAUSIBLE_DOMAIN = process.env.PLAUSIBLE_DOMAIN;
const enabled =
  PLAUSIBLE_API &&
  PLAUSIBLE_DOMAIN &&
  (location.protocol === 'http:' || location.protocol === 'https:') &&
  // once we deploy to the right domain we should also domain
  // location.hostname === PLAUSIBLE_DOMAIN &&
  navigator.doNotTrack !== '1';

const sendEvent = eventName => {
  setTimeout(() => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', PLAUSIBLE_API, true);
    xhr.setRequestHeader('Content-Type', 'text/plain');
    xhr.send(JSON.stringify({
      n: eventName,
      u: location.origin,
      d: PLAUSIBLE_DOMAIN,
      r: null
    }));
  });
};

if (enabled) {
  sendEvent('pageview');
}
