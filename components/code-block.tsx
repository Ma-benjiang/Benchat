"use client"

import React, { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { useTheme } from 'next-themes'

// 为了解决 SyntaxHighlighter 的 style 属性类型问题
import type { CSSProperties } from 'react'
import type { SyntaxHighlighterProps } from 'react-syntax-highlighter'

interface CodeBlockProps {
  language: string
  value: string
  className?: string
}

export function CodeBlock({ language, value, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const { resolvedTheme } = useTheme()

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 语言映射，确保语法高亮正确应用
  const languageMap: { [key: string]: string } = {
    js: 'javascript',
    jsx: 'jsx',
    ts: 'typescript',
    tsx: 'tsx',
    py: 'python',
    rb: 'ruby',
    go: 'go',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    cs: 'csharp',
    php: 'php',
    rs: 'rust',
    swift: 'swift',
    kt: 'kotlin',
    sh: 'bash',
    bash: 'bash',
    shell: 'bash',
    sql: 'sql',
    json: 'json',
    html: 'html',
    css: 'css',
    scss: 'scss',
    md: 'markdown',
    yaml: 'yaml',
    yml: 'yaml',
    xml: 'xml',
    text: 'text',
  }

  // 获取正确的语言
  const normalizedLanguage = languageMap[language.toLowerCase()] || language

  return (
    <div className="relative my-6" style={{
      border: 'none', 
      boxShadow: 'none',
      filter: 'none',
      borderBottom: 'none',
      outline: 'none'
    }}>
      {/* 语言标识和复制按钮 */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 text-white rounded-t-xl z-10 relative">
        <div className="text-xs font-medium flex items-center">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 mr-1"></span>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-yellow-500 mr-1"></span>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 mr-1"></span>
          <span className="ml-3 bg-white/20 px-2 py-0.5 rounded text-xs uppercase font-semibold tracking-wider">{language}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-white hover:text-white/80 hover:bg-white/10 rounded-full transition-colors"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="sr-only">
            {copied ? "已复制" : "复制代码"}
          </span>
        </Button>
      </div>
      
      {/* 代码内容 - 使用内联样式确保没有边框/阴影 */}
      <div className="relative z-10" style={{
        backgroundColor: resolvedTheme === 'dark' ? '#1e1e2e' : '#f8f8f8',
        borderBottomLeftRadius: '0.75rem',
        borderBottomRightRadius: '0.75rem',
        border: 'none',
        boxShadow: 'none',
        overflow: 'hidden'
      }}>
        <SyntaxHighlighter
          language={normalizedLanguage}
          style={resolvedTheme === 'dark' ? oneDark : oneLight}
          customStyle={{
            margin: 0,
            padding: '1.25rem',
            fontSize: '0.875rem',
            lineHeight: '1.7',
            border: 'none',
            borderRadius: 0,
            boxShadow: 'none',
          } as CSSProperties}
          showLineNumbers={normalizedLanguage !== 'text'}
          wrapLines={true}
          lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'} as CSSProperties}}
          codeTagProps={{className: 'text-sm'}}
          lineNumberStyle={{
            minWidth: '2.5em', 
            paddingRight: '1.25em', 
            color: resolvedTheme === 'dark' ? 'rgba(180, 190, 254, 0.5)' : 'rgba(124, 58, 237, 0.5)',
            textAlign: 'right',
            userSelect: 'none',
            borderRight: resolvedTheme === 'dark' ? '2px solid rgba(255, 255, 255, 0.15)' : '2px solid rgba(124, 58, 237, 0.2)',
            marginRight: '1em',
            paddingTop: '0.25em',
            paddingBottom: '0.25em',
          } as CSSProperties}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
