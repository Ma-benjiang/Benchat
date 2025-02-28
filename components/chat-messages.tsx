"use client"

import { useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
              className={cn("flex items-start gap-4", 
                message.role === "user" ? "justify-end" : ""
              )}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 border border-primary/10">
                  <AvatarImage src="/claude-avatar.png" />
                  <AvatarFallback>CL</AvatarFallback>
                </Avatar>
              )}
              
              <div className={cn(
                "rounded-lg p-4 max-w-[85%]",
                message.role === "user" 
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}>
                <MessageContent 
                  content={message.content}
                  isUser={message.role === "user"}
                />
              </div>
              
              {message.role === "user" && (
                <Avatar className="h-8 w-8 border border-primary/10">
                  <AvatarFallback>YOU</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-4">
              <Avatar className="h-8 w-8 border border-primary/10">
                <AvatarImage src="/claude-avatar.png" />
                <AvatarFallback>CL</AvatarFallback>
              </Avatar>
              <div className="rounded-lg bg-muted p-4 text-sm">
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
