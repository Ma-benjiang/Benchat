"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'
import { useUserConfig } from '@/context/user-config-context'

// 创建会话上下文
const SessionContext = createContext<{
  session: Session | null
  isLoading: boolean
}>({
  session: null,
  isLoading: true
})

// 导出会话上下文的Hook
export const useSession = () => useContext(SessionContext)

// Supabase会话提供者组件
export default function SupabaseSessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { refreshUserAvatar } = useUserConfig()

  useEffect(() => {
    // 初始化时获取当前会话
    const initSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error('获取会话失败:', error)
        }
        setSession(data.session)
        
        // 如果存在会话，刷新用户头像
        if (data.session) {
          refreshUserAvatar()
        }
      } catch (error) {
        console.error('初始化会话时出错:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initSession()

    // 监听认证状态变化
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('认证状态变化:', event)
        setSession(newSession)
        
        // 当用户登录或令牌刷新时，刷新头像
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          refreshUserAvatar()
        }
      }
    )

    // 清理订阅
    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [refreshUserAvatar])

  return (
    <SessionContext.Provider value={{ session, isLoading }}>
      {children}
    </SessionContext.Provider>
  )
}
