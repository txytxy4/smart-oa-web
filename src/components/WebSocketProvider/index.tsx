import React, { createContext, useContext, useEffect, useState } from 'react';
import wsService from '@/services/websocket';

interface WebSocketContextType {
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: React.ReactNode;
  wsUrl?: string;
}

const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ 
  children, 
  wsUrl = 'ws://localhost:3001/ws' 
}) => {
  const [isConnected, setIsConnected] = useState(false);

  const connect = async () => {
    try {
      // 更新WebSocket URL
      if (wsUrl !== wsService['url']) {
        wsService['url'] = wsUrl;
      }
      
      await wsService.connect();
      setIsConnected(true);
    } catch (error) {
      console.error('WebSocket连接失败:', error);
      setIsConnected(false);
    }
  };

  const disconnect = () => {
    wsService.disconnect();
    setIsConnected(false);
  };

  useEffect(() => {
    // 自动连接
    connect();

    // 监听连接状态变化
    const checkConnection = setInterval(() => {
      const connected = wsService.isConnected();
      if (connected !== isConnected) {
        setIsConnected(connected);
      }
    }, 1000);

    return () => {
      clearInterval(checkConnection);
      disconnect();
    };
  }, []);

  const value: WebSocketContextType = {
    isConnected,
    connect,
    disconnect,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
