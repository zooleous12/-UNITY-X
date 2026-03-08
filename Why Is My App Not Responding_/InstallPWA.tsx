/**
 * Copyright (c) 2026 Charles Kendrick. All Rights Reserved.
 */
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Check if user has dismissed before
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return; // Don't show again for 7 days
      }
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after 30 seconds of engagement
      setTimeout(() => {
        setShowPrompt(true);
      }, 30000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`[PWA] User ${outcome} the install prompt`);

    setDeferredPrompt(null);
    setShowPrompt(false);

    if (outcome === 'accepted') {
      localStorage.removeItem('pwa-install-dismissed');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (!showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg shadow-2xl p-4 z-50 animate-in slide-in-from-bottom-5">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-white/80 hover:text-white"
        aria-label="Dismiss"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663256154508/xvuKjKBIPltnINbK.png" alt="Lecture Me" className="w-12 h-12 rounded-lg" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">Install Lecture Me</h3>
          <p className="text-sm text-white/90 mb-3">
            Install our app for faster access, offline flashcard reviews, and a better experience!
          </p>
          
          <div className="flex gap-2">
            <Button
              onClick={handleInstall}
              className="bg-white text-purple-700 hover:bg-white/90 font-semibold"
            >
              Install App
            </Button>
            <Button
              onClick={handleDismiss}
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              Not Now
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/20">
        <div className="grid grid-cols-3 gap-2 text-xs text-white/80">
          <div className="text-center">
            <div className="font-semibold">📱</div>
            <div>Home Screen</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">⚡</div>
            <div>Faster Load</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">📴</div>
            <div>Works Offline</div>
          </div>
        </div>
      </div>
    </div>
  );
}
