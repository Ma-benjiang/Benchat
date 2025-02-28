"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { ChatProvider, useChat } from "@/context/chat-context"
import { ChatPage } from "../page"

// 创建一个内部组件，它将在 ChatProvider 内部使用 useChat
function ChatWithIdContent() {
  const params = useParams()
  const { setCurrentConversationId, conversations } = useChat()
  const id = params.id as string

  // 使用 useEffect 设置当前会话 ID
  useEffect(() => {
    // Check if the conversation with this ID exists
    const conversationExists = conversations.some(conv => conv.id === id)
    
    if (id && conversationExists) {
      console.log("从 URL 设置当前对话:", id);
      // Set the current conversation to the one specified in the URL
      setCurrentConversationId(id)
    }
    // 只在 id 或 conversations 变化时运行，避免不必要的重新渲染
  }, [id, conversations])

  // 重用主 ChatPage 组件
  return <ChatPage />
}

export default function ChatWithId() {
  // 直接返回带有 ChatProvider 的组件
  return (
    <ChatProvider>
      <ChatWithIdContent />
    </ChatProvider>
  )
}
