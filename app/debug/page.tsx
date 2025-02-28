"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'

// 添加自定义 Card 组件
const Card = ({ children, className = "" }) => (
  <div className={`border rounded-lg overflow-hidden shadow-sm ${className}`}>
    {children}
  </div>
)

const CardHeader = ({ children, className = "" }) => (
  <div className={`border-b bg-muted/50 p-4 ${className}`}>
    {children}
  </div>
)

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold ${className}`}>
    {children}
  </h3>
)

const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
)

export default function DebugPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string>('')
  
  const testOpenRouterApi = async () => {
    setLoading(true)
    setResult('正在测试...')
    
    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
    
    if (!apiKey) {
      setResult('错误：未找到 NEXT_PUBLIC_OPENROUTER_API_KEY 环境变量')
      setLoading(false)
      return
    }
    
    try {
      setResult('发送请求到 OpenRouter API...')
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo',
          messages: [
            { role: 'user', content: '你好，这是一条测试消息' }
          ]
        })
      })
      
      setResult((prev) => prev + `\n状态码: ${response.status}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        setResult((prev) => prev + `\n错误: ${errorText}`)
      } else {
        const data = await response.json()
        setResult((prev) => prev + `\n成功! 响应:\n${JSON.stringify(data, null, 2)}`)
      }
    } catch (error) {
      setResult((prev) => prev + `\n异常: ${error instanceof Error ? error.message : '未知错误'}`)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">API 调试页面</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>OpenRouter API 测试</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={testOpenRouterApi} 
            disabled={loading}
            className="mb-4"
          >
            测试 OpenRouter API
          </Button>
          
          <div className="bg-muted p-4 rounded">
            <h3 className="font-medium mb-2">结果:</h3>
            <pre className="whitespace-pre-wrap">{result}</pre>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>环境变量</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <strong>NEXT_PUBLIC_OPENROUTER_API_KEY: </strong>
              {process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ? 
                `${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY.substring(0, 5)}...${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY.substring(process.env.NEXT_PUBLIC_OPENROUTER_API_KEY.length - 4)}` : 
                '未设置'}
            </div>
            <div>
              <strong>NEXT_PUBLIC_SITE_URL: </strong>
              {process.env.NEXT_PUBLIC_SITE_URL || '未设置'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
