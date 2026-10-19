const showBadge = (on) => {
  chrome.action.setBadgeText({ text: on ? 'ON' : 'OFF' });
  chrome.action.setBadgeBackgroundColor({ color: on ? '#1a7f37' : '#6e7781' });
};

chrome.storage.local.get({ enabled: true }, ({ enabled }) => showBadge(enabled));

chrome.action.onClicked.addListener(async () => {
  const { enabled } = await chrome.storage.local.get({ enabled: true });
  await chrome.storage.local.set({ enabled: !enabled });
  showBadge(!enabled);
});
