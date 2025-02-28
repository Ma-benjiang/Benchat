"use client"

import { useState, useEffect } from "react"
import { Menu, X, User, Bot, Moon, Sun, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ConversationsList } from "@/components/conversations-list"
import { ChatInput } from "@/components/chat-input"
import { MessageContent } from "@/components/message-content"
import { useChat } from "@/context/chat-context"
import { ChatProvider } from "@/context/chat-context"
import { ModeToggle } from "@/components/mode-toggle"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase"

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Set mounted state after first render
  useEffect(() => {
    setMounted(true)
  }, [])
  
  return (
    <ChatProvider>
      <ChatPageContent sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} mounted={mounted} />
    </ChatProvider>
  )
}

function ChatPageContent({ 
  sidebarOpen, 
  setSidebarOpen, 
  mounted 
}: { 
  sidebarOpen: boolean; 
  setSidebarOpen: (open: boolean) => void; 
  mounted: boolean;
}) {
  const { messages, currentConversationId } = useChat()
  const { setTheme, theme } = useTheme()
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [modelMenuOpen, setModelMenuOpen] = useState(false)
  const [currentModel, setCurrentModel] = useState({
    provider: "Anthropic",
    name: "Claude 3 Opus"
  })
  
  // 获取用户数据
  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          setUserData(session.user)
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      }
    }
    
    if (mounted) {
      getUserData()
    }
  }, [mounted])
  
  // 获取用户名首字母作为头像占位符
  const getUserInitial = () => {
    if (!userData || !userData.email) return "U"
    return userData.email.charAt(0).toUpperCase()
  }
  
  // 从用户邮箱获取用户名（取 @ 前面的部分）
  const getUserName = () => {
    if (!userData || !userData.email) return "用户"
    return userData.email.split('@')[0]
  }
  
  return (
    <div className="flex h-screen bg-white dark:bg-zinc-900">
      {/* Backdrop for mobile - closes sidebar when clicked */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* 移动端侧边栏开启按钮 */}
      <Button
        onClick={() => setSidebarOpen(true)}
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">打开侧边栏</span>
      </Button>
      
      {/* 模型选择器 */}
      <div className="fixed top-4 right-4 z-50">
        <DropdownMenu open={modelMenuOpen} onOpenChange={setModelMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 w-auto hover:bg-transparent">
              <span className="font-medium">{currentModel.provider} {currentModel.name}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 border border-zinc-200 dark:border-zinc-700 shadow-sm bg-background rounded-lg">
            <DropdownMenuItem 
              onClick={() => {
                setCurrentModel({provider: "Anthropic", name: "Claude 3 Opus"});
                setModelMenuOpen(false);
              }}
              className="flex items-center justify-between"
            >
              <span>Anthropic Claude 3 Opus</span>
              {currentModel.provider === "Anthropic" && currentModel.name === "Claude 3 Opus" && (
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => {
                setCurrentModel({provider: "Anthropic", name: "Claude 3 Sonnet"});
                setModelMenuOpen(false);
              }}
              className="flex items-center justify-between"
            >
              <span>Anthropic Claude 3 Sonnet</span>
              {currentModel.provider === "Anthropic" && currentModel.name === "Claude 3 Sonnet" && (
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => {
                setCurrentModel({provider: "Anthropic", name: "Claude 3 Haiku"});
                setModelMenuOpen(false);
              }}
              className="flex items-center justify-between"
            >
              <span>Anthropic Claude 3 Haiku</span>
              {currentModel.provider === "Anthropic" && currentModel.name === "Claude 3 Haiku" && (
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Sidebar */}
      <div
        className={cn(
          "h-screen z-50 flex w-72 flex-col bg-white dark:bg-zinc-950 shadow-md",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "transition-transform duration-200 ease-in-out",
          "fixed inset-y-0 left-0"
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-4 h-16">
          <div className="flex items-center gap-2">
            <div className="text-primary font-bold text-xl">BenChat</div>
          </div>
          <Button
            onClick={() => setSidebarOpen(false)}
            variant="ghost"
            size="icon"
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">关闭侧边栏</span>
          </Button>
        </div>
        
        {/* Sidebar content */}
        <div className="flex-1 overflow-hidden">
          <ConversationsList />
        </div>
        
        {/* Sidebar footer with avatar and username */}
        <div className="border-t px-4 py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground mr-2">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium">用户</span>
                    <span className="text-xs text-muted-foreground">user@example.com</span>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 border border-zinc-200 dark:border-zinc-700 shadow-sm bg-background rounded-lg">
              <DropdownMenuItem onClick={() => router.push('/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>个人中心</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                {mounted && theme === 'dark' ? (
                  <Sun className="mr-2 h-4 w-4" />
                ) : (
                  <Moon className="mr-2 h-4 w-4" />
                )}
                <span>{mounted && theme === 'dark' ? '浅色模式' : '深色模式'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Toggle sidebar button - positioned at middle right edge of sidebar */}
      <div 
        className={cn(
          "fixed top-1/2 -translate-y-1/2 z-50 transition-transform duration-200 ease-in-out",
          sidebarOpen ? "left-72" : "left-0"
        )}
      >
        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          variant="outline"
          size="icon"
          className="h-10 w-6 rounded-l-none rounded-r-md bg-white dark:bg-zinc-900 border-l-0"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <span className="sr-only">切换侧边栏</span>
        </Button>
      </div>
      
      {/* Main content */}
      <div className={cn(
        "flex-1 flex flex-col relative transition-all duration-200 ease-in-out",
        sidebarOpen ? "lg:pl-72" : ""
      )}>
        {/* Header */}
        <div className="h-16"></div>
        
        {/* Messages container */}
        <div className="flex-1 overflow-auto px-4">
          <div className="mx-auto max-w-3xl space-y-4 pt-4 pb-20">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[60vh] space-y-4">
                <div className="rounded-full bg-primary/10 p-4">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-center">欢迎使用 BenChat</h1>
                <p className="text-center text-muted-foreground max-w-md">
                  BenChat 是一个聊天助手，可以帮助您回答问题、提供建议或者进行创意写作
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <MessageContent key={index} message={message} />
              ))
            )}
          </div>
        </div>
        
        {/* Chat input */}
        <div className="p-4">
          <div className="mx-auto max-w-3xl">
            <ChatInput />
          </div>
        </div>
      </div>
    </div>
  )
}
