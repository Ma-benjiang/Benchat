"use client"

import { useEffect, useRef } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { MessageContent } from "@/components/message-content"
import { useChat } from "@/context/chat-context"

export function ChatMessages() {
  const { messages, isLoading } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold">Welcome to Claude</h1>
            <p className="text-md text-muted-foreground">
              Send a message to start a conversation
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6 max-w-3xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 mr-2 bg-muted text-muted-foreground avatar-circle">
                  <AvatarFallback>中</AvatarFallback>
                </Avatar>
              )}
              
              <div className="flex flex-col">
                {message.role === "assistant" && (
                  <span className="text-xs text-muted-foreground ml-1 mb-1">
                    中国的首都在哪里
                  </span>
                )}
                
                <div className={cn(
                  "max-w-[85%] px-4 py-2",
                  message.role === "user" 
                    ? "bg-primary text-primary-foreground chat-bubble-user" 
                    : "bg-muted chat-bubble-assistant"
                )}>
                  <MessageContent 
                    message={message}
                  />
                </div>
                
                {message.createdAt && (
                  <span className={cn(
                    "text-xs text-muted-foreground mt-1",
                    message.role === "user" ? "text-right mr-1" : "ml-1"
                  )}>
                    {new Intl.DateTimeFormat('zh-CN', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: false
                    }).format(message.createdAt)}
                  </span>
                )}
              </div>
              
              {message.role === "user" && (
                <Avatar className="h-8 w-8 ml-2 bg-primary text-primary-foreground avatar-circle">
                  <AvatarFallback>你</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start">
              <Avatar className="h-8 w-8 mr-2 bg-muted text-muted-foreground avatar-circle">
                <AvatarFallback>中</AvatarFallback>
              </Avatar>
              <div className="chat-bubble-assistant bg-muted px-4 py-2 text-sm">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-300 dark:bg-zinc-600 [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-300 dark:bg-zinc-600 [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-300 dark:bg-zinc-600"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  )
}
