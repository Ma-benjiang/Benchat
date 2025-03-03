"use client"

import * as React from "react"
import { SendHorizontal, StopCircle } from "lucide-react"
import TextareaAutosize from "react-textarea-autosize"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useChat } from "@/context/chat-context"
import { useUserConfig } from "@/context/user-config-context"

export function ChatInput() {
  const { sendMessage, currentConversationId, isLoading, conversations } = useChat()
  const { config } = useUserConfig()
  const [input, setInput] = React.useState("")
  const [isComposing, setIsComposing] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // 获取当前对话
  const currentConversation = conversations.find(c => c.id === currentConversationId);
  // 移除对模型的检查，只要有对话就可以输入
  const isInputEnabled = !!currentConversationId && !isLoading;
  
  console.log("聊天输入框状态:", { 
    currentConversationId, 
    modelId: currentConversation?.modelId,
    isInputEnabled,
    isLoading 
  });

  console.log("ChatInput组件中的头像URL:", config.userAvatar);

  React.useEffect(() => {
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
    if (e.key === "Enter" && !e.shiftKey && !isComposing && mounted) {
      if (isLoading || !isInputEnabled) return
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = () => {
    if (!input.trim() || isLoading || !isInputEnabled) return

    sendMessage(input)
    setInput("")
    
    // Focus textarea after sending
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 0)
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 mb-8">
      <div className="relative flex w-full items-center rounded-full border bg-background shadow-sm">
        <TextareaAutosize
          ref={textareaRef}
          tabIndex={0}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder={isInputEnabled ? "发送消息..." : "请先选择模型..."}
          className={cn(
            "flex-1 bg-transparent px-4 py-3 focus-visible:outline-none disabled:opacity-50 max-h-64 resize-none",
            (!currentConversationId || !isInputEnabled) && "opacity-50 cursor-not-allowed"
          )}
          value={input}
          disabled={!currentConversationId || isLoading || !isInputEnabled}
          autoFocus
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <Button
          type="button"
          size="icon"
          className="mr-2"
          disabled={!currentConversationId || isLoading || !input.trim() || !isInputEnabled}
          onClick={handleSend}
        >
          {isLoading ? (
            <StopCircle className="h-5 w-5" />
          ) : (
            <SendHorizontal className="h-5 w-5" />
          )}
          <span className="sr-only">发送</span>
        </Button>
      </div>
    </div>
  )
}
