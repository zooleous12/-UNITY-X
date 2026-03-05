
## 🎯 **Files to Upload to Your Production Lecture Me Pro**

This bundle contains all the Unity integration files I created for your Lecture Me Pro app.

---

## 📁 **FILE 1: client/src/components/UnityStatusIndicator.tsx**

```tsx
/**
 * Unity Status Indicator Component
 * Shows connection status to Unity AI Ecosystem
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Wifi, WifiOff, Activity } from 'lucide-react';

interface UnityStatus {
  connected: boolean;
  apps: {
    contextForge: boolean;
    chopShop: boolean;
    aiOrchestrator: boolean;
  };
  intelligence: {
    shared: number;
    received: number;
  };
}

export const UnityStatusIndicator: React.FC = () => {
  const [unityStatus, setUnityStatus] = useState<UnityStatus>({
    connected: false,
    apps: {
      contextForge: false,
      chopShop: false,
      aiOrchestrator: false
    },
    intelligence: {
      shared: 0,
      received: 0
    }
  });

  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check Unity Core connection
    const checkUnityConnection = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/status', {
          method: 'GET',
          mode: 'cors'
        });
        
        if (response.ok) {
          const data = await response.json();
          setUnityStatus({
            connected: true,
            apps: {
              contextForge: data.apps?.some((app: any) => app.id === 'context-forge' && app.status === 'online') || false,
              chopShop: data.apps?.some((app: any) => app.id === 'chop-shop-supreme' && app.status === 'online') || false,
              aiOrchestrator: data.apps?.some((app: any) => app.id === 'ai-orchestrator' && app.status === 'online') || false
            },
            intelligence: {
              shared: data.intelligence?.contextMemory || 0,
              received: data.intelligence?.knowledgeGraph || 0
            }
          });
        } else {
          setUnityStatus(prev => ({ ...prev, connected: false }));
        }
      } catch (error) {
        setUnityStatus(prev => ({ ...prev, connected: false }));
      }
    };

    // Check connection immediately and then every 30 seconds
    checkUnityConnection();
    const interval = setInterval(checkUnityConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  const connectedAppsCount = Object.values(unityStatus.apps).filter(Boolean).length;

  return (
    <div className="relative">
      {/* Main Status Indicator */}
      <motion.button
        onClick={() => setShowDetails(!showDetails)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all ${
          unityStatus.connected
            ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20'
            : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'