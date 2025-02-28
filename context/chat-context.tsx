"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { uuid } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { supabase, createConversation, deleteConversation as deleteConversationFromSupabase } from "@/lib/supabase"

// Get API key from environment
const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '';
let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:8080';

// Ensure site URL has http/https prefix
if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
  siteUrl = `http://${siteUrl}`;
}

// Debug environment variables (safe partial display for security)
console.log("API Key Available:", apiKey ? `${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 4)}` : "Not found");
console.log("Site URL:", siteUrl);

// Map frontend model names to OpenRouter model identifiers
const modelMapping: Record<string, string> = {
  "GPT-o3 mini": "openai/gpt-3.5-turbo",
  "GPT-o1 mini": "openai/o1-mini",
  "GPT-4o mini": "openai/gpt-4o-mini",
  "GPT-4o": "openai/gpt-4o",
  "Claude 3.5 Sonnet": "anthropic/claude-3.5-sonnet",
  "Claude 3.7 Sonnet": "anthropic/claude-3.7-sonnet",
  "Gemini 2.0 Flash": "google/gemini-2.0-flash-001",
  "DeepSeek R1": "deepseek/deepseek-r1",
  "DeepSeek V3": "deepseek/deepseek-chat",
};

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
  error: string | null
  resetError: () => void
  createNewConversation: () => Promise<string>
  setCurrentConversationId: (id: string) => void
  sendMessage: (content: string) => Promise<void>
  deleteConversation: (id: string) => void
  updateConversationModel: (id: string, modelId: string) => void
  availableModels: string[]
  selectModel: (id: string, modelId: string) => void
}

