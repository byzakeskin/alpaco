import { type NextRequest, NextResponse } from "next/server"

// Mock user data - In production, connect to SQLite database
const users = [
  { id: "1", email: "admin@dropspot.com", password: "admin123", role: "admin" },
  { id: "2", email: "user@dropspot.com", password: "user123", role: "user" },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const token = Buffer.from(JSON.stringify({ userId: user.id, email: user.email, role: user.role })).toString(
      "base64",
    )

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
