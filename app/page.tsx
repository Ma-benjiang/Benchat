"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  ArrowRight,
  MessageSquare,
  Cpu,
  Sparkles,
  Code2,
  BookOpen,
  Shield,
  Zap,
  Globe2,
  Moon,
  Sun
} from "lucide-react"
import { useRef, useEffect, useState } from "react"
import { useTheme } from "./contexts/ThemeContext"
import { useLanguage } from "./contexts/LanguageContext"

// 动画变体定义
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
}

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
}

const features = [
  {
    icon: <MessageSquare className="h-5 w-5" />,
    index: 0
  },
  {
    icon: <Cpu className="h-5 w-5" />,
    index: 1
  },
  {
    icon: <Code2 className="h-5 w-5" />,
    index: 2
  },
  {
    icon: <BookOpen className="h-5 w-5" />,
    index: 3
  },
  {
    icon: <Shield className="h-5 w-5" />,
    index: 4
  },
  {
    icon: <Zap className="h-5 w-5" />,
    index: 5
  }
]

const navItems = [
  { title: "features", href: "#features", sectionId: "features" },
  { title: "showcases", href: "#demo", sectionId: "demo" },
  { title: "pricing", href: "#pricing", sectionId: "pricing" },
]

interface PricingTier {
  key: 'starter' | 'pro' | 'enterprise'
  popular: boolean
}

interface TierData {
  name: string
  price: string
  originalPrice: string
  description: string
  features: string[]
  cta: string
}

const pricingTiers: PricingTier[] = [
  {
    key: 'starter',
    popular: false
  },
  {
    key: 'pro',
    popular: true
  },
  {
    key: 'enterprise',
    popular: false
  }
]

const TypewriterText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 50)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text])

  return <span>{displayText}</span>
}

