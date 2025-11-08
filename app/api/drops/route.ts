import { type NextRequest, NextResponse } from "next/server"

// Mock data
const drops = [
  {
    id: "1",
    name: "Limited Edition Sneakers",
    stock: 50,
    claim_window_start: new Date(Date.now() + 3600000).toISOString(),
    claim_window_end: new Date(Date.now() + 7200000).toISOString(),
    created_at: new Date().toISOString(),
    waitlist_count: 12,
  },
  {
    id: "2",
    name: "Exclusive Jacket",
    stock: 30,
    claim_window_start: new Date(Date.now() + 86400000).toISOString(),
    claim_window_end: new Date(Date.now() + 172800000).toISOString(),
    created_at: new Date().toISOString(),
    waitlist_count: 8,
  },
  {
    id: "3",
    name: "Premium Watch",
    stock: 20,
    claim_window_start: new Date(Date.now() - 3600000).toISOString(),
    claim_window_end: new Date(Date.now() + 1800000).toISOString(),
    created_at: new Date().toISOString(),
    waitlist_count: 25,
  },
]

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(drops)
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
