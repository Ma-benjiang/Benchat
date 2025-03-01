"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';

type UserConfig = {
  userName: string;
  userAvatar: string | null;
  assistantName: string;
  assistantAvatar: string | null;
};

type UserConfigContextType = {
  config: UserConfig;
  updateUserName: (name: string) => void;
  updateUserAvatar: (avatar: string) => void;
  updateAssistantName: (name: string) => void;
  updateAssistantAvatar: (avatar: string) => void;
  resetConfig: () => void;
};

const defaultConfig: UserConfig = {
  userName: 'Benjiang Ma',
  userAvatar: null,
  assistantName: 'Benchat',
  assistantAvatar: null,
};

const UserConfigContext = createContext<UserConfigContextType | undefined>(undefined);

// 在组件外部定义此函数，不要在每次渲染时重新创建
function getSavedConfig(): UserConfig {
  if (typeof window === 'undefined') {
    return defaultConfig;
  }

  try {
    const savedConfig = localStorage.getItem('userConfig');
    if (savedConfig) {
      return JSON.parse(savedConfig);
    }
  } catch (e) {
    console.error('Failed to parse saved user config:', e);
  }
  return defaultConfig;
}

export function UserConfigProvider({ children }: { children: React.ReactNode }) {
  // 服务器端渲染时，直接返回children，避免任何不必要的状态初始化
  if (typeof window === 'undefined') {
    return <>{children}</>;
  }

  const [config, setConfig] = useState<UserConfig>(() => getSavedConfig());

  // 当组件首次加载时，确保加载最新的本地存储配置
  useEffect(() => {
    const savedConfig = getSavedConfig();
    setConfig(savedConfig);
    
    // 添加storage事件监听，当本地存储变化时更新配置
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userConfig' && e.newValue) {
        try {
          const newConfig = JSON.parse(e.newValue);
          setConfig(newConfig);
        } catch (err) {
          console.error('Failed to parse updated config:', err);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 保存配置到localStorage
  useEffect(() => {
    localStorage.setItem('userConfig', JSON.stringify(config));
  }, [config]);

  // 更新用户名
  const updateUserName = (name: string) => {
    setConfig(prev => ({ ...prev, userName: name }));
  };

  // 更新用户头像
  const updateUserAvatar = (avatar: string) => {
    console.log("更新用户头像:", avatar);
    const newConfig = { ...config, userAvatar: avatar };
    setConfig(newConfig);
    
    // 同步更新到localStorage
    try {
      localStorage.setItem('userConfig', JSON.stringify(newConfig));
      console.log("localStorage更新成功");
    } catch (e) {
      console.error("localStorage更新失败:", e);
    }
  };

  // 更新助手名称
  const updateAssistantName = (name: string) => {
    setConfig(prev => ({ ...prev, assistantName: name }));
  };

  // 更新助手头像
  const updateAssistantAvatar = (avatar: string) => {
    setConfig(prev => ({ ...prev, assistantAvatar: avatar }));
  };
  
  // 重置配置到默认值
  const resetConfig = () => {
    localStorage.removeItem('userConfig');
    setConfig(defaultConfig);
  };

  return (
    <UserConfigContext.Provider
      value={{
        config,
        updateUserName,
        updateUserAvatar,
        updateAssistantName,
        updateAssistantAvatar,
        resetConfig
      }}
    >
      {children}
    </UserConfigContext.Provider>
  );
}

export function useUserConfig() {
  // 服务器端渲染时，返回默认配置
  if (typeof window === 'undefined') {
    return {
      config: defaultConfig,
      updateUserName: () => {},
      updateUserAvatar: () => {},
      updateAssistantName: () => {},
      updateAssistantAvatar: () => {},
      resetConfig: () => {}
    };
  }
  
  const context = useContext(UserConfigContext);
  if (context === undefined) {
    throw new Error('useUserConfig must be used within a UserConfigProvider');
  }
  return context;
}
