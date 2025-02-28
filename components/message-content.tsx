"use client"

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'
import { User, Bot } from "lucide-react"
import { Message, MessageContent as MessageContentType } from '@/context/chat-context'

// 为了解决 SyntaxHighlighter 的 style 属性类型问题
import type { CSSProperties } from 'react'
import type { SyntaxHighlighterProps } from 'react-syntax-highlighter'

interface CodeProps extends HTMLAttributes<HTMLElement> {
  node?: any
  inline?: boolean
  className?: string
  children?: React.ReactNode
}

interface MessageContentProps {
  message: Message;
}

export function MessageContent({ message }: MessageContentProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't server-render SyntaxHighlighter to avoid hydration mismatch
  const codeComponent = ({ node, inline, className, children, ...props }: CodeProps) => {
    // Don't use SyntaxHighlighter until client-side
    if (!mounted) return <code className={className} {...props}>{children}</code>
    
    const match = /language-(\w+)/.exec(className || '')
    const language = match ? match[1] : 'text'
    
    return !inline && match ? (
      <SyntaxHighlighter
        language={language}
        PreTag="div"
        style={resolvedTheme === 'dark' ? oneDark : oneLight}
        wrapLines={true}
        showLineNumbers={true}
        {...props as any}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  }

  // 处理新消息格式，提取文本内容
  const getMessageText = (content: MessageContentType[] | string): string => {
    // 处理旧的字符串格式消息（向后兼容）
    if (typeof content === 'string') {
      return content
    }
    
    // 处理新的数组格式消息
    if (Array.isArray(content)) {
      return content
        .filter(item => item.type === 'text')
        .map(item => item.text)
        .join('\n')
    }
    
    return ''
  }

  // 渲染消息的 Markdown 内容
  const renderContent = () => {
    const text = getMessageText(message.content)
    
    return (
      <ReactMarkdown
        className={cn(
          "prose prose-slate dark:prose-invert max-w-none",
          "prose-headings:font-semibold prose-headings:tracking-tight",
          "prose-h1:text-xl prose-h2:text-lg prose-h3:text-base",
          "prose-p:leading-normal prose-p:my-2",
          "prose-pre:bg-slate-100 prose-pre:dark:bg-slate-900 prose-pre:p-0",
          "prose-code:bg-slate-100 prose-code:dark:bg-slate-800 prose-code:font-medium prose-code:rounded prose-code:px-1",
          "break-words overflow-hidden"
        )}
        remarkPlugins={[remarkGfm]}
        components={{
          code: codeComponent,
          // 自定义链接，添加目标属性和样式
          a: ({node, ...props}) => (
            <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary underline" />
          ),
          // 添加更多组件定制...
        }}
      >
        {text}
      </ReactMarkdown>
    )
  }

  return (
    <div className={cn(
      "flex items-start gap-4 p-4 mb-3 mx-2 rounded-2xl",
      message.role === 'user' 
        ? "bg-background chat-message-user" 
        : "bg-muted/30 chat-message-assistant"
    )}>
      {/* 发送者头像 */}
      <div className={cn(
        "flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-full",
        message.role === 'user' 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted text-muted-foreground"
      )}>
        {message.role === 'user' ? (
          <User className="h-5 w-5" />
        ) : (
          <Bot className="h-5 w-5" />
        )}
      </div>
      
      {/* 消息内容 */}
      <div className="flex-1 space-y-2">
        {/* 发送者信息和时间戳 */}
        <div className="flex items-center gap-2">
          <div className="font-medium">
            {message.role === 'user' ? '你' : 'BenChat'}
            {message.model && message.role === 'assistant' && (
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                {message.model}
              </span>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {message.createdAt && (
              <time dateTime={message.createdAt.toISOString()}>
                {new Intl.DateTimeFormat('zh-CN', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false
                }).format(message.createdAt)}
              </time>
            )}
          </div>
        </div>
        
        {/* 消息内容 */}
        <div className="prose-container">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
