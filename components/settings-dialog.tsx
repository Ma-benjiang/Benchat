"use client"

import { useState, useEffect } from "react"
import { Settings, X, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface ModelConfig {
  id: string;
  provider: string;
  name: string;
  apiKey: string;
  apiUrl: string;
  isDefault: boolean;
}

interface SettingsData {
  models: ModelConfig[];
}

interface SettingsDialogProps {
  triggerButton?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SettingsDialog({ triggerButton, open: externalOpen, onOpenChange }: SettingsDialogProps) {
  const { toast } = useToast()
  const [internalOpen, setInternalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<SettingsData>({
    models: []
  })

  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  useEffect(() => {
    setMounted(true)
    loadSettings()
  }, [])

  const loadSettings = () => {
    try {
      const savedModels: ModelConfig[] = JSON.parse(localStorage.getItem("benchat_models") || "[]")
      
      if (savedModels.length === 0) {
        const defaultModels: ModelConfig[] = [
          {
            id: generateId(),
            provider: "Anthropic",
            name: "Claude 3 Opus",
            apiKey: "",
            apiUrl: "https://api.anthropic.com/v1/messages",
            isDefault: true
          }
        ]
      
        setSettings({
          models: defaultModels
        })
      } else {
        setSettings({
          models: savedModels
        })
      }
    } catch (error) {
      console.error("Error loading settings:", error)
      setSettings({
        models: [
          {
            id: generateId(),
            provider: "Anthropic",
            name: "Claude 3 Opus",
            apiKey: "",
            apiUrl: "https://api.anthropic.com/v1/messages",
            isDefault: true
          }
        ]
      })
    }
  }

  const generateId = () => {
    return Math.random().toString(36).substring(2, 15)
  }

  const addModelConfig = () => {
    const newModel: ModelConfig = {
      id: generateId(),
      provider: "OpenAI",
      name: "GPT-4",
      apiKey: "",
      apiUrl: "https://api.openai.com/v1/chat/completions",
      isDefault: settings.models.length === 0
    }
    
    setSettings({
      ...settings,
      models: [...settings.models, newModel]
    })
  }

  const removeModelConfig = (id: string) => {
    const updatedModels = settings.models.filter(model => model.id !== id)
    
    if (updatedModels.length > 0 && !updatedModels.some(m => m.isDefault)) {
      updatedModels[0].isDefault = true
    }
    
    setSettings({
      ...settings,
      models: updatedModels
    })
  }

  const updateModelConfig = (id: string, updates: Partial<ModelConfig>) => {
    const updatedModels = settings.models.map(model => {
      if (model.id === id) {
        return { ...model, ...updates }
      }
      return model
    })
    
    if (updates.isDefault) {
      updatedModels.forEach(model => {
        if (model.id !== id) {
          model.isDefault = false
        }
      })
    }
    
    setSettings({
      ...settings,
      models: updatedModels
    })
  }

  const saveSettings = () => {
    setLoading(true)
    try {
      localStorage.setItem("benchat_models", JSON.stringify(settings.models))
      
      toast({
        title: "设置已保存",
        description: "您的API设置已成功保存",
      })
      setOpen(false)
    } catch (error) {
      toast({
        title: "保存失败",
        description: "无法保存设置，请重试",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getConfiguredModelsCount = () => {
    return settings.models.filter(model => model.apiKey).length
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton ? (
          triggerButton
        ) : (
          <Button variant="ghost" size="icon" className="rounded-full">
            {mounted ? (
              <Settings className="h-5 w-5" />
            ) : (
              <div className="h-5 w-5" />
            )}
            <span className="sr-only">设置</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>模型配置</DialogTitle>
          <DialogDescription>
            管理您的AI模型API设置
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 flex-1 overflow-hidden flex flex-col">
          <div className="space-y-4 mb-4">
            <p className="text-sm text-muted-foreground">
              配置不同AI模型的API密钥和端点。您可以添加多个模型并选择默认模型。
            </p>
            
            <Button onClick={addModelConfig} variant="outline" className="w-full flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>添加新模型</span>
            </Button>
          </div>
          
          <ScrollArea className="flex-1 pr-4 -mr-4">
            <Accordion type="multiple" className="space-y-4">
              {settings.models.map((model) => (
                <AccordionItem key={model.id} value={model.id} className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <h4 className="font-medium">{model.provider} {model.name}</h4>
                      <p className="text-xs text-muted-foreground">{model.apiUrl}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={model.isDefault}
                          onCheckedChange={(checked) => updateModelConfig(model.id, { isDefault: checked })}
                          disabled={model.isDefault}
                        />
                        <span className="text-xs">默认</span>
                      </div>
                      <AccordionTrigger className="h-6 w-6 p-0" />
                    </div>
                  </div>
                  
                  <AccordionContent className="pt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>提供商</Label>
                          <Select 
                            value={model.provider}
                            onValueChange={(value) => updateModelConfig(model.id, { provider: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="选择提供商" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Anthropic">Anthropic</SelectItem>
                              <SelectItem value="OpenAI">OpenAI</SelectItem>
                              <SelectItem value="Google">Google</SelectItem>
                              <SelectItem value="Custom">自定义</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>模型名称</Label>
                          <Select 
                            value={model.name}
                            onValueChange={(value) => updateModelConfig(model.id, { name: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="选择模型" />
                            </SelectTrigger>
                            <SelectContent>
                              {model.provider === "Anthropic" && (
                                <>
                                  <SelectItem value="Claude 3 Opus">Claude 3 Opus</SelectItem>
                                  <SelectItem value="Claude 3 Sonnet">Claude 3 Sonnet</SelectItem>
                                  <SelectItem value="Claude 3 Haiku">Claude 3 Haiku</SelectItem>
                                </>
                              )}
                              {model.provider === "OpenAI" && (
                                <>
                                  <SelectItem value="GPT-4">GPT-4</SelectItem>
                                  <SelectItem value="GPT-4-Turbo">GPT-4-Turbo</SelectItem>
                                  <SelectItem value="GPT-3.5-Turbo">GPT-3.5-Turbo</SelectItem>
                                </>
                              )}
                              {model.provider === "Google" && (
                                <>
                                  <SelectItem value="Gemini Pro">Gemini Pro</SelectItem>
                                  <SelectItem value="Gemini Ultra">Gemini Ultra</SelectItem>
                                </>
                              )}
                              {model.provider === "Custom" && (
                                <SelectItem value="Custom">自定义模型</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>API URL</Label>
                        <Input 
                          value={model.apiUrl}
                          onChange={(e) => updateModelConfig(model.id, { apiUrl: e.target.value })}
                          placeholder="输入API端点URL"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>API Key</Label>
                        <Input 
                          type="password"
                          value={model.apiKey}
                          onChange={(e) => updateModelConfig(model.id, { apiKey: e.target.value })}
                          placeholder="输入API密钥"
                        />
                      </div>
                      
                      <Button 
                        variant="destructive" 
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => removeModelConfig(model.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        删除此模型配置
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </div>
        
        <DialogFooter>
          <Button onClick={saveSettings} disabled={loading}>
            {loading ? "保存中..." : "保存设置"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
