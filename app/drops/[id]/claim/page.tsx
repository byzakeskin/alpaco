"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Copy, CheckCircle } from "lucide-react"

interface ClaimData {
  claim_code: string
  expires_at: string
}

export default function ClaimPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [claimData, setClaimData] = useState<ClaimData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    fetchClaim()
  }, [user, router])

  const fetchClaim = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`/api/drops/${params.id}/claim`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Failed to claim")
      }

      const data = await res.json()
      setClaimData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to claim drop")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (claimData?.claim_code) {
      navigator.clipboard.writeText(claimData.claim_code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <button
          onClick={() => router.push("/drops")}
          className="text-muted-foreground hover:text-primary transition mb-8 flex items-center gap-2 font-medium"
        >
          ← Back to Drops
        </button>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-6 rounded-xl border border-destructive bg-destructive/10 animate-in">
            <h2 className="text-xl font-bold text-destructive mb-2">Unable to Claim</h2>
            <p className="text-destructive/80 mb-4">{error}</p>
            <button
              onClick={() => router.push("/drops")}
              className="w-full py-2 rounded-lg bg-destructive text-white hover:bg-destructive/90 transition font-medium text-sm"
            >
              Return to Drops
            </button>
          </div>
        ) : claimData ? (
          <div className="p-8 rounded-xl border border-primary/30 bg-card shadow-xl animate-in overflow-hidden relative">
            {/* Background glow effect */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-0"></div>

            <div className="text-center relative z-10">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-secondary/20 rounded-full blur-lg animate-pulse"></div>
                  <CheckCircle className="w-16 h-16 text-secondary relative" />
                </div>
              </div>

              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                Success!
              </h1>
              <p className="text-muted-foreground mb-8">You've successfully claimed your drop. Save your code below.</p>

              <div className="bg-muted/50 rounded-lg p-6 mb-6 border border-border/50 backdrop-blur-sm">
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-semibold">Claim Code</p>
                <p className="text-3xl font-mono font-bold text-primary break-all mb-4">{claimData.claim_code}</p>
                <button
                  onClick={copyToClipboard}
                  className="w-full py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium text-sm flex items-center justify-center gap-2"
                >
                  <Copy size={16} /> {copied ? "✓ Copied!" : "Copy Code"}
                </button>
              </div>

              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 mb-6">
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  ⏱️ Valid until:{" "}
                  <span className="font-semibold">{new Date(claimData.expires_at).toLocaleString()}</span>
                </p>
              </div>

              <button
                onClick={() => router.push("/drops")}
                className="w-full py-3 rounded-lg border border-border text-foreground hover:bg-muted transition font-medium"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
