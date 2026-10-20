chrome.storage.local.get({ enabled: true }, ({ enabled }) => {
  chrome.action.setBadgeText({ text: enabled ? 'ON' : 'OFF' });
  chrome.action.setBadgeBackgroundColor({ color: enabled ? '#1a7f37' : '#6e7781' });
});

chrome.action.onClicked.addListener(async () => {
  const { enabled } = await chrome.storage.local.get({ enabled: true });
  await chrome.storage.local.set({ enabled: !enabled });
  chrome.action.setBadgeText({ text: !enabled ? 'ON' : 'OFF' });
  chrome.action.setBadgeBackgroundColor({ color: !enabled ? '#1a7f37' : '#6e7781' });
});