// Default value required by TypeScript
const defaultContext: ChatContextType = {
  conversations: [],
  currentConversationId: null,
  messages: [],
  isLoading: false,
  error: null,
  resetError: () => { },
  createNewConversation: async () => { return '' },
  setCurrentConversationId: () => { },
  sendMessage: async () => { },
  deleteConversation: () => { },
  updateConversationModel: () => { },
  availableModels: [],
  selectModel: () => { }
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Get current messages from current conversation
  const messages = currentConversationId 
    ? conversations.find(c => c.id === currentConversationId)?.messages || []
    : []

  // Initialize with a default conversation if none exists
  useEffect(() => {
    // 检查当前 URL 是否已经包含对话 ID
    const currentPath = window.location.pathname;
    const chatIdMatch = currentPath.match(/^\/chat\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i);
    const urlHasChatId = !!chatIdMatch;
    
    // 只在组件首次加载后，本地存储加载完成后运行此逻辑
    const initializeConversation = () => {
      // 如果 URL 中已经有对话 ID，则不创建新对话
      if (urlHasChatId) {
        console.log("URL 中已有对话 ID，不创建新对话");
        return;
      }
      
      if (conversations.length === 0) {
        console.log("没有对话，创建新对话");
        createNewConversation();
      } else if (!currentConversationId) {
        console.log("有对话但没有当前对话ID，设置第一个对话为当前对话");
        setCurrentConversationId(conversations[0].id);
      }
    };

    // 添加一个小延迟，确保本地存储的对话已经加载完成
    const timer = setTimeout(initializeConversation, 100);
    return () => clearTimeout(timer);
  }, [conversations.length, currentConversationId]);

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
        console.log("从本地存储加载对话", { count: formattedConversations.length });
        setConversations(formattedConversations)
        
        // 尝试加载上次使用的对话ID
        const lastConversationId = localStorage.getItem('benchat_current_conversation_id');
        if (lastConversationId && formattedConversations.some((c: Conversation) => c.id === lastConversationId)) {
          console.log("恢复上次使用的对话", { id: lastConversationId });
          setCurrentConversationId(lastConversationId);
        } else if (formattedConversations.length > 0) {
          console.log("使用第一个对话", { id: formattedConversations[0].id });
          setCurrentConversationId(formattedConversations[0].id);
        }
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

  // Save current conversation ID when it changes
  useEffect(() => {
    if (currentConversationId) {
      console.log("保存当前对话ID", { id: currentConversationId });
      localStorage.setItem('benchat_current_conversation_id', currentConversationId);
    }
  }, [currentConversationId]);

  // Create a new conversation
  const createNewConversation = async (): Promise<string> => {
    const id = uuid()
    
    console.log("创建新对话", { id });
    
    const newConversation: Conversation = {
      id,
      title: "新对话",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      modelId: "deepseek/deepseek-chat" // 设置默认模型为 DeepSeek V3
    }
    
    // Save to local storage first for immediate UI update
    setConversations(prev => {
      const updated = [newConversation, ...prev];
      console.log("更新后的对话列表:", updated.map((c: Conversation) => ({ id: c.id, modelId: c.modelId })));
      // 更新本地存储
      localStorage.setItem('benchat_conversations', JSON.stringify(updated));
      return updated;
    });
    
    setCurrentConversationId(id);
    
    // 只有当当前 URL 不是 /chat/{uuid} 格式时才更新 URL
    const currentPath = window.location.pathname;
    const isAlreadyOnChatPage = /^\/chat\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentPath);
    
    if (!isAlreadyOnChatPage) {
      console.log("更新 URL 为:", `/chat/${id}`);
      router.push(`/chat/${id}`);
    } else {
      console.log("已经在对话页面，不更新 URL");
    }
    
    // Save to Supabase if user is logged in
    try {
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        const userId = session.session.user.id;
        const { error } = await createConversation(userId, "新对话");
        if (error) {
          console.error("Failed to save conversation to database", error);
          setError("Failed to save conversation to database");
        }
      }
    } catch (err) {
      console.error("Error saving conversation to database", err);
    }
    
    console.log("新对话已创建", { 
      id, 
      conversationsLength: conversations.length + 1,
      currentConversationId: id
    });
    
    return id
  }

  // Update conversation model
  const updateConversationModel = (id: string, modelId: string): void => {
    console.log("尝试更新对话模型", { id, modelId, hasId: !!id, hasModelId: !!modelId });
    
    // 检查当前对话列表
    console.log("当前对话列表:", conversations.map((c: Conversation) => ({ id: c.id, modelId: c.modelId })));
    
    setConversations(prev => {
      const updated = prev.map((conversation: Conversation) => {
        if (conversation.id === id) {
          console.log("找到匹配的对话，正在更新模型", { 
            conversationId: conversation.id, 
            oldModelId: conversation.modelId, 
            newModelId: modelId 
          });
          return {
            ...conversation,
            modelId,
            updatedAt: new Date()
          }
        }
        return conversation
      });
      
      // 检查更新后的结果
      console.log("更新后的对话列表:", updated.map((c: Conversation) => ({ id: c.id, modelId: c.modelId })));
      return updated;
    });
  }

  // Send a new message
  const sendMessage = async (content: string) => {
    if (!content.trim() || !currentConversationId) {
      console.log("无法发送消息：内容为空或没有选择对话", { content, currentConversationId });
      return;
    }
    
    const currentConversation = conversations.find((c: Conversation) => c.id === currentConversationId);
    if (!currentConversation) {
      console.log("无法找到当前对话", { currentConversationId, conversations });
      return;
    }
    
    // 检查是否已选择模型
    if (!currentConversation.modelId || currentConversation.modelId === "") {
      console.log("未选择模型，无法发送消息", { 
        modelId: currentConversation.modelId,
        modelIdType: typeof currentConversation.modelId,
        modelIdEmpty: currentConversation.modelId === ""
      });
      setError("请先选择一个AI模型再发送消息");
      return;
    }

    console.log("准备发送消息", { 
      content, 
      conversationId: currentConversationId,
      modelId: currentConversation.modelId,
      modelIdEmpty: currentConversation.modelId === ""
    });
    
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
      // Prepare messages for API call
      const apiMessages = currentConversation.messages.map(msg => ({
        role: msg.role,
        content: msg.content[0].text
      }));
      
      // Add the new user message
      apiMessages.push({
        role: 'user',
        content: content.trim()
      });
      
      // Get model ID from mapping or default to GPT-3.5
      const modelName = currentConversation.modelId ;
      const modelId = modelMapping[modelName]  ;
      
      console.log("Making API call with model:", modelId);
      console.log("Messages:", JSON.stringify(apiMessages));
      console.log("API Configuration:", {
        apiKeyAvailable: !!apiKey,
        siteUrl
      });
      
      // Direct fetch call to OpenRouter API
      try {
        console.log("Making direct fetch call to OpenRouter API");
        
        // 创建一个空的助手回复，用于逐步更新
        const pendingAssistantMessage: Message = {
          id: uuid(),
          role: "assistant",
          content: [{ type: "text", text: "" }],
          createdAt: new Date(),
          model: currentConversation.modelId
        };
        
        // 首先添加一个空的回复，之后会逐步更新
        setConversations(prev => prev.map(conversation => {
          if (conversation.id === currentConversationId) {
            return {
              ...conversation,
              messages: [...conversation.messages, pendingAssistantMessage],
              updatedAt: new Date()
            }
          }
          return conversation
        }));
        
        const requestBody = JSON.stringify({
          model: modelId,
          messages: apiMessages,
          stream: true  // 启用流式响应
        });
        
        console.log("请求API，使用流式响应");

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: requestBody
        });
        
        console.log("Response status:", response.status, response.statusText);
        
        // 检查是否有网络问题
        if (!response.ok) {
          try {
            // 尝试将响应解析为JSON
            const errorJson = await response.json();
            console.error("API error (JSON):", errorJson);
            throw new Error(`API request failed: ${response.status} ${response.statusText} - ${JSON.stringify(errorJson)}`);
          } catch (jsonError) {
            // 如果不是JSON，获取纯文本
            const errorText = await response.text();
            console.error("API error (text):", errorText);
            throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
          }
        }
        
        console.log("流式响应开始接收");
        
        // 处理流式响应
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("Failed to get response reader");
        }
        
        const decoder = new TextDecoder();
        let fullText = "";
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          // 解码收到的数据块
          const chunk = decoder.decode(value, { stream: true });
          console.log("收到数据块:", chunk.slice(0, 50) + (chunk.length > 50 ? "..." : ""));
          
          // 处理SSE格式的数据
          const lines = chunk.split('\n').filter(line => line.trim() !== '');
          
          for (const line of lines) {
            // 跳过注释或空行
            if (line.startsWith(':') || line.trim() === '') continue;
            
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              // 跳过[DONE]消息
              if (data === '[DONE]') continue;
              
              try {
                const parsedData = JSON.parse(data);
                // 从Delta获取文本增量
                const textDelta = parsedData.choices[0]?.delta?.content || '';
                
                if (textDelta) {
                  // 添加到完整文本
                  fullText += textDelta;
                  
                  // 更新UI中的消息
                  setConversations(prev => prev.map(conversation => {
                    if (conversation.id === currentConversationId) {
                      const updatedMessages = [...conversation.messages];
                      // 找到并更新最后一条消息
                      const lastMessageIndex = updatedMessages.length - 1;
                      if (lastMessageIndex >= 0 && updatedMessages[lastMessageIndex].id === pendingAssistantMessage.id) {
                        updatedMessages[lastMessageIndex] = {
                          ...updatedMessages[lastMessageIndex],
                          content: [{ type: "text", text: fullText }]
                        };
                      }
                      
                      return {
                        ...conversation,
                        messages: updatedMessages,
                        updatedAt: new Date()
                      };
                    }
                    return conversation;
                  }));
                }
              } catch (parseError) {
                console.error("Error parsing SSE data:", parseError, data);
              }
            }
          }
        }
        
        console.log("流式响应接收完成");
      } catch (apiError) {
        console.error('API call error:', apiError);
        throw apiError;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Create more descriptive error message
      let errorText = "Sorry, there was an error processing your request. ";
      
      if (error instanceof Error) {
        errorText += `Error details: ${error.message}`;
        console.log("Full error:", error);
        
        // Additional debugging for network errors
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.log("Network error detected - possible CORS or connectivity issue");
          errorText += " (Network connectivity error)";
        }
        
        // Check for API key issues
        if (error.message.includes('authentication') || error.message.includes('api key') || error.message.includes('apiKey')) {
          console.log("API authentication error detected");
          errorText += " (API authentication error)";
        }
      } else {
        errorText += "Please check your API key and network connection.";
      }
      
      // Create error message
      const errorMessage: Message = {
        id: uuid(),
        role: "assistant",
        content: [{ 
          type: "text", 
          text: errorText
        }],
        createdAt: new Date(),
        model: currentConversation.modelId
      }
      
      // Update conversation with error message
      setConversations(prev => prev.map(conversation => {
        if (conversation.id === currentConversationId) {
          return {
            ...conversation,
            messages: [...conversation.messages, errorMessage],
            updatedAt: new Date()
          }
        }
        return conversation
      }))
      
      setError(errorText)
    } finally {
      setIsLoading(false)
    }
  }

  // Generate AI response based on user message and model - only used as fallback
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
    // 立即更新本地状态，提高 UI 响应速度
    setConversations(prev => prev.filter(conversation => conversation.id !== id))
    
    // If the deleted conversation was the current one, set the current to the first available conversation or null
    if (currentConversationId === id) {
      const remaining = conversations.filter(conversation => conversation.id !== id)
      setCurrentConversationId(remaining.length > 0 ? remaining[0].id : null)
    }
    
    // 异步删除 Supabase 中的对话
    (async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (session?.session?.user) {
          const { error } = await deleteConversationFromSupabase(id);
          if (error) {
            console.error("Failed to delete conversation from database", error);
            setError("Failed to delete conversation from database");
          }
        }
      } catch (err) {
        console.error("Error deleting conversation from database", err);
      }
    })();
  }

  // Reset error state
  const resetError = () => setError(null)

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversationId,
        messages,
        isLoading,
        error,
        resetError,
        createNewConversation,
        setCurrentConversationId,
        sendMessage,
        deleteConversation,
        updateConversationModel,
        availableModels: Object.keys(modelMapping),
        selectModel: (id: string, modelId: string) => updateConversationModel(id, modelId)
      }}
    >
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
