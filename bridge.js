// Isolated world: relays the stored toggle into the page (MAIN world) via DOM events.
const send = (on) => window.dispatchEvent(new CustomEvent('speculum:state', { detail: on }));
const sendStored = () => chrome.storage.local.get({ enabled: true }, ({ enabled }) => send(enabled));

sendStored();
window.addEventListener('speculum:request', sendStored);
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.enabled) send(changes.enabled.newValue);
});
