/**
 * Copyright (c) 2026 Charles Kendrick. All Rights Reserved.
 * Lecture Me - Chrome Extension Background Service Worker
 */

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'saveTo LectureMe',
    title: 'Save to Lecture Me',
    contexts: ['selection']
  });
  
  chrome.contextMenus.create({
    id: 'captureImage',
    title: 'Capture Image to Lecture Me',
    contexts: ['image']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'saveToLectureMe') {
    // Save selected text
    const note = {
      text: info.selectionText,
      url: info.pageUrl,
      title: tab.title,
      timestamp: new Date().toISOString()
    };
    
    chrome.storage.local.get(['notes'], (result) => {
      const notes = result.notes || [];
      notes.unshift(note);
      chrome.storage.local.set({ notes });
      
      // Show notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Lecture Me',
        message: 'Text saved successfully!'
      });
    });
  } else if (info.menuItemId === 'captureImage') {
    // Save image URL
    const note = {
      text: `Image: ${info.srcUrl}`,
      url: info.pageUrl,
      title: tab.title,
      imageUrl: info.srcUrl,
      timestamp: new Date().toISOString()
    };
    
    chrome.storage.local.get(['notes'], (result) => {
      const notes = result.notes || [];
      notes.unshift(note);
      chrome.storage.local.set({ notes });
      
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Lecture Me',
        message: 'Image captured successfully!'
      });
    });
  }
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveNote') {
    chrome.storage.local.get(['notes'], (result) => {
      const notes = result.notes || [];
      notes.unshift(request.note);
      chrome.storage.local.set({ notes }, () => {
        sendResponse({ success: true });
      });
    });
    return true; // Keep channel open for async response
  }
});
