import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Mock: Extract user ID from token (in real app, verify JWT)
    const userId = `user-${Math.random().toString(36).substr(2, 9)}`

    // Mock: Check if already in waitlist
    const isAlreadyJoined = Math.random() > 0.95 // 5% chance already joined

    if (isAlreadyJoined) {
      return NextResponse.json({ message: "Already in waitlist for this drop" }, { status: 400 })
    }

    // Mock: Calculate position based on drop ID (deterministic)
    const position = Number.parseInt(id) + Math.floor(Math.random() * 50) + 1

    return NextResponse.json({ message: "Joined waitlist successfully", position })
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
