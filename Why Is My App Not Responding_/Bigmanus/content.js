/**
 * Copyright (c) 2026 Charles Kendrick. All Rights Reserved.
 * Lecture Me - Chrome Extension Content Script
 */

// Listen for keyboard shortcut (Ctrl+Shift+L) to quick-capture
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'L') {
    e.preventDefault();
    
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      // Send to background script
      chrome.runtime.sendMessage({
        action: 'saveNote',
        note: {
          text: selectedText,
          url: window.location.href,
          title: document.title,
          timestamp: new Date().toISOString()
        }
      }, (response) => {
        if (response && response.success) {
          // Show temporary notification on page
          showNotification('✓ Saved to Lecture Me!');
        }
      });
    }
  }
});

// Show temporary notification on page
function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%);
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 14px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
    z-index: 999999;
    animation: slideIn 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
