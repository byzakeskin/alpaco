import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Mock: Generate claim code
    const claimCode = `DS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
    const expiresAt = new Date(Date.now() + 86400000).toISOString() // 24 hours

    return NextResponse.json({
      claim_code: claimCode,
      expires_at: expiresAt,
    })
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
