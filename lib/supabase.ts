import { createClient } from '@supabase/supabase-js'

// These environment variables are typically set in .env.local
// For a real app, you would properly configure these in your deployment environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

// TypeScript type assertion to ensure string values
export const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string)

// Auth helper functions
export async function signUp(email: string, password: string, metadata: any = {}) {
  // Determine if we're in a browser environment
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${origin}/login`
      // Supabase projects require email verification by default
      // This can only be changed in the Supabase dashboard settings
    }
  })
  
  return { data, error }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  return { data, error }
}

// Chat messages functions
export async function getConversations(userId: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export async function getMessages(conversationId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
  
  return { data, error }
}

export async function createConversation(userId: string, title: string) {
  const { data, error } = await supabase
    .from('conversations')
    .insert([{ user_id: userId, title }])
    .select()
  
  return { data, error }
}

export async function createMessage(conversationId: string, content: string, role: 'user' | 'assistant') {
  const { data, error } = await supabase
    .from('messages')
    .insert([{ conversation_id: conversationId, content, role }])
    .select()
  
  return { data, error }
}

// User profile functions
export async function updateProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
  
  return { data, error }
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  return { data, error }
}
