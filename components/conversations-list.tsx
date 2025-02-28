"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Search, Clock, Trash2, ChevronDown } from "lucide-react"
import { cn, formatDistanceToNow } from "@/lib/utils"
import { useChat } from "@/context/chat-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ConversationsList() {
  const { 
    conversations, 
    currentConversationId,
    setCurrentConversationId, 
    createNewConversation,
    deleteConversation
  } = useChat()
  
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState("")

  // Set mounted state after first render
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNewConversation = () => {
    createNewConversation()
  }

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id)
  }

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (confirmDelete === id) {
      deleteConversation(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
      
      // Auto-clear confirm state after 5 seconds
      setTimeout(() => {
        setConfirmDelete(null)
      }, 5000)
    }
  }

  // Filter conversations by search term
  const filteredConversations = conversations.filter(conversation => 
    conversation.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full max-h-full">
      {/* New Chat Button */}
      <div className="p-3">
        <Button 
          onClick={handleNewConversation}
          className="w-full justify-center bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-800 dark:text-white border dark:border-zinc-700"
          variant="outline"
        >
          <div className="flex items-center">
            {mounted ? (
              <PlusCircle className="h-4 w-4 mr-2" />
            ) : (
              <div className="h-4 w-4 mr-2" />
            )}
            <span>新建对话</span>
          </div>
        </Button>
      </div>
      
      {/* Search Box */}
      <div className="px-3 mb-2">
        <div className="relative">
          {mounted && (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          )}
          <Input
            className="pl-9 py-1 h-9 bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-sm placeholder-gray-400"
            placeholder="搜索对话"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      {/* Divider */}
      <div className="px-3 py-2">
        <div className="h-px bg-gray-200 dark:bg-zinc-700"></div>
      </div>
      
      {/* Conversations */}
      <div className="flex-1 overflow-auto py-1">
        {filteredConversations.length === 0 ? (
          <div className="px-3 py-8 text-center text-gray-500 text-sm">
            没有符合条件的对话
          </div>
        ) : (
          <div className="space-y-1 px-2">
            {filteredConversations.map((conversation) => {
              const isSelected = conversation.id === currentConversationId
              const isConfirmingDelete = conversation.id === confirmDelete
              
              return (
                <div
                  key={conversation.id}
                  className={cn(
                    "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors cursor-pointer",
                    isSelected 
                      ? "bg-gray-100 dark:bg-zinc-800" 
                      : "hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                  )}
                  onClick={() => handleSelectConversation(conversation.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-1">
                      <div className="truncate font-medium">
                        {conversation.title}
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      {mounted && <Clock className="h-3 w-3 mr-1 flex-shrink-0" />}
                      <span className="truncate">
                        {formatDistanceToNow(conversation.updatedAt)}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 ml-2 opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
                    onClick={(e) => handleDeleteClick(conversation.id, e)}
                  >
                    {mounted && (
                      <Trash2 className={cn(
                        "h-4 w-4",
                        isConfirmingDelete ? "text-red-500" : "text-gray-400"
                      )} />
                    )}
                    <span className="sr-only">
                      {isConfirmingDelete ? "Confirm delete" : "Delete conversation"}
                    </span>
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
