"use client"

import React, { useRef, useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { MessageContent } from "@/components/message-content"
import { useChat } from "@/context/chat-context"
import { useUserConfig } from "@/context/user-config-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RefreshCw, AlertCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ChatMessages() {
  const { messages, isLoading, error, regenerateResponse } = useChat()
  const { config } = useUserConfig();
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  // 确保组件只在客户端渲染
  useEffect(() => {
    setMounted(true)
  }, [])

  // 开发调试信息
  console.log("聊天消息组件中的用户配置:", config);
  console.log("头像URL:", config.userAvatar);

  // 当消息列表更新时，滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 如果未挂载（服务器端渲染），返回简单的占位符
  if (!mounted) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
        <div className="animate-pulse space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-16 w-full bg-gray-100 dark:bg-gray-800 rounded"></div>
            </div>
          </div>
          <div className="flex items-start gap-4 justify-end">
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 ml-auto bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-16 w-full bg-gray-100 dark:bg-gray-800 rounded"></div>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold">Welcome to Benchat</h1>
            <p className="text-md text-muted-foreground">
              Send a message to start a conversation
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex mb-10",
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              {message.role === "assistant" && (
                <div className="flex items-start chat-message-animation">
                  <Avatar className="h-12 w-12 mr-3 overflow-hidden rounded-full">
                    {config.assistantAvatar ? (
                      <AvatarImage src={config.assistantAvatar} alt={config.assistantName} />
                    ) : (
                      <AvatarFallback className="avatar-assistant-bg text-white font-bold">
                        {config.assistantName.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="avatar-name font-bold">{config.assistantName || "Benchat"}</span>
                      <div className="avatar-model-tag bg-slate-100 dark:bg-slate-800 rounded flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        DeepSeek R1
                      </div>
                    </div>
                    
                    <div className={cn(
                      "max-w-3xl px-6 py-4",
                      "bg-transparent dark:bg-transparent border-none text-zinc-800 dark:text-zinc-200 chat-bubble-assistant"
                    )}>
                      <MessageContent 
                        message={message}
                      />
                    </div>
                    
                    {message.createdAt && (
                      <span className="text-xs text-muted-foreground mt-1 ml-1">
                        {new Intl.DateTimeFormat('zh-CN', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: false
                        }).format(message.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {message.role === "user" && (
                <div className="flex items-start chat-message-animation flex-row-reverse">
                  <Avatar className="h-12 w-12 ml-3 overflow-hidden rounded-full">
                    {mounted && config.userAvatar ? (
                      <AvatarImage 
                        src={config.userAvatar} 
                        alt={config.userName} 
                        onError={(e) => {
                          console.error("头像加载失败", e);
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <AvatarFallback className="avatar-user-bg text-white font-bold">
                        {config.userName.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div className="flex flex-col items-end">
                    <div className="flex flex-row-reverse items-center gap-2 mb-2">
                      <span className="avatar-name font-bold">{config.userName}</span>
                      <div className="avatar-model-tag bg-slate-100 dark:bg-slate-800 rounded flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        DeepSeek R1
                      </div>
                    </div>
                    
                    <div className={cn(
                      "max-w-3xl px-6 py-4",
                      "bg-primary text-primary-foreground chat-bubble-user"
                    )}>
                      <MessageContent 
                        message={message}
                      />
                    </div>
                    
                    {message.createdAt && (
                      <span className="text-xs text-muted-foreground mt-1 mr-1">
                        {new Intl.DateTimeFormat('zh-CN', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: false
                        }).format(message.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start chat-message-animation">
              <Avatar className="h-12 w-12 mr-3 overflow-hidden rounded-full">
                {config.assistantAvatar ? (
                  <AvatarImage src={config.assistantAvatar} alt={config.assistantName} />
                ) : (
                  <AvatarFallback className="avatar-assistant-bg text-white font-bold">
                    {config.assistantName.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="avatar-name font-bold">{config.assistantName || "Benchat"}</span>
                  <div className="avatar-model-tag bg-slate-100 dark:bg-slate-800 rounded flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    DeepSeek R1
                  </div>
                </div>
                <div className="chat-bubble-assistant bg-muted dark:bg-muted/30 px-4 py-3 rounded-md">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-300 dark:bg-zinc-600 [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-300 dark:bg-zinc-600 [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-4" 
                  onClick={regenerateResponse}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Dismiss
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  )
}
