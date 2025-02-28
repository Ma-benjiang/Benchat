"use client"

import { Button } from "@/components/ui/button"
import { Menu, Share, Download } from "lucide-react"
import { useState } from "react"

export function ChatHeader() {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  
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
        <div>
          <h2 className="text-sm font-medium">Chat</h2>
          <p className="text-xs text-muted-foreground">Claude</p>
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
