import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { UserConfigProvider } from "@/context/user-config-context"
import { Toaster as SonnerToaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BenChat",
  description: "An AI assistant that's helpful, harmless, and honest.",
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
          <UserConfigProvider>
            {children}
            <Toaster />
            <SonnerToaster position="top-center" />
          </UserConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
