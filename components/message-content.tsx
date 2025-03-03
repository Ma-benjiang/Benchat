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
import { CodeBlock } from '@/components/code-block'
import { useUserConfig } from '@/context/user-config-context'

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
  const { config } = useUserConfig();

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't server-render SyntaxHighlighter to avoid hydration mismatch
  const codeComponent = ({ node, inline, className, children, ...props }: CodeProps) => {
    if (!mounted) {
      // 在客户端挂载前返回简单的占位符
      return inline ? <code {...props}>{children}</code> : <pre><code {...props}>{children}</code></pre>;
    }
    
    const match = /language-(\w+)/.exec(className || '')
    const language = match ? match[1] : 'text'
    
    return !inline && match ? (
      <CodeBlock 
        language={language}
        value={String(children).replace(/\n$/, '')}
      />
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  }

  // 获取消息的纯文本内容
  const getMessageText = (content: MessageContentType[]): string => {
    return content
      .filter(c => c.type === 'text')
      .map(c => (c as { text: string }).text)
      .join('\n\n');
  }

  const renderText = (text: string) => {
    // 如果未挂载，返回简单的文本
    if (!mounted) {
      return <div className="whitespace-pre-wrap">{text}</div>;
    }
    
    return (
      <ReactMarkdown
        className="markdown"
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
  
  // 渲染消息的内容
  const renderContent = () => {
    const text = getMessageText(message.content)
    
    // 如果未挂载或文本为空，显示简单占位符
    if (!mounted && !text) {
      return <div className="animate-pulse h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>;
    }
    
    return renderText(text);
  }

  const getModelLogo = (model: string | undefined): string => {
    if (!model) return '/images/logos/deepseek-color.svg';
    if (model.includes('deepseek')) return '/images/logos/deepseek-color.svg';
    if (model.includes('claude')) return '/images/logos/claude-color.svg';
    if (model.includes('gemini')) return '/images/logos/gemini-color.svg';
    if (model.includes('gpt') || model.includes('openai')) return '/images/logos/openai.svg';
    return '/images/logos/deepseek-color.svg';
  };

  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 mt-1">
        {message.role === "user" ? (
          <div className="w-8 h-8 rounded-full overflow-hidden">
            {config.userAvatarUrl ? (
              <img 
                src={config.userAvatarUrl} 
                alt={config.userName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  const parent = target.parentElement;
                  if (parent) {
                    target.src = '';
                    parent.classList.add('bg-blue-500', 'flex', 'items-center', 'justify-center');
                    parent.innerHTML = '<div class="h-5 w-5 text-white"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>';
                  }
                }}
              />
            ) : (
              <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full overflow-hidden bg-white dark:bg-zinc-800 flex items-center justify-center">
            <img 
              src={getModelLogo(message.model)}
              alt={message.model || 'AI'}
              className="w-6 h-6 object-contain"
            />
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="text-sm mb-1 flex items-center">
          <span className="font-bold">
            {message.role === "user" ? config.userName : (config.assistantName || "Benchat")}
          </span>
          {message.role === "assistant" && (
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
              使用 {message.model?.includes('/') ? message.model.split('/')[1] : 'DeepSeek V3'}
            </span>
          )}
        </div>
        <div className={cn(
          "prose prose-slate dark:prose-invert max-w-none w-full",
          "prose-headings:font-semibold prose-headings:tracking-tight",
          "prose-h1:text-xl prose-h2:text-lg prose-h3:text-base",
          "prose-p:leading-relaxed prose-p:my-3",
          "prose-ul:my-4 prose-ol:my-4 prose-li:my-2",
          "prose-pre:p-0 prose-pre:border-none prose-pre:bg-transparent prose-pre:my-4 prose-pre:shadow-none",
          "prose-code:bg-slate-100 prose-code:dark:bg-slate-800 prose-code:font-medium prose-code:rounded prose-code:px-1",
          "break-words overflow-hidden"
        )}>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
