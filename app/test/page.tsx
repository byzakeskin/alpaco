"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"

export default function TestPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            DropSpot Test Center
          </h1>
          <Link
            href="/drops"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium"
          >
            Back to Platform
          </Link>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-2">Platform Test Guide</h2>
          <p className="text-lg text-muted-foreground">Complete feature walkthrough</p>
        </div>

        {/* Test Scenarios */}
        <div className="space-y-6">
          {user.role === "admin" ? (
            <>
              <div className="p-6 rounded-xl border border-border bg-card">
                <h3 className="text-xl font-semibold text-foreground mb-3">Admin Panel</h3>
                <div className="space-y-3 mb-6 text-muted-foreground text-sm">
                  <p>✓ Create new drops with name, description, stock quantity</p>
                  <p>✓ Set drop dates and claim window times</p>
                  <p>✓ Edit existing drops and monitor claimed count</p>
                  <p>✓ Delete drops with confirmation dialog</p>
                  <p>✓ Real-time stock tracking and availability status</p>
                </div>
                <Link
                  href="/admin"
                  className="inline-block px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium"
                >
                  Go to Admin Panel
                </Link>
              </div>

              <div className="p-6 rounded-xl border border-border bg-card">
                <h3 className="text-xl font-semibold text-foreground mb-3">Testing Checklist</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>Create a new drop and verify it appears in user list</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>Edit a drop and check if changes are visible</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>Delete a drop and confirm removal from list</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>Set claim window for current time and test claiming</span>
                  </label>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="p-6 rounded-xl border border-border bg-card">
                <h3 className="text-xl font-semibold text-foreground mb-3">Browse Drops</h3>
                <div className="space-y-3 mb-6 text-muted-foreground text-sm">
                  <p>✓ View all available drops in a grid layout</p>
                  <p>✓ See stock progress with visual bar</p>
                  <p>✓ Check current status (Upcoming, Claiming Now, Sold Out)</p>
                  <p>✓ View drop descriptions and product images</p>
                  <p>✓ Monitor claim window dates</p>
                </div>
                <Link
                  href="/drops"
                  className="inline-block px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium"
                >
                  View All Drops
                </Link>
              </div>

              <div className="p-6 rounded-xl border border-border bg-card">
                <h3 className="text-xl font-semibold text-foreground mb-3">Waitlist System</h3>
                <div className="space-y-3 mb-6 text-muted-foreground text-sm">
                  <p>✓ Click "Join Waitlist" on any drop</p>
                  <p>✓ See your position in the waitlist queue</p>
                  <p>✓ Leave waitlist anytime with one click</p>
                  <p>✓ Monitor waitlist status on drop cards</p>
                  <p>✓ Position updates in real-time</p>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-border bg-card">
                <h3 className="text-xl font-semibold text-foreground mb-3">Claim Process</h3>
                <div className="space-y-3 mb-6 text-muted-foreground text-sm">
                  <p>✓ "Claim Now" button active during claim window</p>
                  <p>✓ Receive unique claim code upon claiming</p>
                  <p>✓ Claim code valid for 24 hours</p>
                  <p>✓ Copy code to clipboard with one click</p>
                  <p>✓ See success confirmation with decorative effects</p>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-border bg-card">
                <h3 className="text-xl font-semibold text-foreground mb-3">Testing Checklist</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>Join waitlist on a drop and see position appear</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>Leave waitlist and verify removal from card</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>Wait for claim window to open and claim a drop</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>Copy claim code and verify clipboard success</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>Verify "Sold Out" when stock is fully claimed</span>
                  </label>
                </div>
              </div>
            </>
          )}

          {/* Demo Accounts */}
          <div className="p-6 rounded-xl border border-primary/30 bg-primary/5">
            <h3 className="text-xl font-semibold text-foreground mb-3">Demo Accounts</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Admin Account</p>
                <div className="text-xs text-muted-foreground space-y-1 font-mono">
                  <p>Email: admin@dropspot.com</p>
                  <p>Password: admin123</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">User Account</p>
                <div className="text-xs text-muted-foreground space-y-1 font-mono">
                  <p>Email: user@dropspot.com</p>
                  <p>Password: user123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
