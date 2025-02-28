import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserPreferences {
  fontSize: 'small' | 'medium' | 'large'
  lineHeight: 'normal' | 'relaxed' | 'loose'
  soundEffects: boolean
  sendWithEnter: boolean
  useDarkMode: boolean | 'system'
}

interface PreferencesStore {
  preferences: UserPreferences
  updatePreferences: (newPreferences: Partial<UserPreferences>) => void
}

export const usePreferences = create<PreferencesStore>()(
  persist(
    (set) => ({
      preferences: {
        fontSize: 'medium',
        lineHeight: 'relaxed',
        soundEffects: true,
        sendWithEnter: true,
        useDarkMode: 'system',
      },
      updatePreferences: (newPreferences) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...newPreferences,
          },
        })),
    }),
    {
      name: 'user-preferences',
    }
  )
)

// 添加模型设置状态管理
export type ModelId = 
  | 'claude-3-opus' 
  | 'claude-3-sonnet' 
  | 'claude-3-haiku'
  | 'claude-2'
  | 'gpt-4o'
  | 'gpt-4'
  | 'gpt-3.5-turbo'

interface ModelSettings {
  defaultModel: ModelId
  temperature: number
  maxTokens: number
  topP: number
  useSystemPrompt: boolean
  systemPrompt: string
  apiKeys: {
    anthropic?: string
    openai?: string
  }
}

interface ModelSettingsStore {
  settings: ModelSettings
  updateSettings: (newSettings: Partial<ModelSettings>) => void
  updateApiKey: (provider: 'anthropic' | 'openai', key: string) => void
}

export const useModelSettings = create<ModelSettingsStore>()(
  persist(
    (set) => ({
      settings: {
        defaultModel: 'claude-3-sonnet',
        temperature: 0.7,
        maxTokens: 4000,
        topP: 0.9,
        useSystemPrompt: true,
        systemPrompt: "You are Claude, an AI assistant created by Anthropic to be helpful, harmless, and honest.",
        apiKeys: {}
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...newSettings,
          },
        })),
      updateApiKey: (provider, key) =>
        set((state) => ({
          settings: {
            ...state.settings,
            apiKeys: {
              ...state.settings.apiKeys,
              [provider]: key
            }
          }
        }))
    }),
    {
      name: 'model-settings',
    }
  )
)

type Conversation = {
  id: string
  title: string
  updatedAt: Date
}

type ChatState = {
  conversations: Conversation[]
  activeConversationId: string | null
  setActiveConversationId: (id: string | null) => void
  addConversation: (conversation: Conversation) => void
  removeConversation: (id: string) => void
  updateConversationTitle: (id: string, title: string) => void
}

export const useChatStore = create<ChatState>()((set) => ({
  conversations: [],
  activeConversationId: null,
  setActiveConversationId: (id) => set({ activeConversationId: id }),
  addConversation: (conversation) =>
    set((state) => ({
      conversations: [conversation, ...state.conversations],
      activeConversationId: conversation.id,
    })),
  removeConversation: (id) =>
    set((state) => {
      const newConversations = state.conversations.filter(
        (convo) => convo.id !== id
      )
      
      // If we're removing the active conversation, set a new active one
      let newActiveId = state.activeConversationId
      if (state.activeConversationId === id) {
        newActiveId = newConversations.length > 0 ? newConversations[0].id : null
      }
      
      return {
        conversations: newConversations,
        activeConversationId: newActiveId,
      }
    }),
  updateConversationTitle: (id, title) =>
    set((state) => ({
      conversations: state.conversations.map((convo) =>
        convo.id === id ? { ...convo, title } : convo
      ),
    })),
}))
