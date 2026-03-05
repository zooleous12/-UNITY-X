/**
 * Unity Status Indicator
 * Shows connection status to Unity AI Ecosystem
 */

import React, { useState, useEffect } from 'react';
import { unityCore } from '@/services/unityCore';
import { Layers, Wifi, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const UnityStatusIndicator: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [coreUrl, setCoreUrl] = useState('');

  useEffect(() => {
    // Check initial status
    setIsConnected(unityCore.connected);
    setCoreUrl(unityCore.coreUrl);

    // Set up periodic status check
    const interval = setInterval(() => {
      setIsConnected(unityCore.connected);
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleReconnect = async () => {
    await unityCore.reconnect();
    setIsConnected(unityCore.connected);
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        <Layers className="w-4 h-4 text-purple-600" />
        <span className="text-sm font-medium text-gray-700">Unity</span>
      </div>
      
      {isConnected ? (
        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
          <Wifi className="w-3 h-3 mr-1" />
          Connected
        </Badge>
      ) : (
        <Badge 
          variant="secondary" 
          className="bg-gray-100 text-gray-600 border-gray-200 cursor-pointer hover:bg-gray-200"
          onClick={handleReconnect}
          title="Click to reconnect to Unity Core"
        >
          <WifiOff className="w-3 h-3 mr-1" />
          Standalone
        </Badge>
      )}
    </div>
  );
};