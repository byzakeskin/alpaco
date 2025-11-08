"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { LogOut, Settings, Users, Heart } from "lucide-react"

interface Drop {
  id: string
  name: string
  description: string
  stock: number
  claimed: number
  imageUrl: string
  dropStartDate: string
  claimStartDate: string
  claimEndDate: string
  waitlist_count?: number
}

interface WaitlistEntry {
  dropId: string
  position: number
  isJoined: boolean
}

export default function DropsPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [drops, setDrops] = useState<Drop[]>([])
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    fetchDrops()
    fetchUserWaitlist()
  }, [user, router])

  const fetchDrops = async () => {
    try {
      const res = await fetch("/api/admin/drops")
      if (!res.ok) throw new Error("Failed to fetch drops")
      const data = await res.json()
      setDrops(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load drops")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserWaitlist = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/drops/waitlist", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setWaitlist(data)
      }
    } catch (err) {
      console.error("Failed to fetch waitlist")
    }
  }

  const isWaitlistJoined = (dropId: string) => {
    return waitlist.some((w) => w.dropId === dropId && w.isJoined)
  }

  const getWaitlistPosition = (dropId: string) => {
    const entry = waitlist.find((w) => w.dropId === dropId)
    return entry?.position || 0
  }

  const handleJoinWaitlist = async (dropId: string) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`/api/drops/${dropId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Failed to join waitlist")
      }

      setSuccessMsg("Successfully joined waitlist!")
      setTimeout(() => setSuccessMsg(""), 3000)
      await fetchUserWaitlist()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join waitlist")
    }
  }

  const handleLeaveWaitlist = async (dropId: string) => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`/api/drops/${dropId}/leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Failed to leave waitlist")
      }

      setSuccessMsg("Left waitlist")
      setTimeout(() => setSuccessMsg(""), 3000)
      await fetchUserWaitlist()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to leave waitlist")
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const isClaimWindowOpen = (drop: Drop) => {
    const now = new Date()
    const start = new Date(drop.claimStartDate)
    const end = new Date(drop.claimEndDate)
    return now >= start && now <= end
  }

  const getStatusBadge = (drop: Drop) => {
    if (drop.claimed >= drop.stock) return { label: "Sold Out", color: "bg-destructive" }
    if (isClaimWindowOpen(drop)) return { label: "Claiming Now", color: "bg-secondary" }
    return { label: "Upcoming", color: "bg-primary" }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            DropSpot
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
            {user?.role === "admin" && (
              <button
                onClick={() => router.push("/admin")}
                className="px-4 py-2 rounded-lg text-sm border border-primary text-primary hover:bg-primary/10 transition font-medium flex items-center gap-2"
              >
                <Settings size={16} /> Admin
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm border border-border hover:bg-muted transition font-medium flex items-center gap-2"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-3">Active Drops</h2>
          <p className="text-lg text-muted-foreground">
            Join waitlists, wait for claim windows, and secure exclusive items
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive text-destructive mb-6">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-lg bg-primary/10 border border-primary text-primary mb-6">{successMsg}</div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div>
              <div className="inline-block w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="text-muted-foreground text-center">Loading drops...</p>
            </div>
          </div>
        ) : drops.length === 0 ? (
          <div className="text-center py-32 p-8 rounded-xl border border-border bg-card">
            <div className="text-6xl mb-4">✨</div>
            <p className="text-muted-foreground text-xl mb-2">No drops available yet</p>
            <p className="text-sm text-muted-foreground">Check back soon for exclusive limited edition items</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drops.map((drop) => {
              const status = getStatusBadge(drop)
              const progress = (drop.claimed / drop.stock) * 100
              const isJoined = isWaitlistJoined(drop.id)
              const position = getWaitlistPosition(drop.id)

              return (
                <div
                  key={drop.id}
                  className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg duration-300"
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden bg-muted h-48">
                    <img
                      src={drop.imageUrl || "/placeholder.svg"}
                      alt={drop.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                    <div
                      className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium text-white ${status.color}`}
                    >
                      {status.label}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{drop.name}</h3>
                    {drop.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{drop.description}</p>
                    )}

                    {/* Waitlist Info */}
                    {isJoined && (
                      <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                        <div className="flex items-center gap-2 mb-1">
                          <Users size={14} className="text-primary" />
                          <span className="text-xs font-medium text-primary">In Waitlist</span>
                        </div>
                        <p className="text-xs text-primary/80">
                          Position: <span className="font-bold">{position}</span>
                        </p>
                      </div>
                    )}

                    {/* Stock Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-foreground">Availability</span>
                        <span className="text-sm text-primary font-medium">
                          {drop.claimed}/{drop.stock}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-6 text-sm border-t border-border pt-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Stock:</span>
                        <span className="font-medium text-foreground">{drop.stock} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Claim Window:</span>
                        <span className="text-xs text-primary font-medium">
                          {new Date(drop.claimStartDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-2">
                      {isClaimWindowOpen(drop) ? (
                        <button
                          onClick={() => router.push(`/drops/${drop.id}/claim`)}
                          disabled={drop.claimed >= drop.stock}
                          className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                        >
                          {drop.claimed >= drop.stock ? "Sold Out" : "Claim Now"}
                        </button>
                      ) : isJoined ? (
                        <button
                          onClick={() => handleLeaveWaitlist(drop.id)}
                          className="w-full py-3 rounded-lg border border-destructive text-destructive hover:bg-destructive/10 transition font-medium flex items-center justify-center gap-2"
                        >
                          <Heart size={16} fill="currentColor" /> Leave Waitlist
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJoinWaitlist(drop.id)}
                          className="w-full py-3 rounded-lg border border-primary text-primary hover:bg-primary/10 transition font-medium flex items-center justify-center gap-2"
                        >
                          <Heart size={16} /> Join Waitlist
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
