"use client"

import { useState, useEffect } from "react"
import { 
  MessageCircle, 
  ArrowRightLeft, 
  Menu, 
  X, 
  User, 
  Bot, 
  Moon, 
  Sun, 
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react"
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

// 定义模型类型
type ModelProvider = "OpenAI" | "Anthropic" | "Gemini" | "DeepSeek";
interface Model {
  provider: ModelProvider;
  name: string;
  feature?: string;
}

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [modelMenuOpen, setModelMenuOpen] = useState(false)
  const [currentModel, setCurrentModel] = useState<Model>({
    provider: "Anthropic", 
    name: "Claude 3.5 Sonnet"
  })

  // Set mounted state after first render
  useEffect(() => {
    setMounted(true)
  }, [])
  
  return (
    <ChatProvider>
      <ChatPageContent 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        mounted={mounted} 
        modelMenuOpen={modelMenuOpen} 
        setModelMenuOpen={setModelMenuOpen} 
        currentModel={currentModel} 
        setCurrentModel={setCurrentModel} 
      />
    </ChatProvider>
  )
}

function ChatPageContent({ 
  sidebarOpen, 
  setSidebarOpen, 
  mounted,
  modelMenuOpen,
  setModelMenuOpen,
  currentModel,
  setCurrentModel
}: { 
  sidebarOpen: boolean; 
  setSidebarOpen: (open: boolean) => void; 
  mounted: boolean;
  modelMenuOpen: boolean;
  setModelMenuOpen: (open: boolean) => void;
  currentModel: Model;
  setCurrentModel: (model: Model) => void;
}) {
  const { messages, currentConversationId } = useChat()
  const { setTheme, theme } = useTheme()
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  
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
      
      {/* 模型选择器 - 固定位置，添加响应式样式 */}
      <div className="fixed top-4 lg:left-80 left-20 z-50 hidden md:block">
        <DropdownMenu open={modelMenuOpen} onOpenChange={setModelMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 h-10 focus:outline-none">
              <div className="flex items-center">
                <span className="text-sm text-zinc-500">
                  {currentModel.provider}
                </span>
              </div>
              <span className="mx-1 text-xs text-zinc-400">/</span>
              <span className="text-sm font-medium">{currentModel.name}</span>
              <ChevronDown className="h-4 w-4 flex-shrink-0 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[600px] p-0 bg-amber-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm focus:outline-none ring-0 outline-none">
            {/* 模型列表 - 显示所有模型 */}
            <div className="p-6">
              {/* 水平展示模型厂商 */}
              <div className="grid grid-cols-4 gap-6">
                {/* OpenAI Models */}
                <div>
                  <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-4">OpenAI</div>
                  <div className="flex flex-col space-y-5">
                    <div 
                      className="cursor-pointer focus:outline-none ring-0 outline-none group"
                      onClick={() => {
                        setCurrentModel({provider: "OpenAI", name: "GPT-o3 mini"});
                        setModelMenuOpen(false);
                      }}
                    >
                      <div className="whitespace-nowrap flex items-center justify-between">
                        <span className={currentModel.provider === "OpenAI" && currentModel.name === "GPT-o3 mini" 
                          ? "text-zinc-900 dark:text-zinc-100 text-sm font-medium" 
                          : "text-zinc-600 dark:text-zinc-300 text-sm group-hover:text-zinc-900 dark:group-hover:text-zinc-100"}>
                          GPT-o3 mini
                        </span>
                      </div>
                    </div>
                    <div 
                      className="cursor-pointer focus:outline-none ring-0 outline-none group"
                      onClick={() => {
                        setCurrentModel({provider: "OpenAI", name: "GPT-o1 mini"});
                        setModelMenuOpen(false);
                      }}
                    >
                      <div className="whitespace-nowrap flex items-center justify-between">
                        <span className={currentModel.provider === "OpenAI" && currentModel.name === "GPT-o1 mini" 
                          ? "text-zinc-900 dark:text-zinc-100 text-sm font-medium" 
                          : "text-zinc-600 dark:text-zinc-300 text-sm group-hover:text-zinc-900 dark:group-hover:text-zinc-100"}>
                          GPT-o1 mini
                        </span>
                      </div>
                    </div>
                    <div 
                      className="cursor-pointer focus:outline-none ring-0 outline-none group"
                      onClick={() => {
                        setCurrentModel({provider: "OpenAI", name: "GPT-4o mini"});
                        setModelMenuOpen(false);
                      }}
                    >
                      <div className="whitespace-nowrap flex items-center justify-between">
                        <span className={currentModel.provider === "OpenAI" && currentModel.name === "GPT-4o mini" 
                          ? "text-zinc-900 dark:text-zinc-100 text-sm font-medium" 
                          : "text-zinc-600 dark:text-zinc-300 text-sm group-hover:text-zinc-900 dark:group-hover:text-zinc-100"}>
                          GPT-4o mini
                        </span>
                      </div>
                    </div>
                    <div 
                      className="cursor-pointer focus:outline-none ring-0 outline-none group"
                      onClick={() => {
                        setCurrentModel({provider: "OpenAI", name: "GPT-4o"});
                        setModelMenuOpen(false);
                      }}
                    >
                      <div className="whitespace-nowrap flex items-center justify-between">
                        <span className={currentModel.provider === "OpenAI" && currentModel.name === "GPT-4o" 
                          ? "text-zinc-900 dark:text-zinc-100 text-sm font-medium" 
                          : "text-zinc-600 dark:text-zinc-300 text-sm group-hover:text-zinc-900 dark:group-hover:text-zinc-100"}>
                          GPT-4o
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Anthropic Models */}
                <div>
                  <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-4">Anthropic</div>
                  <div className="flex flex-col space-y-5">
                    <div 
                      className="cursor-pointer focus:outline-none ring-0 outline-none group"
                      onClick={() => {
                        setCurrentModel({provider: "Anthropic", name: "Claude 3.5 Sonnet"});
                        setModelMenuOpen(false);
                      }}
                    >
                      <div className="whitespace-nowrap flex items-center justify-between">
                        <span className={currentModel.provider === "Anthropic" && currentModel.name === "Claude 3.5 Sonnet" 
                          ? "text-zinc-900 dark:text-zinc-100 text-sm font-medium" 
                          : "text-zinc-600 dark:text-zinc-300 text-sm group-hover:text-zinc-900 dark:group-hover:text-zinc-100"}>
                          Claude 3.5 Sonnet
                        </span>
                      </div>
                    </div>
                    <div 
                      className="cursor-pointer focus:outline-none ring-0 outline-none group"
                      onClick={() => {
                        setCurrentModel({provider: "Anthropic", name: "Claude 3.7 Sonnet"});
                        setModelMenuOpen(false);
                      }}
                    >
                      <div className="whitespace-nowrap flex items-center justify-between">
                        <span className={currentModel.provider === "Anthropic" && currentModel.name === "Claude 3.7 Sonnet" 
                          ? "text-zinc-900 dark:text-zinc-100 text-sm font-medium" 
                          : "text-zinc-600 dark:text-zinc-300 text-sm group-hover:text-zinc-900 dark:group-hover:text-zinc-100"}>
                          Claude 3.7 Sonnet
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Gemini Models */}
                <div>
                  <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-4">Gemini</div>
                  <div className="flex flex-col space-y-5">
                    <div 
                      className="cursor-pointer focus:outline-none ring-0 outline-none group"
                      onClick={() => {
                        setCurrentModel({provider: "Gemini", name: "Gemini 2.0 Flash"});
                        setModelMenuOpen(false);
                      }}
                    >
                      <div className="whitespace-nowrap flex items-center justify-between">
                        <span className={currentModel.provider === "Gemini" && currentModel.name === "Gemini 2.0 Flash" 
                          ? "text-zinc-900 dark:text-zinc-100 text-sm font-medium" 
                          : "text-zinc-600 dark:text-zinc-300 text-sm group-hover:text-zinc-900 dark:group-hover:text-zinc-100"}>
                          Gemini 2.0 Flash
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* DeepSeek Models */}
                <div>
                  <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-4">DeepSeek</div>
                  <div className="flex flex-col space-y-5">
                    <div 
                      className="cursor-pointer focus:outline-none ring-0 outline-none group"
                      onClick={() => {
                        setCurrentModel({provider: "DeepSeek", name: "DeepSeek R1"});
                        setModelMenuOpen(false);
                      }}
                    >
                      <div className="whitespace-nowrap flex items-center justify-between">
                        <span className={currentModel.provider === "DeepSeek" && currentModel.name === "DeepSeek R1" 
                          ? "text-zinc-900 dark:text-zinc-100 text-sm font-medium" 
                          : "text-zinc-600 dark:text-zinc-300 text-sm group-hover:text-zinc-900 dark:group-hover:text-zinc-100"}>
                          DeepSeek R1
                        </span>
                      </div>
                    </div>
                    <div 
                      className="cursor-pointer focus:outline-none ring-0 outline-none group"
                      onClick={() => {
                        setCurrentModel({provider: "DeepSeek", name: "DeepSeek V3"});
                        setModelMenuOpen(false);
                      }}
                    >
                      <div className="whitespace-nowrap flex items-center justify-between">
                        <span className={currentModel.provider === "DeepSeek" && currentModel.name === "DeepSeek V3" 
                          ? "text-zinc-900 dark:text-zinc-100 text-sm font-medium" 
                          : "text-zinc-600 dark:text-zinc-300 text-sm group-hover:text-zinc-900 dark:group-hover:text-zinc-100"}>
                          DeepSeek V3
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Sidebar */}
      <div
        className={cn(
          "h-screen z-50 flex w-72 flex-col bg-white dark:bg-zinc-950 shadow-sm border-r border-zinc-200 dark:border-zinc-800",
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
        <div className="border-t border-zinc-200 dark:border-zinc-800 px-4 py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full p-2 justify-start hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-amber-700 dark:text-zinc-300" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-sm text-zinc-800 dark:text-zinc-200">用户</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">user@example.com</span>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 border border-zinc-200 dark:border-zinc-700 shadow-sm bg-white dark:bg-zinc-950 rounded-lg focus:outline-none p-1">
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
          className="h-10 w-6 rounded-l-none rounded-r-md bg-white dark:bg-zinc-900 border-l-0 border-r-0 border-t-0 border-b-0"
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
        {/* Header - 恢复高度以适应模型选择器 */}
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
