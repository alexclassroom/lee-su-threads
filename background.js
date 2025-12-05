// Background service worker for Threads Profile Info Extractor

const USER_ID_CACHE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days for user ID mapping

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PROFILE_INFO_EXTRACTED') {
    console.log('[Threads Extractor] Profile info received:', message.data);

    // Store the profile info
    chrome.storage.local.get(['profileCache'], (result) => {
      const cache = result.profileCache || {};
      const username = message.data.username;
      if (username) {
        cache[username] = {
          ...message.data,
          timestamp: Date.now()
        };
        chrome.storage.local.set({ profileCache: cache });
      }
    });
  }

  if (message.type === 'GET_CACHED_PROFILES') {
    chrome.storage.local.get(['profileCache'], (result) => {
      sendResponse(result.profileCache || {});
    });
    return true; // Keep channel open for async response
  }

  // Store user ID mappings (username -> userId)
  if (message.type === 'STORE_USER_IDS') {
    const userIds = message.data; // { username: userId, ... }
    chrome.storage.local.get(['userIdCache'], (result) => {
      const cache = result.userIdCache || {};
      const now = Date.now();
      for (const [username, userId] of Object.entries(userIds)) {
        if (!cache[username]) {
          cache[username] = { userId, timestamp: now };
        }
      }
      chrome.storage.local.set({ userIdCache: cache });
    });
  }

  // Get cached user IDs
  if (message.type === 'GET_USER_ID_CACHE') {
    chrome.storage.local.get(['userIdCache'], (result) => {
      sendResponse(result.userIdCache || {});
    });
    return true;
  }
});

// Clean up old cache entries on startup
chrome.runtime.onStartup.addListener(() => {
  const now = Date.now();
  const profileMaxAge = 24 * 60 * 60 * 1000; // 24 hours for profiles

  // Clean profile cache
  chrome.storage.local.get(['profileCache'], (result) => {
    const cache = result.profileCache || {};
    const cleanedCache = {};
    for (const [username, data] of Object.entries(cache)) {
      if (now - data.timestamp < profileMaxAge) {
        cleanedCache[username] = data;
      }
    }
    chrome.storage.local.set({ profileCache: cleanedCache });
  });

  // Clean user ID cache (30 days)
  chrome.storage.local.get(['userIdCache'], (result) => {
    const cache = result.userIdCache || {};
    const cleanedCache = {};
    for (const [username, data] of Object.entries(cache)) {
      if (now - data.timestamp < USER_ID_CACHE_MAX_AGE) {
        cleanedCache[username] = data;
      }
    }
    chrome.storage.local.set({ userIdCache: cleanedCache });
  });
});
