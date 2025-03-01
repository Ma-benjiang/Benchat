"use client"

import { useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { useUserConfig } from '@/context/user-config-context'

interface AuthRefreshProps {
  children: ReactNode;
}

/**
 * 会话检查和刷新组件
 * 用于确保用户登录状态保持有效，并在会话过期时提供刷新按钮
 */
export function AuthRefresh({ children }: AuthRefreshProps) {
  const [isSessionValid, setIsSessionValid] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()
  const { refreshUserAvatar } = useUserConfig()

  // 检查会话状态
  const checkSession = async () => {
    setIsChecking(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setIsSessionValid(!!session)
      
      // 如果没有会话，引导用户登录
      if (!session) {
        console.log('未检测到有效会话')
      } else {
        console.log('会话有效，用户已登录')
        // 会话有效时刷新头像
        await refreshUserAvatar()
      }
    } catch (error) {
      console.error("检查会话时出错:", error)
      setIsSessionValid(false)
    } finally {
      setIsChecking(false)
    }
  }

  // 初始检查会话
  useEffect(() => {
    checkSession()
    
    // 设置会话状态监听器
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSessionValid(!!session)
    })
    
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // 手动刷新会话
  const refreshSession = async () => {
    setIsRefreshing(true)
    try {
      // 尝试刷新会话
      const { data: { session }, error } = await supabase.auth.refreshSession()
      
      if (error) {
        throw error
      }
      
      if (session) {
        setIsSessionValid(true)
        toast.success('会话已刷新')
        await refreshUserAvatar()
      } else {
        // 如果刷新失败，需要重新登录
        toast.error('会话已过期，请重新登录')
        router.push('/login')
      }
    } catch (error) {
      console.error("刷新会话时出错:", error)
      toast.error('会话刷新失败，请重新登录')
    } finally {
      setIsRefreshing(false)
    }
  }

  // 重定向到登录页
  const goToLogin = () => {
    router.push('/login')
  }

  // 会话有效或正在检查时渲染子组件
  return (
    <>
      {(isSessionValid === false) && (
        <div className="fixed top-2 right-2 bg-red-100 p-2 rounded-md shadow z-50 flex gap-2 items-center">
          <span className="text-sm text-red-700">登录会话已过期</span>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={refreshSession}
            disabled={isRefreshing}
          >
            {isRefreshing ? '正在刷新...' : '刷新会话'}
          </Button>
          <Button 
            size="sm"
            variant="destructive"
            onClick={goToLogin}
          >
            重新登录
          </Button>
        </div>
      )}
      {children}
    </>
  )
}