const BackgroundGradient = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <motion.div
      className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
      animate={{
        x: [0, 100, 0],
        y: [0, 50, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }}
    />
    <motion.div
      className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
      animate={{
        x: [0, -100, 0],
        y: [0, -50, 0],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  </div>
)

export default function Home() {
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  })
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])

  const { theme, toggleTheme } = useTheme()
  const { language, toggleLanguage, t } = useLanguage()

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      const navHeight = 56 // 导航栏高度
      const sectionTop = section.offsetTop - navHeight
      window.scrollTo({
        top: sectionTop,
        behavior: "smooth"
      })
    }
  }
  
  return (
    <div className="flex flex-col min-h-screen" ref={targetRef}>
      <BackgroundGradient />
      
      {/* 导航栏 */}
      <motion.header
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-8">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <span className="text-sm font-bold text-primary-foreground">B</span>
            </div>
            <span className="text-lg font-semibold">BenChat</span>
            </motion.div>
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.05 }}
                >
                  {item.sectionId ? (
                    <button
                      onClick={() => scrollToSection(item.sectionId)}
                      className="text-sm font-medium text-muted-foreground hover:text-primary cursor-pointer"
                    >
                      {t(`nav.${item.title}`)}
                    </button>
                  ) : (
                    <Link 
                      href={item.href}
                      className="text-sm font-medium text-muted-foreground hover:text-primary"
                    >
                      {t(`nav.${item.title}`)}
                    </Link>
                  )}
                </motion.div>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary cursor-pointer"
              onClick={toggleLanguage}
            >
              <Globe2 className="h-4 w-4" />
              <span>{language === 'zh' ? '中文' : 'English'}</span>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full hover:bg-muted cursor-pointer"
              onClick={toggleTheme}
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Sun className="h-4 w-4 text-muted-foreground" />
              )}
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild>
                <Link href="/register">{t('nav.register')}</Link>
            </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-32 md:py-48 lg:py-64">
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col justify-center space-y-8 max-w-[900px] mx-auto"
              style={{ opacity, scale, y }}
            >
              <div className="space-y-4">
                <motion.div 
                  className="inline-block rounded-full bg-primary/10 px-6 py-2 text-base font-medium text-primary mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {t('hero.badge')}
                </motion.div>
                <motion.h1 
                  className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none text-center"
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                >
                  {t('hero.title')}
                </motion.h1>
                <motion.h2
                  className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-center mt-4"
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                >
                  <TypewriterText text={t('hero.subtitle')} />
                </motion.h2>
                <motion.p 
                  className="text-muted-foreground text-xl md:text-2xl text-center max-w-[800px] mx-auto mt-6"
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                >
                  {t('hero.description')}
                </motion.p>
                </div>
              <motion.div 
                className="flex flex-col gap-4 min-[400px]:flex-row justify-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" asChild className="bg-primary hover:bg-primary/90 h-14 px-8 text-lg">
                    <Link href="/login">
                      {t('hero.startButton')} <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
              <motion.p
                className="text-base text-muted-foreground mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {t('hero.promotion')}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* 演示部分 */}
        <section id="demo" className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden bg-white dark:bg-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-60"></div>
          <div className="container px-4 md:px-6 relative">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4"
              >
                {t('demo.title')}
              </motion.div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-4">
                {t('demo.subtitle')}
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 max-w-[800px]">
                {t('demo.description')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 w-full max-w-6xl">
                <motion.div
                  className="rounded-xl border bg-card p-8 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Code2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{t('demo.codeAssistant.title')}</h3>
                          <p className="text-sm text-muted-foreground">{t('demo.codeAssistant.subtitle')}</p>
                </div>
              </div>
                      <span className="text-sm text-muted-foreground">{t('demo.codeAssistant.liveDemo')}</span>
                    </div>

                <div className="space-y-4">
                      <div className="rounded-lg bg-muted/50 p-6 font-mono text-sm">
                        <div className="flex items-center gap-2 mb-3 text-muted-foreground text-xs">
                          <Code2 className="h-4 w-4" />
                          <span>index.ts</span>
                        </div>
                        <p className="space-y-2">
                          <span className="text-primary">function</span> calculateTotal(items) {`{`}
                          <br />
                          &nbsp;&nbsp;<span className="text-muted-foreground/80">{t('demo.codeAssistant.comment1')}</span>
                          <br />
                          &nbsp;&nbsp;return items
                          <br />
                          {`}`}
                        </p>
                      </div>

                      <motion.div 
                        className="rounded-lg bg-primary/5 p-6 border border-primary/10"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                            <Sparkles className="h-3 w-3 text-primary" />
                          </div>
                          <span className="font-medium text-primary">{t('demo.codeAssistant.title')}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {t('demo.codeAssistant.optimizationMessage')}
                        </p>
                      </motion.div>

                      <motion.div 
                        className="rounded-lg bg-muted/50 p-6 font-mono text-sm"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        <div className="flex items-center gap-2 mb-3 text-muted-foreground text-xs">
                          <Code2 className="h-4 w-4" />
                          <span>index.ts</span>
                        </div>
                        <p className="space-y-2">
                          <span className="text-primary">function</span> calculateTotal(items) {`{`}
                          <br />
                          &nbsp;&nbsp;<span className="text-muted-foreground/80">{t('demo.codeAssistant.comment2')}</span>
                          <br />
                          &nbsp;&nbsp;<span className="text-primary">if</span> (!Array.isArray(items)) {`{`}
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-primary">throw new</span> Error(<span className="text-green-500">'{t('demo.codeAssistant.errorMessage')}'</span>);
                          <br />
                          &nbsp;&nbsp;{`}`}
                          <br />
                          <br />
                          &nbsp;&nbsp;<span className="text-muted-foreground/80">{t('demo.codeAssistant.comment3')}</span>
                          <br />
                          &nbsp;&nbsp;<span className="text-primary">return</span> items.reduce{`((total, item) => {`}
                          <br />
                          &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-primary">return</span> total + (item.price * item.quantity);
                          <br />
                          &nbsp;&nbsp;{`}`}, 0);
                          <br />
                          {`}`}
                        </p>
                      </motion.div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="rounded-xl border bg-card p-8 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <MessageSquare className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{t('demo.chatAssistant.title')}</h3>
                          <p className="text-sm text-muted-foreground">{t('demo.chatAssistant.subtitle')}</p>
                        </div>
                    </div>
                      <span className="text-sm text-muted-foreground">{t('demo.chatAssistant.liveDemo')}</span>
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto p-2">
                      <div className="flex items-start gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                          <span className="text-sm font-bold text-primary-foreground">U</span>
                        </div>
                        <div className="flex-1">
                          <div className="rounded-2xl rounded-tl-none bg-muted/50 p-4">
                            <p className="text-sm leading-relaxed">{t('demo.chatAssistant.userQuestion')}</p>
                          </div>
                          <span className="text-xs text-muted-foreground mt-1 ml-2">10:24 AM</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                      <span className="text-sm font-bold text-primary-foreground">B</span>
                    </div>
                        <div className="flex-1">
                          <div className="rounded-2xl rounded-tl-none bg-primary/5 p-4 border border-primary/10">
                            <p className="text-sm leading-relaxed whitespace-pre-line">
                              {t('demo.chatAssistant.botResponse')}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground mt-1 ml-2">10:24 AM</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                          <span className="text-sm font-bold text-primary-foreground">U</span>
                        </div>
                        <div className="flex-1">
                          <div className="rounded-2xl rounded-tl-none bg-muted/50 p-4">
                            <p className="text-sm leading-relaxed">{t('demo.chatAssistant.userFollowUp')}</p>
                          </div>
                          <span className="text-xs text-muted-foreground mt-1 ml-2">10:25 AM</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                          <span className="text-sm font-bold text-primary-foreground">B</span>
                        </div>
                        <div className="flex-1">
                          <div className="rounded-2xl rounded-tl-none bg-primary/5 p-4 border border-primary/10">
                            <p className="text-sm leading-relaxed whitespace-pre-line">
                              {t('demo.chatAssistant.botFollowUpResponse')}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground mt-1 ml-2">10:25 AM</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                          <span className="text-sm font-bold text-primary-foreground">U</span>
                        </div>
                        <div className="flex-1">
                          <div className="rounded-2xl rounded-tl-none bg-muted/50 p-4">
                            <p className="text-sm leading-relaxed">{t('demo.chatAssistant.userFinalQuestion')}</p>
                          </div>
                          <span className="text-xs text-muted-foreground mt-1 ml-2">10:26 AM</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                          <span className="text-sm font-bold text-primary-foreground">B</span>
                        </div>
                        <div className="flex-1">
                          <div className="rounded-2xl rounded-tl-none bg-primary/5 p-4 border border-primary/10">
                            <p className="text-sm leading-relaxed whitespace-pre-line">
                              {t('demo.chatAssistant.botFinalResponse')}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground mt-1 ml-2">10:26 AM</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t mt-4">
                      <div className="flex-1 rounded-full bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
                        {t('demo.chatAssistant.inputPlaceholder')}
                      </div>
                      <button className="rounded-full bg-primary/10 p-2 text-primary hover:bg-primary/20">
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 特性部分 */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 relative bg-slate-50/50 dark:bg-slate-800/50">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-60"></div>
          <div className="container px-4 md:px-6 relative">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="max-w-[800px]">
                <motion.div 
                  className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4"
                >
                  {t('features.title')}
                </motion.div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-4">
                  {t('features.subtitle')}
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  {t('features.description')}
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 pt-12">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="group flex flex-col items-center space-y-4 rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-lg"
                    variants={itemVariants}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                    }}
                  >
                    <motion.div 
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors"
                      animate={floatingAnimation}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {t(`features.items.${index}.title`)}
                    </h3>
                    <p className="text-muted-foreground text-center">
                      {t(`features.items.${index}.description`)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
                </div>
        </section>

        {/* 价格订阅部分 */}
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 relative bg-white dark:bg-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-60"></div>
          <div className="container px-4 md:px-6 relative">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4"
              >
                {t('pricing.title')}
              </motion.div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl mb-4">
                {t('pricing.subtitle')}
              </h2>
              <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 max-w-[800px]">
                {t('pricing.description')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 w-full max-w-6xl">
                {pricingTiers.map((tier) => {
                  const tierData = t(`pricing.tiers.${tier.key}`) as unknown as TierData
                  return (
                    <motion.div
                      key={tier.key}
                      className={`relative flex flex-col p-8 bg-card rounded-xl border ${
                        tier.popular ? 'border-primary shadow-lg' : ''
                      }`}
                      variants={itemVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                      }}
                    >
                      {tier.popular && (
                        <div className="absolute top-0 right-8 -translate-y-1/2">
                          <span className="inline-block rounded-full bg-primary px-3 py-1 text-sm font-medium text-white">
                            {t('pricing.popular')}
                          </span>
              </div>
                      )}
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold">{tierData.name}</h3>
                        <p className="text-muted-foreground">{tierData.description}</p>
                </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold">{tierData.price}</span>
                          <span className="text-muted-foreground line-through">{tierData.originalPrice}</span>
              </div>
                        <p className="text-sm text-muted-foreground">{t('pricing.perMonth')}</p>
                </div>
                      <div className="my-8 space-y-3">
                        {tierData.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2">
                            <svg
                              className="h-4 w-4 text-primary flex-shrink-0"
                              fill="none"
                              strokeWidth="2.5"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                            <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
                        ))}
              </div>
                      <motion.div 
                        className="mt-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          className={`w-full ${tier.popular ? 'bg-primary text-primary-foreground' : ''}`}
                          variant={tier.popular ? "default" : "outline"}
                        >
                          {tierData.cta}
                        </Button>
                      </motion.div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA部分 */}
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden bg-slate-50/50 dark:bg-slate-800/50">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-60"></div>
          <div className="container px-4 md:px-6">
            <motion.div
              className="flex flex-col items-center justify-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {t('cta.title')}
              </motion.div>
              <div className="space-y-2 max-w-[800px]">
                <motion.h2 
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  {t('cta.subtitle')}
                </motion.h2>
                <motion.p 
                  className="mx-auto max-w-[600px] text-muted-foreground md:text-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  {t('cta.description')}
                </motion.p>
              </div>
              <motion.div 
                className="flex flex-col gap-2 min-[400px]:flex-row justify-center pt-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="min-w-[160px]" asChild>
                    <Link href="/login">
                      {t('nav.login')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" className="min-w-[160px]" asChild>
                    <Link href="/pricing">{t('cta.pricingButton')}</Link>
                  </Button>
                </motion.div>
              </motion.div>
              <motion.p
                className="text-sm text-muted-foreground mt-8 flex items-center gap-2 justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Shield className="h-4 w-4" /> {t('cta.security')}
              </motion.p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <motion.footer 
        className="w-full border-t py-12 bg-slate-50 dark:bg-slate-900"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <span className="text-sm font-bold text-primary-foreground">B</span>
                </div>
                <span className="text-lg font-semibold">BenChat</span>
              </motion.div>
              <p className="text-sm text-muted-foreground">
                {t('footer.slogan')}
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">{t('footer.product')}</h4>
              <nav className="flex flex-col space-y-2 text-sm text-muted-foreground">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link href="/features" className="hover:text-primary">{t('nav.features')}</Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link href="/pricing" className="hover:text-primary">{t('nav.pricing')}</Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link href="/docs" className="hover:text-primary">{t('nav.docs')}</Link>
                </motion.div>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">{t('footer.resources')}</h4>
              <nav className="flex flex-col space-y-2 text-sm text-muted-foreground">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link href="/blog" className="hover:text-primary">{t('footer.blog')}</Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link href="/showcases" className="hover:text-primary">{t('nav.showcases')}</Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link href="/help" className="hover:text-primary">{t('footer.helpCenter')}</Link>
                </motion.div>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">{t('footer.about')}</h4>
              <nav className="flex flex-col space-y-2 text-sm text-muted-foreground">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link href="/about" className="hover:text-primary">{t('footer.aboutUs')}</Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link href="/terms" className="hover:text-primary">{t('footer.terms')}</Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link href="/privacy" className="hover:text-primary">{t('footer.privacy')}</Link>
                </motion.div>
              </nav>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {t('footer.copyright')}
            </p>
            <div className="flex items-center gap-4">
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
                whileHover={{ scale: 1.1 }}
              >
                Twitter
              </motion.a>
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
                whileHover={{ scale: 1.1 }}
              >
                GitHub
              </motion.a>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}
