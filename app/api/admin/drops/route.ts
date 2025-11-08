import { type NextRequest, NextResponse } from "next/server"

// Mock admin drops storage with extended schema
const adminDrops = [
  {
    id: "1",
    name: "Limited Edition Sneakers",
    description: "Exclusive collaboration with premium brands",
    stock: 50,
    claimed: 15,
    imageUrl: "/limited-edition-sneakers.png",
    dropStartDate: new Date(Date.now() - 86400000).toISOString(),
    claimStartDate: new Date(Date.now() + 3600000).toISOString(),
    claimEndDate: new Date(Date.now() + 7200000).toISOString(),
  },
  {
    id: "2",
    name: "Exclusive Jacket",
    description: "Premium material, limited stock",
    stock: 30,
    claimed: 8,
    imageUrl: "/exclusive-jacket.png",
    dropStartDate: new Date(Date.now() - 172800000).toISOString(),
    claimStartDate: new Date(Date.now() + 86400000).toISOString(),
    claimEndDate: new Date(Date.now() + 172800000).toISOString(),
  },
]

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(adminDrops)
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.stock) {
      return NextResponse.json({ message: "Name and stock are required" }, { status: 400 })
    }

    const newDrop = {
      id: Date.now().toString(),
      name: body.name,
      description: body.description || "",
      stock: body.stock,
      claimed: 0,
      imageUrl: body.imageUrl || "/diverse-products-still-life.png",
      dropStartDate: body.dropStartDate || new Date().toISOString(),
      claimStartDate: body.claimStartDate || new Date(Date.now() + 3600000).toISOString(),
      claimEndDate: body.claimEndDate || new Date(Date.now() + 7200000).toISOString(),
    }

    adminDrops.push(newDrop)

    return NextResponse.json(newDrop, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
