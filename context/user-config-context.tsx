"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";

type UserConfig = {
  userName: string;
  userAvatar: string | null;
  userAvatarUrl: string | null;
  assistantName: string;
  assistantAvatar: string | null;
};

type UserConfigContextType = {
  config: UserConfig;
  updateUserName: (name: string) => void;
  updateUserAvatar: (fileData: string, fileType: string) => Promise<string>;
  updateAssistantName: (name: string) => void;
  updateAssistantAvatar: (avatar: string) => void;
  resetConfig: () => void;
  refreshUserAvatar: () => Promise<void>;
};

const defaultConfig: UserConfig = {
  userName: 'Benjiang Ma',
  userAvatar: null,
  userAvatarUrl: null,
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
  const updateUserAvatar = async (fileData: string, fileType: string) => {
    try {
      // 获取当前会话，确认用户登录
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(`获取会话失败: ${sessionError.message}`);
      }
      
      if (!sessionData.session) {
        throw new Error('未找到有效会话，请先登录');
      }
      
      const userId = sessionData.session.user.id;
      
      // 准备文件上传
      // 从Base64字符串创建文件对象
      const base64Data = fileData.split(',')[1]; // 移除data:image/*;base64,前缀
      const byteCharacters = atob(base64Data);
      const byteArrays = [];
      
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      
      const blob = new Blob(byteArrays, { type: fileType });
      const file = new File([blob], `avatar.${fileType.split('/')[1]}`, { type: fileType });
      
      // 准备上传文件路径 - 确保路径格式为 {userId}/avatars/{timestamp}_avatar.{ext}
      // 这是关键修复：确保路径以userId开头，这样才能满足RLS策略要求
      const timestamp = Date.now();
      const fileExt = fileType.split('/')[1]; // 如 'image/png' -> 'png'
      const filePath = `${userId}/avatars/${timestamp}_avatar.${fileExt}`;
      
      console.log(`准备上传文件到路径: ${filePath}`);
      
      // 上传文件到存储桶
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        throw new Error(`文件上传失败: ${uploadError.message}`);
      }
      
      // 获取公开访问的URL
      const { data: publicURL } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(filePath);
      
      console.log('文件上传成功，公开URL:', publicURL.publicUrl);
      
      // 更新用户资料中的头像URL
      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicURL.publicUrl })
        .eq('id', userId);
      
      if (updateError) {
        console.error('更新用户资料失败，但文件已上传:', updateError);
      }
      
      // 更新本地状态
      const newConfig = {
        ...config,
        userAvatar: fileData, // 本地预览使用Base64
        userAvatarUrl: publicURL.publicUrl // 远程URL，用于持久化
      };
      
      setConfig(newConfig);
      localStorage.setItem('userConfig', JSON.stringify(newConfig));
      
      return publicURL.publicUrl;
    } catch (error) {
      console.error('上传头像时出错:', error);
      throw error;
    }
  };

  // 从服务器刷新用户头像
  const refreshUserAvatar = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        console.warn("刷新头像失败: 未找到有效会话");
        return;
      }
      
      const userId = sessionData.session.user.id;
      
      // 先尝试从profiles表获取头像URL
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', userId)
          .single();
        
        if (profileError) {
          console.error("获取用户资料失败:", profileError);
          // 继续执行，检查localStorage中是否有缓存
        } else if (profile?.avatar_url) {
          // 从服务器获取到有效的头像URL
          const newConfig = { ...config, userAvatarUrl: profile.avatar_url };
          setConfig(newConfig);
          localStorage.setItem('userConfig', JSON.stringify(newConfig));
          console.log("从服务器刷新头像成功:", profile.avatar_url);
          return;
        }
      } catch (error) {
        console.error("刷新头像时出错:", error);
        // 继续执行，检查localStorage中是否有缓存
      }
      
      // 如果没有从服务器获取到头像，尝试检查localStorage
      try {
        const savedConfig = getSavedConfig();
        if (savedConfig.userAvatarUrl) {
          console.log("使用localStorage中的头像URL:", savedConfig.userAvatarUrl);
          // 验证URL是否可访问
          fetch(savedConfig.userAvatarUrl, { method: 'HEAD' })
            .then(response => {
              if (response.ok) {
                // URL有效，使用localStorage中的URL
                if (config.userAvatarUrl !== savedConfig.userAvatarUrl) {
                  setConfig(prev => ({ ...prev, userAvatarUrl: savedConfig.userAvatarUrl }));
                }
              } else {
                console.warn("localStorage中的头像URL无效");
              }
            })
            .catch(() => {
              console.warn("无法验证localStorage中的头像URL");
            });
        }
      } catch (error) {
        console.error("检查localStorage头像时出错:", error);
      }
    } catch (error) {
      console.error("刷新头像失败:", error);
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
        resetConfig,
        refreshUserAvatar
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
      resetConfig: () => {},
      refreshUserAvatar: () => {}
    };
  }
  
  const context = useContext(UserConfigContext);
  if (context === undefined) {
    throw new Error('useUserConfig must be used within a UserConfigProvider');
  }
  return context;
}
