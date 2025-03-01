"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { useUserConfig } from '@/context/user-config-context'

// 定义类型以确保类型安全
interface DebugInfo {
  timestamp: string;
  session: {
    exists: boolean;
    error?: string;
    expires_at?: number;
  };
  user: {
    id: string;
    email?: string;
  } | null;
  profile: {
    exists: boolean;
    error?: string;
    data: any;
  };
  storage: {
    bucket_exists: boolean;
    error?: string;
    bucket_data: any;
  };
  policies: any;
  config: {
    userName: string;
    userAvatar: string | null;
    userAvatarUrl: string;
  };
}

export function AuthDebugButton() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { config, refreshUserAvatar } = useUserConfig()
  
  const collectDebugInfo = async () => {
    setIsLoading(true)
    setDebugInfo(null)
    
    try {
      // 1. 检查会话
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      
      // 2. 检查用户资料
      let profileData = null
      let profileError: { message?: string } = {}
      
      if (sessionData?.session?.user?.id) {
        const userId = sessionData.session.user.id
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
          
        profileData = data
        profileError = error || {}
      }
      
      // 3. 检查存储桶
      let bucketData = null
      let bucketError: { message?: string } = {}
      
      try {
        const { data, error } = await supabase.storage.getBucket('user-uploads')
        bucketData = data
        bucketError = error || {}
      } catch (err: any) {
        bucketError = { message: err?.message || '未知错误' }
      }
      
      // 4. 检查存储权限
      let policiesData = null
      
      try {
        const { data } = await supabase
          .from('pg_policies')
          .select('*')
          .ilike('tablename', '%objects%')
        
        policiesData = data
      } catch (err) {
        // 忽略错误
      }
      
      // 整合调试信息
      const debug: DebugInfo = {
        timestamp: new Date().toISOString(),
        session: {
          exists: !!sessionData?.session,
          error: sessionError?.message,
          expires_at: sessionData?.session?.expires_at,
        },
        user: sessionData?.session?.user ? {
          id: sessionData.session.user.id,
          email: sessionData.session.user.email,
        } : null,
        profile: {
          exists: !!profileData,
          error: profileError?.message,
          data: profileData,
        },
        storage: {
          bucket_exists: !!bucketData,
          error: bucketError?.message,
          bucket_data: bucketData,
        },
        policies: policiesData,
        config: {
          userName: config.userName || '',
          userAvatar: config.userAvatar ? '[存在]' : null,
          userAvatarUrl: config.userAvatarUrl || '',
        }
      }
      
      setDebugInfo(debug)
      
      // 显示调试信息
      const infoText = `会话: ${debug.session.exists ? '有效' : '无效'}\n` +
        `用户ID: ${debug.user?.id || '未登录'}\n` +
        `用户资料: ${debug.profile.exists ? '存在' : '不存在'}\n` +
        `存储桶: ${debug.storage.bucket_exists ? '存在' : '不存在'}\n` +
        `头像URL: ${debug.config.userAvatarUrl || '未设置'}`;
      
      toast.info(infoText, { duration: 5000 });
    } catch (err: any) {
      console.error('收集调试信息时出错:', err)
      setDebugInfo(null)
      toast.error('收集调试信息失败: ' + (err?.message || '未知错误'))
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleRefreshAvatar = async () => {
    try {
      await refreshUserAvatar()
      toast.success('已尝试刷新头像')
      // 重新获取调试信息
      collectDebugInfo()
    } catch (err: any) {
      toast.error('刷新头像失败: ' + (err?.message || '未知错误'))
    }
  }
  
  // 直接提供一个按钮，点击时收集并显示诊断信息
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={collectDebugInfo}
      disabled={isLoading}
      className="w-full justify-start"
    >
      <span className="mr-2">🔍</span>
      <span>{isLoading ? '诊断中...' : '诊断工具'}</span>
    </Button>
  )
}
