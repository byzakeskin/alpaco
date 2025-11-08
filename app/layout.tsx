import type React from "react"
import type { Metadata } from "next"
import { AuthProvider } from "@/context/AuthContext"
import "./globals.css"

export const metadata: Metadata = {
  title: "DropSpot - Exclusive Drops",
  description: "Fair waitlist and drop platform",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
