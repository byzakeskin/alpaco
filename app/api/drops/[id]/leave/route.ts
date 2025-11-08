import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Mock: Always successful
    return NextResponse.json({ message: "Left waitlist successfully" })
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
