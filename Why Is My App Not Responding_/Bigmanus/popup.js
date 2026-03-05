/**
 * Copyright (c) 2026 Charles Kendrick. All Rights Reserved.
 * Lecture Me - Chrome Extension Popup
 */

const API_BASE_URL = 'https://3000-iv0194q9xal8c58ohl3bp-79652c32.us2.manus.computer';

// DOM elements
const noteText = document.getElementById('noteText');
const saveNoteBtn = document.getElementById('saveNote');
const clearNoteBtn = document.getElementById('clearNote');
const captureSelectionBtn = document.getElementById('captureSelection');
const captureTabBtn = document.getElementById('captureTab');
const openDashboardBtn = document.getElementById('openDashboard');
const openUploadBtn = document.getElementById('openUpload');
const statusDiv = document.getElementById('status');

// Show status message
function showStatus(message, type = 'success') {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  setTimeout(() => {
    statusDiv.className = 'status';
  }, 3000);
}

// Save note to Lecture Me
async function saveNote() {
  const text = noteText.value.trim();
  if (!text) {
    showStatus('Please enter some text', 'error');
    return;
  }

  try {
    // Get current tab info for context
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Save to local storage for now (in production, this would call the API)
    const note = {
      text,
      url: tab.url,
      title: tab.title,
      timestamp: new Date().toISOString()
    };
    
    // Store in chrome.storage
    chrome.storage.local.get(['notes'], (result) => {
      const notes = result.notes || [];
      notes.unshift(note);
      chrome.storage.local.set({ notes }, () => {
        showStatus('✓ Saved to Lecture Me!', 'success');
        noteText.value = '';
      });
    });
    
  } catch (error) {
    console.error('Error saving note:', error);
    showStatus('Failed to save note', 'error');
  }
}

// Capture selected text from page
async function captureSelection() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection().toString()
    }, (results) => {
      if (results && results[0] && results[0].result) {
        noteText.value = results[0].result;
        showStatus('✓ Selection captured!', 'success');
      } else {
        showStatus('No text selected', 'error');
      }
    });
  } catch (error) {
    console.error('Error capturing selection:', error);
    showStatus('Failed to capture selection', 'error');
  }
}

// Capture tab title and URL
async function captureTab() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    noteText.value = `${tab.title}\n${tab.url}`;
    showStatus('✓ Tab info captured!', 'success');
  } catch (error) {
    console.error('Error capturing tab:', error);
    showStatus('Failed to capture tab', 'error');
  }
}

// Open Lecture Me dashboard
function openDashboard() {
  chrome.tabs.create({ url: `${API_BASE_URL}/dashboard` });
}

// Open upload page
function openUpload() {
  chrome.tabs.create({ url: `${API_BASE_URL}/upload/audio` });
}

// Event listeners
saveNoteBtn.addEventListener('click', saveNote);
clearNoteBtn.addEventListener('click', () => {
  noteText.value = '';
  showStatus('Cleared', 'success');
});
captureSelectionBtn.addEventListener('click', captureSelection);
captureTabBtn.addEventListener('click', captureTab);
openDashboardBtn.addEventListener('click', openDashboard);
openUploadBtn.addEventListener('click', openUpload);

// Load saved note on open (if any)
chrome.storage.local.get(['draftNote'], (result) => {
  if (result.draftNote) {
    noteText.value = result.draftNote;
  }
});

// Auto-save draft
noteText.addEventListener('input', () => {
  chrome.storage.local.set({ draftNote: noteText.value });
});
