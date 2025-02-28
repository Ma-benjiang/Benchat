"use client"

import { useState, useRef, useEffect } from "react"
import { SendHorizontal, MessageSquare } from "lucide-react"
import TextareaAutosize from "react-textarea-autosize"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useChat } from "@/context/chat-context"

export function ChatInput() {
  const { sendMessage, currentConversationId, isLoading } = useChat()
  const [input, setInput] = useState("")
  const [isComposing, setIsComposing] = useState(false)
  const [mounted, setMounted] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = () => {
    setIsComposing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = () => {
    if (!input.trim() || isLoading) return

    sendMessage(input)
    setInput("")
    
    // Focus textarea after sending
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 0)
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 mb-8">
      <div className="relative flex w-full items-center rounded-full border input-border-soft bg-background/70 backdrop-blur-sm shadow-sm">
        
        {/* Text input */}
        <div className="relative flex-1 flex items-center pl-4">
          <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground/60" />
          <TextareaAutosize
            ref={textareaRef}
            placeholder="请输入您的问题、文件上传支持拖拽、粘贴、抢拍"
            className={cn(
              "flex w-full resize-none border-0 bg-transparent py-3",
              "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "text-sm"
            )}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            disabled={isLoading}
            rows={1}
            maxRows={5}
          />
        </div>
        
        {/* Send button */}
        <Button
          type="button"
          onClick={handleSend}
          variant="ghost"
          size="sm"
          disabled={!input.trim() || isLoading}
          className="h-8 w-8 mr-2 rounded-full bg-transparent text-muted-foreground/70 hover:text-muted-foreground hover:bg-transparent"
        >
          {mounted ? (
            <SendHorizontal className={cn("h-4 w-4", isLoading && "animate-pulse")} />
          ) : (
            <div className="h-4 w-4" />
          )}
          <span className="sr-only">发送</span>
        </Button>
      </div>
    </div>
  )
}
