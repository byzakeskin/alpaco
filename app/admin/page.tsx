"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Trash2, Edit2, Plus } from "lucide-react"

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
}

export default function AdminPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [drops, setDrops] = useState<Drop[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    stock: 0,
    imageUrl: "",
    dropStartDate: "",
    claimStartDate: "",
    claimEndDate: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
    if (user.role !== "admin") {
      router.push("/drops")
      return
    }
    fetchDrops()
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const method = editingId ? "PUT" : "POST"
      const url = editingId ? `/api/admin/drops/${editingId}` : "/api/admin/drops"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || "Operation failed")
      }

      setSuccess(editingId ? "Drop updated successfully!" : "Drop created successfully!")
      fetchDrops()
      resetForm()
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed")
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this drop?")) return

    try {
      const res = await fetch(`/api/admin/drops/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      setSuccess("Drop deleted successfully!")
      fetchDrops()
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete")
    }
  }

  const handleEdit = (drop: Drop) => {
    setFormData({
      name: drop.name,
      description: drop.description,
      stock: drop.stock,
      imageUrl: drop.imageUrl,
      dropStartDate: drop.dropStartDate.slice(0, 16),
      claimStartDate: drop.claimStartDate.slice(0, 16),
      claimEndDate: drop.claimEndDate.slice(0, 16),
    })
    setEditingId(drop.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      name: "",
      description: "",
      stock: 0,
      imageUrl: "",
      dropStartDate: "",
      claimStartDate: "",
      claimEndDate: "",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            DropSpot Admin
          </h1>
          <button
            onClick={() => {
              logout()
              router.push("/")
            }}
            className="px-4 py-2 rounded-lg text-sm border border-border hover:bg-muted transition font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-2">Manage Drops</h2>
            <p className="text-muted-foreground">Create, edit, and delete limited edition drops</p>
          </div>
          <button
            onClick={() => {
              if (showForm) resetForm()
              else setShowForm(true)
            }}
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium flex items-center gap-2 shadow-lg"
          >
            <Plus size={20} /> {showForm ? "Cancel" : "New Drop"}
          </button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive text-destructive mb-6 animate-in">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500 text-green-500 mb-6 animate-in">
            {success}
          </div>
        )}

        {/* Form Section */}
        {showForm && (
          <div className="p-8 rounded-xl border border-border bg-card mb-10 shadow-lg">
            <h3 className="text-xl font-semibold text-foreground mb-6">
              {editingId ? "Edit Drop" : "Create New Drop"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., Limited Edition Sneakers"
                    className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Stock Quantity *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number.parseInt(e.target.value) || 0 })}
                    required
                    min="1"
                    placeholder="e.g., 50"
                    className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add product details and specifications"
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Drop Start Date *</label>
                  <input
                    type="datetime-local"
                    value={formData.dropStartDate}
                    onChange={(e) => setFormData({ ...formData, dropStartDate: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground focus:border-primary focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Claim Start *</label>
                  <input
                    type="datetime-local"
                    value={formData.claimStartDate}
                    onChange={(e) => setFormData({ ...formData, claimStartDate: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground focus:border-primary focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Claim End *</label>
                  <input
                    type="datetime-local"
                    value={formData.claimEndDate}
                    onChange={(e) => setFormData({ ...formData, claimEndDate: e.target.value })}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground focus:border-primary focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition font-medium"
                >
                  {editingId ? "Update Drop" : "Create Drop"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-lg border border-border text-foreground hover:bg-muted transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Drops Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : drops.length === 0 ? (
          <div className="text-center py-20 p-8 rounded-xl border border-border bg-card">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-muted-foreground text-lg">No drops created yet</p>
            <p className="text-sm text-muted-foreground mt-2">Create your first drop to get started</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drops.map((drop) => (
              <div
                key={drop.id}
                className="rounded-xl border border-border bg-card hover:border-primary/50 transition overflow-hidden shadow-sm hover:shadow-lg"
              >
                <img
                  src={drop.imageUrl || "/placeholder.svg"}
                  alt={drop.name}
                  className="w-full h-48 object-cover bg-muted"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{drop.name}</h3>
                  {drop.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{drop.description}</p>
                  )}

                  <div className="space-y-2 mb-6 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stock:</span>
                      <span className="font-medium text-foreground">{drop.stock} units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Claimed:</span>
                      <span className="font-medium text-secondary">
                        {drop.claimed}/{drop.stock}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-primary font-medium">
                        Claim: {new Date(drop.claimStartDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(drop)}
                      className="flex-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <Edit2 size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(drop.id)}
                      className="px-3 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition font-medium text-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
