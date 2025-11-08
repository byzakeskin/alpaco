import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Mock: Return user's waitlist entries with positions
    const mockWaitlist = [
      { dropId: "1", position: 12, isJoined: true },
      { dropId: "2", position: 5, isJoined: true },
    ]

    return NextResponse.json(mockWaitlist)
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
