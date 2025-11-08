import { type NextRequest, NextResponse } from "next/server"

let adminDrops = [
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

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const drop = adminDrops.find((d) => d.id === id)

    if (!drop) {
      return NextResponse.json({ message: "Drop not found" }, { status: 404 })
    }

    return NextResponse.json(drop)
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const index = adminDrops.findIndex((d) => d.id === id)
    if (index === -1) {
      return NextResponse.json({ message: "Drop not found" }, { status: 404 })
    }

    adminDrops[index] = {
      ...adminDrops[index],
      name: body.name || adminDrops[index].name,
      description: body.description !== undefined ? body.description : adminDrops[index].description,
      stock: body.stock || adminDrops[index].stock,
      imageUrl: body.imageUrl || adminDrops[index].imageUrl,
      dropStartDate: body.dropStartDate || adminDrops[index].dropStartDate,
      claimStartDate: body.claimStartDate || adminDrops[index].claimStartDate,
      claimEndDate: body.claimEndDate || adminDrops[index].claimEndDate,
    }

    return NextResponse.json(adminDrops[index])
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const index = adminDrops.findIndex((d) => d.id === id)
    if (index === -1) {
      return NextResponse.json({ message: "Drop not found" }, { status: 404 })
    }

    adminDrops = adminDrops.filter((d) => d.id !== id)

    return NextResponse.json({ message: "Drop deleted successfully" })
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
