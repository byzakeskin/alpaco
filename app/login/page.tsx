"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import { LogIn } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(email, password)
      router.push("/drops")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoCredentials = (role: "admin" | "user") => {
    if (role === "admin") {
      setEmail("admin@dropspot.com")
      setPassword("admin123")
    } else {
      setEmail("user@dropspot.com")
      setPassword("user123")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            DropSpot
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to access exclusive drops</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive text-destructive text-sm animate-in">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition font-medium flex items-center justify-center gap-2"
          >
            <LogIn size={18} />
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="p-4 rounded-lg border border-border/50 bg-muted/30 mb-8">
          <p className="text-xs text-muted-foreground font-semibold mb-3 uppercase tracking-wide">Demo Credentials</p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => fillDemoCredentials("admin")}
              className="w-full px-3 py-2 rounded-lg bg-card border border-primary/30 text-primary hover:bg-primary/10 transition text-sm font-medium"
            >
              👨‍💼 Admin Demo
            </button>
            <button
              type="button"
              onClick={() => fillDemoCredentials("user")}
              className="w-full px-3 py-2 rounded-lg bg-card border border-secondary/30 text-secondary hover:bg-secondary/10 transition text-sm font-medium"
            >
              👤 User Demo
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-muted-foreground text-sm">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
