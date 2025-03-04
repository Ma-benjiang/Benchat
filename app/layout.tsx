import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "./contexts/ThemeContext"
import { LanguageProvider } from "./contexts/LanguageContext"
import { Toaster } from '@/components/ui/toaster'
import { UserConfigProvider } from '@/context/user-config-context'
import SupabaseSessionProvider from '@/components/supabase-session-provider'
import { Toaster as SonnerToaster } from 'sonner'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BenChat - Your AI Assistant",
  description: "BenChat is an intelligent AI assistant that helps you work and learn more efficiently.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            <UserConfigProvider>
              <SupabaseSessionProvider>
                {children}
              </SupabaseSessionProvider>
              <Toaster />
              <SonnerToaster position="top-center" />
            </UserConfigProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
