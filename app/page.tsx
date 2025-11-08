"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        if (user.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/drops")
        }
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-foreground">✦ DropSpot</div>
          <div className="flex gap-4">
            <Link href="/login" className="px-6 py-2 rounded-lg text-foreground hover:bg-muted transition">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Exclusive Drops, Fair Access
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            Join waitlists for limited edition products and secure your claim when the drop window opens.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium"
            >
              Get Started
            </Link>
            <button className="px-8 py-3 rounded-lg border border-border text-foreground hover:bg-muted transition font-medium">
              Learn More
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="p-8 rounded-xl border border-border bg-card hover:border-primary/50 transition">
            <div className="text-3xl mb-4">⏱️</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Fair Waitlist</h3>
            <p className="text-muted-foreground">
              Everyone gets equal chances. Claim windows are transparent and time-based.
            </p>
          </div>
          <div className="p-8 rounded-xl border border-border bg-card hover:border-primary/50 transition">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Secure Transactions</h3>
            <p className="text-muted-foreground">
              Protected authentication and transaction verification for peace of mind.
            </p>
          </div>
          <div className="p-8 rounded-xl border border-border bg-card hover:border-primary/50 transition">
            <div className="text-3xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Real-time Updates</h3>
            <p className="text-muted-foreground">Get notified instantly when drops go live and claim windows open.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
