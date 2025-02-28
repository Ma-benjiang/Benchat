"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, MessageSquare, Lock, BarChart, Cpu, ShieldCheck, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [typedText, setTypedText] = useState("")
  const demoText = "Tell me about the latest advancements in quantum computing and how they might impact cryptography in the next decade."
  
  useEffect(() => {
    setMounted(true)
    
    const typeDemo = () => {
      let i = 0
      const typeInterval = setInterval(() => {
        if (i < demoText.length) {
          setTypedText(demoText.substring(0, i + 1))
          i++
        } else {
          clearInterval(typeInterval)
        }
      }, 50)
      
      return () => clearInterval(typeInterval)
    }
    
    if (mounted) {
      const timer = setTimeout(typeDemo, 1000)
      return () => clearTimeout(timer)
    }
  }, [mounted])
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b px-4 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <span className="text-sm font-bold text-primary-foreground">B</span>
            </div>
            <span className="text-lg font-semibold">BenChat</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Meet BenChat, your AI assistant
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    BenChat helps you with creative writing, analysis, coding, answering questions, and more.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/chat">
                      Try BenChat now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/register">Sign up for free</Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto hidden lg:block rounded-xl border bg-background p-8 shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                      <span className="text-sm font-bold text-primary-foreground">B</span>
                    </div>
                    <div className="flex-1 rounded-lg bg-muted p-4 text-sm">
                      <p>Hello! I'm BenChat, your AI assistant. How can I help you today?</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 justify-end">
                    <div className="flex-1 rounded-lg bg-primary p-4 text-sm text-primary-foreground">
                      <p>Can you help me write a short story about a robot learning to paint?</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center dark:bg-zinc-800">
                      <span className="text-sm">U</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                      <span className="text-sm font-bold text-primary-foreground">B</span>
                    </div>
                    <div className="flex-1 rounded-lg bg-muted p-4 text-sm">
                      <p>
                        Here's a short story about a robot learning to paint:
                      </p>
                      <p className="mt-2">
                        <strong>The Artful Algorithm</strong>
                      </p>
                      <p className="mt-2">
                        Unit RB-73 was designed to analyze, not create. Its titanium fingers were precise instruments for assembly line work, not for holding a paintbrush...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                BenChat is designed to be helpful, harmless, and honest. Discover how BenChat can assist you in various ways.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 pt-12 sm:grid-cols-2 md:grid-cols-3">
              <div className="rounded-xl border bg-background p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Intuitive Chat</h3>
                <p className="mt-2 text-muted-foreground">
                  Natural conversation with contextual understanding and clear, thoughtful responses.
                </p>
              </div>
              <div className="rounded-xl border bg-background p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Cpu className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Multiple Models</h3>
                <p className="mt-2 text-muted-foreground">
                  Choose from various AI models to suit your specific needs, from fast responses to deep analysis.
                </p>
                <Button variant="link" className="mt-2 p-0 h-auto" asChild>
                  <Link href="/models">
                    Configure models <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
              <div className="rounded-xl border bg-background p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                    <line x1="16" y1="8" x2="2" y2="22"></line>
                    <line x1="17.5" y1="15" x2="9" y2="15"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Programming Help</h3>
                <p className="mt-2 text-muted-foreground">
                  Get help with code debugging, solution design, and learning new programming concepts.
                </p>
              </div>
              <div className="rounded-xl border bg-background p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Research Assistant</h3>
                <p className="mt-2 text-muted-foreground">
                  BenChat can help you analyze, summarize, and explain complex topics and information.
                </p>
              </div>
              <div className="rounded-xl border bg-background p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Personal Learning</h3>
                <p className="mt-2 text-muted-foreground">
                  Learn new subjects with interactive explanations tailored to your level of understanding.
                </p>
              </div>
              <div className="rounded-xl border bg-background p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Productivity</h3>
                <p className="mt-2 text-muted-foreground">
                  Plan projects, create outlines, generate ideas, and organize your thoughts more efficiently.
                </p>
              </div>
              <div className="rounded-xl border bg-background p-6 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Safe & Private</h3>
                <p className="mt-2 text-muted-foreground">
                  BenChat is designed with privacy and safety in mind, helping you with tasks while respecting your data.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="rounded-xl bg-primary/5 p-8 md:p-12 lg:p-16">
              <div className="grid gap-6 md:grid-cols-[1fr_400px]">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                    Ready to experience the power of BenChat?
                  </h2>
                  <p className="text-muted-foreground md:text-lg">
                    Join thousands of people who use BenChat daily for writing, learning, coding, and more.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <p>No credit card required</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <p>Free plan available</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <p>Available on all devices</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Button size="lg" asChild>
                      <Link href="/chat">Get started for free</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link href="/login">Sign in</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary">
              <span className="text-xs font-bold text-primary-foreground">B</span>
            </div>
            <p className="text-sm font-medium"> 2025 BenChat AI. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <Link className="text-sm underline" href="#">
              Terms
            </Link>
            <Link className="text-sm underline" href="#">
              Privacy
            </Link>
            <Link className="text-sm underline" href="#">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
