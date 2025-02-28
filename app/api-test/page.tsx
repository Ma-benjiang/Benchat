"use client"

import { useState } from 'react'

export default function ApiTestPage() {
  const [status, setStatus] = useState('准备测试')
  const [loading, setLoading] = useState(false)

  const testApi = async () => {
    setLoading(true)
    setStatus('开始测试...')
    
    try {
      // 获取环境变量
      const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
      setStatus(prev => prev + `\n找到API密钥: ${apiKey ? 'Yes' : 'No'}`)
      
      if (!apiKey) {
        setStatus(prev => prev + `\n错误: 未找到API密钥`)
        return
      }
      
      setStatus(prev => prev + `\n发送请求到 OpenRouter...`)
      
      // 尝试直接发送请求
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo',
          messages: [{ role: 'user', content: '你好，这是一条测试消息' }]
        })
      })
      
      setStatus(prev => prev + `\n收到响应: 状态码 ${response.status}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        setStatus(prev => prev + `\n错误内容: ${errorText}`)
      } else {
        const data = await response.json()
        setStatus(prev => prev + `\n成功! 响应内容: ${JSON.stringify(data.choices[0].message)}`)
      }
    } catch (error) {
      setStatus(prev => prev + `\n异常: ${error instanceof Error ? error.message : '未知错误'}`)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">API 测试页面</h1>
      
      <div className="flex space-x-4 mb-6">
        <button 
          onClick={testApi}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          测试 OpenRouter API
        </button>
      </div>
      
      <div className="p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">状态:</h2>
        <pre className="whitespace-pre-wrap">{status}</pre>
      </div>
    </div>
  )
}
