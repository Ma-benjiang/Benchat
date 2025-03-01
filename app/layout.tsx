import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from '@/components/ui/toaster'
import { UserConfigProvider } from '@/context/user-config-context'
import SupabaseSessionProvider from '@/components/supabase-session-provider'
import { Toaster as SonnerToaster } from 'sonner'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BenChat",
  description: "Your AI Assistant",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserConfigProvider>
            <SupabaseSessionProvider>
              {children}
            </SupabaseSessionProvider>
            <Toaster />
            <SonnerToaster position="top-center" />
          </UserConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
