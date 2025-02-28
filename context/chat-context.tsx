"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { uuid } from "@/lib/utils"

export type MessageContent = {
  type: "text"
  text: string
}

export type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: MessageContent[]
  createdAt: Date
  model?: string
}

export type Conversation = {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  modelId?: string
}

interface ChatContextType {
  conversations: Conversation[]
  currentConversationId: string | null
  messages: Message[]
  isLoading: boolean
  createNewConversation: () => void
  setCurrentConversationId: (id: string) => void
  sendMessage: (content: string) => Promise<void>
  deleteConversation: (id: string) => void
  updateConversationModel: (id: string, modelId: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Get current messages from current conversation
  const messages = currentConversationId 
    ? conversations.find(c => c.id === currentConversationId)?.messages || []
    : []

  // Initialize with a default conversation if none exists
  useEffect(() => {
    if (conversations.length === 0) {
      createNewConversation()
    } else if (!currentConversationId) {
      setCurrentConversationId(conversations[0].id)
    }
  }, [conversations])

  // Load conversations from local storage on mount
  useEffect(() => {
    const savedConversations = localStorage.getItem('benchat_conversations')
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations)
        // Convert date strings back to Date objects
        const formattedConversations = parsed.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            createdAt: new Date(msg.createdAt)
          }))
        }))
        setConversations(formattedConversations)
      } catch (error) {
        console.error('Failed to parse saved conversations', error)
      }
    }
  }, [])

  // Save conversations to local storage when they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('benchat_conversations', JSON.stringify(conversations))
    }
  }, [conversations])

  // Create a new conversation
  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: uuid(),
      title: "新对话",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    setConversations(prev => [newConversation, ...prev])
    setCurrentConversationId(newConversation.id)
  }

  // Update conversation model
  const updateConversationModel = (id: string, modelId: string) => {
    setConversations(prev => prev.map(conversation => {
      if (conversation.id === id) {
        return {
          ...conversation,
          modelId,
          updatedAt: new Date()
        }
      }
      return conversation
    }))
  }

  // Send a new message
  const sendMessage = async (content: string) => {
    if (!content.trim() || !currentConversationId) return
    
    const currentConversation = conversations.find(c => c.id === currentConversationId)
    if (!currentConversation) return

    // Create user message
    const userMessage: Message = {
      id: uuid(),
      role: "user",
      content: [{ type: "text", text: content.trim() }],
      createdAt: new Date()
    }
    
    // Update conversation with user message
    setConversations(prev => prev.map(conversation => {
      if (conversation.id === currentConversationId) {
        return {
          ...conversation,
          messages: [...conversation.messages, userMessage],
          updatedAt: new Date(),
          // Update title with first message if this is the first message
          title: conversation.messages.length === 0 
            ? content.length > 30 
              ? `${content.substring(0, 30)}...` 
              : content
            : conversation.title
        }
      }
      return conversation
    }))
    
    // Set loading state
    setIsLoading(true)
    
    try {
      // Simulate AI response (replace with actual API call in production)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate a response
      const responseContent = getAIResponse(content, currentConversation.modelId)
      
      // Create AI response message
      const assistantMessage: Message = {
        id: uuid(),
        role: "assistant",
        content: [{ type: "text", text: responseContent }],
        createdAt: new Date(),
        model: currentConversation.modelId
      }
      
      // Update conversation with AI response
      setConversations(prev => prev.map(conversation => {
        if (conversation.id === currentConversationId) {
          return {
            ...conversation,
            messages: [...conversation.messages, assistantMessage],
            updatedAt: new Date()
          }
        }
        return conversation
      }))
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Generate AI response based on user message and model
  const getAIResponse = (userMessage: string, modelId?: string): string => {
    const normalizedMessage = userMessage.toLowerCase()
    const modelName = modelId || "默认模型"
    
    if (normalizedMessage.includes("hello") || normalizedMessage.includes("hi") || normalizedMessage.includes("你好")) {
      return `你好！我是 BenChat${modelId ? ` (${modelId})` : ""}。我能回答你的问题、提供信息或者协助你完成任务。请告诉我你需要什么帮助？`
    } 
    
    if (normalizedMessage.includes("help") || normalizedMessage.includes("帮助")) {
      return `我是 BenChat${modelId ? ` (${modelId})` : ""}，你的AI助手。我可以帮助你回答问题、解释概念、提供信息、生成创意内容、编写代码等。只需告诉我你的需求，我会尽力提供帮助！`
    }
    
    if (normalizedMessage.includes("thank") || normalizedMessage.includes("谢谢")) {
      return "不客气！如果你还有其他问题或需要更多帮助，随时告诉我。"
    }
    
    if (normalizedMessage.includes("model") || normalizedMessage.includes("模型")) {
      return `我目前使用的是${modelId || "默认"}模型。BenChat支持多种AI模型，包括OpenAI的GPT系列、Anthropic的Claude系列以及Google的Gemini系列。你可以在设置中切换不同的模型或配置自定义模型。`
    }
    
    return `感谢你的消息！作为${modelName}，我很乐意帮助你解决这个问题。在完整实现中，我会根据你的具体需求提供详细且有帮助的回应。你想了解更多关于这个话题的信息吗？`
  }

  // Delete a conversation
  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conversation => conversation.id !== id))
    
    // If the deleted conversation was the current one, set the current to the first available conversation or null
    if (currentConversationId === id) {
      const remaining = conversations.filter(conversation => conversation.id !== id)
      setCurrentConversationId(remaining.length > 0 ? remaining[0].id : null)
    }
  }

  return (
    <ChatContext.Provider value={{
      conversations,
      currentConversationId,
      messages,
      isLoading,
      createNewConversation,
      setCurrentConversationId,
      sendMessage,
      deleteConversation,
      updateConversationModel
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
