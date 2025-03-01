"use client"

import { Button } from "@/components/ui/button"
import { Menu, Share, Download } from "lucide-react"
import { useState } from "react"
import { useUserConfig } from "@/context/user-config-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ChatHeader() {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const { config } = useUserConfig();
  
  return (
    <header className="h-14 border-b flex items-center justify-between px-4">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden mr-2"
          onClick={() => setMobileSidebarOpen(!isMobileSidebarOpen)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            {config.assistantAvatar ? (
              <AvatarImage src={config.assistantAvatar} alt={config.assistantName} />
            ) : (
              <AvatarFallback className="avatar-assistant-bg text-white font-bold">
                {config.assistantName.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <h2 className="text-sm font-medium">{config.assistantName}</h2>
            <p className="text-xs text-muted-foreground">AI 助手</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" title="Share chat">
          <Share className="h-4 w-4" />
          <span className="sr-only">Share</span>
        </Button>
        <Button variant="ghost" size="icon" title="Export chat">
          <Download className="h-4 w-4" />
          <span className="sr-only">Export</span>
        </Button>
      </div>
    </header>
  )
}
