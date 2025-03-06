import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/sonner"
import { ReduxProvider } from "@/store/redux.provider"
import UserComponent from "@/components/user-component"

// import { Toast } from "@/components/toaster"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SocialHub - Connect, Share, Engage",
  description: "A modern social media platform for connecting with friends and sharing your thoughts.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <UserComponent/>
          {children}
        </ReduxProvider>
        <Toaster />
      </body>
    </html>
  )
}

