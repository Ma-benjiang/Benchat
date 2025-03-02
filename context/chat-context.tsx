"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { uuid } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { supabase, createConversation, deleteConversation as deleteConversationFromDb, createMessage } from "@/lib/supabase"

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
  "DeepSeek V3": "deepseek/deepseek-chat",
  "DeepSeek R1": "deepseek/deepseek-r1"
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
  regenerateResponse: () => void
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
  selectModel: () => { },
  regenerateResponse: () => { }
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, _setCurrentConversationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Set current conversation ID and update URL
  const setCurrentConversationId = (id: string) => {
    // Find the conversation to get its model
    const conversation = conversations.find(c => c.id === id);
    
    // Update current conversation ID
    _setCurrentConversationId(id);
    
    // Update URL
    router.push(`/chat/${id}`);
  }

  // Get current messages from current conversation
  const messages = currentConversationId 
    ? conversations.find(c => c.id === currentConversationId)?.messages || []
    : []

  // Initialize conversations from Supabase when component mounts
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (session?.session?.user) {
          const { data: conversations, error } = await supabase
            .from('conversations')
            .select('*, messages(*)')
            .eq('user_id', session.session.user.id)
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Failed to load conversations', error);
            setError('Failed to load conversations');
            return;
          }

          if (conversations) {
            const formattedConversations = conversations.map(conv => {
              // 格式化消息
              const formattedMessages = (conv.messages || []).map((msg: any) => ({
                id: msg.id,
                role: msg.role,
                content: [{ type: "text", text: msg.content }],
                createdAt: new Date(msg.created_at),
                model: msg.model
              }));

              // 找到第一条用户消息作为标题
              const firstUserMessage = formattedMessages.find((msg: Message) => msg.role === 'user');
              const title = firstUserMessage ? firstUserMessage.content[0].text : "新对话";

              return {
                id: conv.id,
                title: title,
                messages: formattedMessages,
                createdAt: new Date(conv.created_at),
                updatedAt: new Date(conv.updated_at),
                modelId: conv.model_id
              };
            });
            
            console.log("Loaded conversations with messages:", formattedConversations);
            setConversations(formattedConversations);
            
            // Set first conversation as current if exists
            if (formattedConversations.length > 0) {
              _setCurrentConversationId(formattedConversations[0].id);
            }
          }
        }
      } catch (err) {
        console.error('Error loading conversations:', err);
        setError('Error loading conversations');
      }
    };

    loadConversations();
  }, []);

  // Update model selection when current conversation changes
  useEffect(() => {
    if (currentConversationId) {
      const currentConversation = conversations.find(c => c.id === currentConversationId);
      if (currentConversation?.modelId) {
        // Find the display name for the model ID
        const displayName = Object.entries(modelMapping).find(([_, value]) => value === currentConversation.modelId)?.[0];
        if (displayName) {
          console.log("Updating model selection to:", displayName);
        }
      }
    }
  }, [currentConversationId, conversations]);

  // Create a new conversation
  const createNewConversation = async (): Promise<string> => {
    // Check if user is logged in
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      setError('Please login to create a conversation');
      return '';
    }

    const id = uuid();
    const userId = session.session.user.id;
    
    const newConversation: Conversation = {
      id,
      title: "新对话", // 初始标题为"新对话"，在用户发送第一条消息时会更新
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      modelId: "deepseek/deepseek-chat"
    }
    
    // Save to Supabase
    const { error } = await createConversation(userId, newConversation.title);
    if (error) {
      console.error("Failed to save conversation to database", error);
      setError("Failed to save conversation to database");
      return '';
    }
    
    // Update local state
    setConversations(prev => [newConversation, ...prev]);
    _setCurrentConversationId(id);
    
    // Always update URL for new conversation
    router.push(`/chat/${id}`);
    
    return id;
  }

  // Update conversation model
  const updateConversationModel = (id: string, modelId: string): void => {
    console.log("尝试更新对话模型", { id, modelId, hasId: !!id, hasModelId: !!modelId });
    
    // 确定实际的模型ID
    const actualModelId = modelMapping[modelId] || modelId;
    
    // 检查是否需要更新
    const conversation = conversations.find(c => c.id === id);
    if (conversation?.modelId === actualModelId) {
      console.log("模型未改变，跳过更新");
      return;
    }
    
    setConversations(prev => {
      const updated = prev.map((conversation: Conversation) => {
        if (conversation.id === id) {
          console.log("找到匹配的对话，正在更新模型", { 
            conversationId: conversation.id, 
            oldModelId: conversation.modelId, 
            newModelId: actualModelId 
          });
          return {
            ...conversation,
            modelId: actualModelId,
            updatedAt: new Date()
          }
        }
        return conversation
      });
      
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
    
    // 如果没有选择模型，使用默认模型
    if (!currentConversation.modelId || currentConversation.modelId === "") {
      console.log("使用默认模型 deepseek/deepseek-chat");
      currentConversation.modelId = "deepseek/deepseek-chat";
      // 更新会话的模型设置
      setConversations(prev => prev.map(conversation => {
        if (conversation.id === currentConversationId) {
          return {
            ...conversation,
            modelId: "deepseek/deepseek-chat"
          };
        }
        return conversation;
      }));
    }

    // Check if user is logged in
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      setError('Please login to send messages');
      return;
    }

    console.log("准备发送消息", { 
      content, 
      conversationId: currentConversationId,
      modelId: currentConversation.modelId
    });
    
    // Create user message
    const userMessage: Message = {
      id: uuid(),
      role: "user",
      content: [{ type: "text", text: content.trim() }],
      createdAt: new Date()
    }
    
    // Save user message to Supabase
    const { error: userMessageError } = await createMessage(
      currentConversationId,
      content.trim(),
      'user'
    );

    if (userMessageError) {
      console.error("Failed to save user message to database:", userMessageError);
      setError("Failed to save message to database");
      return;
    }
    
    // Update conversation with user message
    setConversations(prev => prev.map(conversation => {
      if (conversation.id === currentConversationId) {
        // 如果是第一条消息，将其作为对话标题
        const isFirstMessage = conversation.messages.length === 0;
        const newTitle = isFirstMessage ? content.trim() : conversation.title;
        
        return {
          ...conversation,
          messages: [...conversation.messages, userMessage],
          updatedAt: new Date(),
          title: newTitle
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
      const modelName = currentConversation.modelId;
      console.log("当前会话的模型设置:", { modelName });

      // 如果modelId已经是API格式，直接使用；否则通过modelMapping查找
      const modelId = Object.values(modelMapping).includes(modelName) 
        ? modelName 
        : modelMapping[modelName] || modelName;
      
      if (!modelId) {
        const errorMsg = "无法确定要使用的模型";
        console.error(errorMsg, { modelName, availableModels: modelMapping });
        setError(errorMsg);
        return;
      }

      console.log("准备调用API，使用模型:", { modelName, modelId });
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
        }
        
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
        
        if (!response.ok) {
          try {
            const errorJson = await response.json();
            console.error("API error (JSON):", errorJson);
            throw new Error(`API request failed: ${response.status} ${response.statusText} - ${JSON.stringify(errorJson)}`);
          } catch (jsonError) {
            const errorText = await response.text();
            console.error("API error (text):", errorText);
            throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
          }
        }
        
        console.log("流式响应开始接收");
        
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("Failed to get response reader");
        }
        
        const decoder = new TextDecoder();
        let fullText = "";
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          console.log("收到数据块:", chunk.slice(0, 50) + (chunk.length > 50 ? "..." : ""));
          
          const lines = chunk.split('\n').filter(line => line.trim() !== '');
          
          for (const line of lines) {
            if (line.startsWith(':') || line.trim() === '') continue;
            
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              
              try {
                const parsedData = JSON.parse(data);
                const textDelta = parsedData.choices[0]?.delta?.content || '';
                
                if (textDelta) {
                  fullText += textDelta;
                  
                  // 更新UI中的消息
                  setConversations(prev => prev.map(conversation => {
                    if (conversation.id === currentConversationId) {
                      const updatedMessages = [...conversation.messages];
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

        // Save assistant message to Supabase
        const { error: assistantMessageError } = await createMessage(
          currentConversationId,
          fullText,
          'assistant'
        );

        if (assistantMessageError) {
          console.error("Failed to save assistant message to database:", assistantMessageError);
          // Don't return here, as the message is already shown to the user
        }

      } catch (apiError) {
        console.error('API call error:', apiError);
        throw apiError;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorText = "Sorry, there was an error processing your request. ";
      
      if (error instanceof Error) {
        errorText += `Error details: ${error.message}`;
        console.log("Full error:", error);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.log("Network error detected - possible CORS or connectivity issue");
          errorText += " (Network connectivity error)";
        }
        
        if (error.message.includes('authentication') || error.message.includes('api key') || error.message.includes('apiKey')) {
          console.log("API authentication error detected");
          errorText += " (API authentication error)";
        }
      } else {
        errorText += "Please check your API key and network connection.";
      }
      
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
    // Store current state for recovery
    const previousState = {
      conversations: [...conversations],
      currentId: currentConversationId
    };

    // Immediately update UI
    setConversations(prev => prev.filter(conversation => conversation.id !== id));
    
    if (currentConversationId === id) {
      const remaining = conversations.filter(conversation => conversation.id !== id);
      _setCurrentConversationId(remaining.length > 0 ? remaining[0].id : null);
    }

    if (conversations.length <= 1) {
      router.push('/chat');
    }

    // Async delete from database
    (async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user) {
          setConversations(previousState.conversations);
          _setCurrentConversationId(previousState.currentId);
          setError('Please login to delete a conversation');
          return;
        }

        const { error } = await deleteConversationFromDb(id);
        if (error) {
          console.error("Failed to delete conversation from database:", error);
          setConversations(previousState.conversations);
          _setCurrentConversationId(previousState.currentId);
          setError("Failed to delete conversation from database");
        }
      } catch (err) {
        console.error("Error in deleteConversation:", err);
        setConversations(previousState.conversations);
        _setCurrentConversationId(previousState.currentId);
        setError("An error occurred while deleting the conversation");
      }
    })();
  }

  // Reset error state
  const resetError = () => setError(null)

  // Regenerate the last assistant response
  const regenerateResponse = () => {
    // 简单的实现：清除错误状态
    resetError()
  }

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
        selectModel: (id: string, modelId: string) => updateConversationModel(id, modelId),
        regenerateResponse
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
