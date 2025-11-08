import { type NextRequest, NextResponse } from "next/server"

// Mock storage
const registeredUsers: any[] = [{ id: "1", email: "admin@dropspot.com", password: "admin123", role: "admin" }]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const userExists = registeredUsers.find((u) => u.email === email)
    if (userExists) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      role: "user",
    }

    registeredUsers.push(newUser)

    const token = Buffer.from(JSON.stringify({ userId: newUser.id, email: newUser.email })).toString("base64")

    return NextResponse.json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
    })
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
