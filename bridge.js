// Isolated world: the page (MAIN world) can't read chrome.storage, so relay the toggle via DOM events.
chrome.storage.local.get({ enabled: true }, ({ enabled }) => {
  window.dispatchEvent(new CustomEvent('speculum:state', { detail: enabled }));
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    window.dispatchEvent(new CustomEvent('speculum:state', { detail: changes.enabled.newValue }));
  }
});
