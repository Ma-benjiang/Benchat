"use client"

import { useState, useEffect } from "react"
import { User, Mail, Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          // 未登录，重定向到登录页
          router.push("/login")
          return
        }
        
        setUserData(session.user)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-10">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 flex items-center gap-1"
        onClick={() => router.push("/chat")}
      >
        <ArrowLeft className="h-4 w-4" />
        <span>返回聊天</span>
      </Button>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl">个人资料</CardTitle>
            <CardDescription>
              查看和管理您的个人信息
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="mx-auto sm:mx-0">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="text-2xl">
                    {userData?.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="space-y-4 sm:flex-1">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    <span>用户 ID</span>
                  </div>
                  <div className="font-medium">{userData?.id}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    <span>电子邮箱</span>
                  </div>
                  <div className="font-medium">{userData?.email}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>注册时间</span>
                  </div>
                  <div className="font-medium">{formatDate(userData?.created_at)}</div>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="border-t bg-muted/50 px-6 py-4">
            <div className="text-sm text-muted-foreground">
              如需修改个人信息，请联系系统管理员
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
