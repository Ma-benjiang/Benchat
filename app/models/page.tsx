"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useModelSettings, type ModelId } from "@/lib/store"

const models = [
  { id: "claude-3-opus", name: "Claude 3 Opus", description: "Most powerful model for highly complex tasks" },
  { id: "claude-3-sonnet", name: "Claude 3 Sonnet", description: "Balanced model for most tasks" },
  { id: "claude-3-haiku", name: "Claude 3 Haiku", description: "Fast and efficient model for simpler tasks" },
  { id: "claude-2", name: "Claude 2", description: "Legacy model with good all-around performance" },
  { id: "gpt-4o", name: "GPT-4o", description: "OpenAI's most advanced multimodal model" },
  { id: "gpt-4", name: "GPT-4", description: "OpenAI's powerful large language model" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Fast and cost-effective OpenAI model" },
]

export default function ModelsPage() {
  const { settings, updateSettings, updateApiKey } = useModelSettings()
  
  // Use local state that syncs with the store
  const [defaultModel, setDefaultModel] = useState<ModelId>(settings.defaultModel)
  const [temperature, setTemperature] = useState(settings.temperature)
  const [maxTokens, setMaxTokens] = useState(settings.maxTokens)
  const [topP, setTopP] = useState(settings.topP)
  const [useSystemPrompt, setUseSystemPrompt] = useState(settings.useSystemPrompt)
  const [systemPrompt, setSystemPrompt] = useState(settings.systemPrompt)
  const [anthropicApiKey, setAnthropicApiKey] = useState(settings.apiKeys.anthropic || "")
  const [openaiApiKey, setOpenaiApiKey] = useState(settings.apiKeys.openai || "")
  
  // Update local state when store changes
  useEffect(() => {
    setDefaultModel(settings.defaultModel)
    setTemperature(settings.temperature)
    setMaxTokens(settings.maxTokens)
    setTopP(settings.topP)
    setUseSystemPrompt(settings.useSystemPrompt)
    setSystemPrompt(settings.systemPrompt)
    setAnthropicApiKey(settings.apiKeys.anthropic || "")
    setOpenaiApiKey(settings.apiKeys.openai || "")
  }, [settings])

  // Handle saving all model settings
  const saveSettings = () => {
    updateSettings({
      defaultModel,
      temperature,
      maxTokens,
      topP,
      useSystemPrompt,
      systemPrompt
    })
  }

  // Handle saving API keys
  const saveApiKeys = () => {
    if (anthropicApiKey) {
      updateApiKey('anthropic', anthropicApiKey)
    }
    if (openaiApiKey) {
      updateApiKey('openai', openaiApiKey)
    }
  }
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/chat">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Back to Chat</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Model Settings</h1>
      </div>

      <div className="grid gap-6 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Default Model</CardTitle>
            <CardDescription>Choose which AI model to use by default for new chats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Select
              value={defaultModel}
              onValueChange={(value) => setDefaultModel(value as ModelId)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex flex-col">
                      <span>{model.name}</span>
                      <span className="text-xs text-muted-foreground">{model.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
          <CardFooter>
            <Button onClick={saveSettings}>Save Model Selection</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Model Parameters</CardTitle>
            <CardDescription>Adjust the generation parameters for all AI models</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="temperature">Temperature: {temperature.toFixed(1)}</Label>
                <span className="text-sm text-muted-foreground">Controls randomness</span>
              </div>
              <Slider
                id="temperature"
                min={0}
                max={1}
                step={0.1}
                value={[temperature]}
                onValueChange={(value) => setTemperature(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Deterministic (0.0)</span>
                <span>Balanced (0.7)</span>
                <span>Creative (1.0)</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="max-tokens">Max Output Length: {maxTokens}</Label>
                <span className="text-sm text-muted-foreground">Maximum tokens to generate</span>
              </div>
              <Slider
                id="max-tokens"
                min={1000}
                max={100000}
                step={1000}
                value={[maxTokens]}
                onValueChange={(value) => setMaxTokens(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Short (1k)</span>
                <span>Medium (10k)</span>
                <span>Long (100k)</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="top-p">Top P: {topP.toFixed(1)}</Label>
                <span className="text-sm text-muted-foreground">Controls diversity</span>
              </div>
              <Slider
                id="top-p"
                min={0.1}
                max={1}
                step={0.1}
                value={[topP]}
                onValueChange={(value) => setTopP(value[0])}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={saveSettings}>Save Parameters</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Prompt</CardTitle>
            <CardDescription>Configure the default instructions for the AI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="use-system-prompt">Use System Prompt</Label>
                <p className="text-sm text-muted-foreground">
                  Include default instructions for the AI with every message
                </p>
              </div>
              <Switch 
                id="use-system-prompt" 
                checked={useSystemPrompt}
                onCheckedChange={setUseSystemPrompt}
              />
            </div>
            
            {useSystemPrompt && (
              <div className="space-y-2">
                <Label htmlFor="system-prompt">System Prompt</Label>
                <textarea
                  id="system-prompt"
                  className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="Enter instructions for the AI"
                />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={saveSettings}>Save System Prompt</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>Configure your API keys for different AI providers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="anthropic-api-key">Anthropic API Key</Label>
                <Input 
                  id="anthropic-api-key" 
                  type="password"
                  value={anthropicApiKey}
                  onChange={(e) => setAnthropicApiKey(e.target.value)}
                  placeholder="sk-ant-api03-..."
                />
                <p className="text-xs text-muted-foreground">
                  Required for Claude models. <a href="https://console.anthropic.com/account/keys" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Get your API key</a>
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="openai-api-key">OpenAI API Key</Label>
                <Input 
                  id="openai-api-key" 
                  type="password"
                  value={openaiApiKey}
                  onChange={(e) => setOpenaiApiKey(e.target.value)}
                  placeholder="sk-..."
                />
                <p className="text-xs text-muted-foreground">
                  Required for GPT models. <a href="https://platform.openai.com/api-keys" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Get your API key</a>
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={saveApiKeys}>Save API Settings</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
