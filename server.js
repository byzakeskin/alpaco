import express from "express"
import cors from "cors"
import sqlite3 from "sqlite3"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET || "dropspot_secret_key_2025"

app.use(cors())
app.use(express.json())

// SQLite Database Connection
const db = new sqlite3.Database(path.join(__dirname, "db", "dropspot.db"), (err) => {
  if (err) {
    console.error("Database connection error:", err)
  } else {
    console.log("Connected to SQLite database")
  }
})

// Middleware: Verify JWT Token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) return res.status(401).json({ error: "No token provided" })

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" })
    req.user = decoded
    next()
  })
}

// Middleware: Verify Admin Role
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" })
  }
  next()
}

// ========== AUTH ROUTES ==========

// POST /api/auth/signup
app.post("/api/auth/signup", async (req, res) => {
  const { email, password, role = "user" } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  db.run("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", [email, hashedPassword, role], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE")) {
        return res.status(400).json({ error: "Email already exists" })
      }
      return res.status(500).json({ error: "Signup failed" })
    }

    const token = jwt.sign({ id: this.lastID, email, role }, JWT_SECRET, { expiresIn: "24h" })

    res.json({
      message: "Signup successful",
      token,
      user: { id: this.lastID, email, role },
    })
  })
})

// POST /api/auth/login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" })
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "24h" })

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, role: user.role },
    })
  })
})

// ========== DROPS ROUTES ==========

// GET /api/drops - Get all drops
app.get("/api/drops", (req, res) => {
  db.all(
    "SELECT id, name, description, stock, claimed, imageUrl, dropStartDate, claimStartDate, claimEndDate, createdAt FROM drops ORDER BY dropStartDate DESC",
    (err, drops) => {
      if (err) return res.status(500).json({ error: "Failed to fetch drops" })
      res.json(drops)
    },
  )
})

// GET /api/drops/:id - Get single drop
app.get("/api/drops/:id", (req, res) => {
  db.get("SELECT * FROM drops WHERE id = ?", [req.params.id], (err, drop) => {
    if (err || !drop) return res.status(404).json({ error: "Drop not found" })
    res.json(drop)
  })
})

// POST /api/drops - Create drop (Admin only)
app.post("/api/drops", verifyToken, verifyAdmin, (req, res) => {
  const { name, description, stock, imageUrl, dropStartDate, claimStartDate, claimEndDate } = req.body

  if (!name || !stock) {
    return res.status(400).json({ error: "Name and stock are required" })
  }

  db.run(
    `INSERT INTO drops (name, description, stock, claimed, imageUrl, dropStartDate, claimStartDate, claimEndDate)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, description, stock, 0, imageUrl || null, dropStartDate, claimStartDate, claimEndDate],
    function (err) {
      if (err) return res.status(500).json({ error: "Failed to create drop" })
      res.json({
        message: "Drop created",
        id: this.lastID,
        drop: {
          id: this.lastID,
          name,
          description,
          stock,
          claimed: 0,
          imageUrl,
          dropStartDate,
          claimStartDate,
          claimEndDate,
        },
      })
    },
  )
})

// PUT /api/drops/:id - Update drop (Admin only)
app.put("/api/drops/:id", verifyToken, verifyAdmin, (req, res) => {
  const { name, description, stock, imageUrl, dropStartDate, claimStartDate, claimEndDate } = req.body

  db.run(
    `UPDATE drops SET name = ?, description = ?, stock = ?, imageUrl = ?, dropStartDate = ?, claimStartDate = ?, claimEndDate = ? WHERE id = ?`,
    [name, description, stock, imageUrl, dropStartDate, claimStartDate, claimEndDate, req.params.id],
    function (err) {
      if (err || this.changes === 0) {
        return res.status(404).json({ error: "Drop not found or update failed" })
      }
      res.json({ message: "Drop updated", id: req.params.id })
    },
  )
})

// DELETE /api/drops/:id - Delete drop (Admin only)
app.delete("/api/drops/:id", verifyToken, verifyAdmin, (req, res) => {
  db.run("DELETE FROM drops WHERE id = ?", [req.params.id], function (err) {
    if (err || this.changes === 0) {
      return res.status(404).json({ error: "Drop not found or delete failed" })
    }
    res.json({ message: "Drop deleted" })
  })
})

// ========== WAITLIST ROUTES ==========

// GET /api/waitlist/:dropId - Get waitlist for a drop
app.get("/api/waitlist/:dropId", verifyToken, verifyAdmin, (req, res) => {
  db.all(
    "SELECT id, userId, dropId, position, createdAt FROM waitlist WHERE dropId = ? ORDER BY position ASC",
    [req.params.dropId],
    (err, waitlist) => {
      if (err) return res.status(500).json({ error: "Failed to fetch waitlist" })
      res.json(waitlist)
    },
  )
})

// POST /api/waitlist - Join waitlist
app.post("/api/waitlist", verifyToken, (req, res) => {
  const { dropId } = req.body
  const userId = req.user.id

  db.get("SELECT COUNT(*) as count FROM waitlist WHERE dropId = ?", [dropId], (err, result) => {
    const position = result.count + 1

    db.run("INSERT INTO waitlist (userId, dropId, position) VALUES (?, ?, ?)", [userId, dropId, position], (err) => {
      if (err) return res.status(500).json({ error: "Failed to join waitlist" })
      res.json({ message: "Joined waitlist", position })
    })
  })
})

// ========== CLAIMS ROUTES ==========

// POST /api/claims - Claim an item
app.post("/api/claims", verifyToken, (req, res) => {
  const { dropId } = req.body
  const userId = req.user.id
  const now = new Date().toISOString()

  db.get("SELECT * FROM drops WHERE id = ?", [dropId], (err, drop) => {
    if (err || !drop) return res.status(404).json({ error: "Drop not found" })

    const claimStart = new Date(drop.claimStartDate)
    const claimEnd = new Date(drop.claimEndDate)
    const currentTime = new Date(now)

    if (currentTime < claimStart || currentTime > claimEnd) {
      return res.status(400).json({ error: "Claim window is closed" })
    }

    if (drop.claimed >= drop.stock) {
      return res.status(400).json({ error: "All items have been claimed" })
    }

    db.run("INSERT INTO claims (userId, dropId) VALUES (?, ?)", [userId, dropId], function (err) {
      if (err) {
        if (err.message.includes("UNIQUE")) {
          return res.status(400).json({ error: "You have already claimed this item" })
        }
        return res.status(500).json({ error: "Failed to claim item" })
      }

      db.run("UPDATE drops SET claimed = claimed + 1 WHERE id = ?", [dropId], (err) => {
        if (err) return res.status(500).json({ error: "Failed to update drop" })
        res.json({ message: "Item claimed successfully", claimId: this.lastID })
      })
    })
  })
})

// GET /api/claims/user/:userId - Get user's claims
app.get("/api/claims/user/:userId", verifyToken, (req, res) => {
  const userId = req.params.userId

  if (Number.parseInt(userId) !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied" })
  }

  db.all(
    "SELECT c.id, c.userId, c.dropId, c.claimedAt, d.name, d.imageUrl FROM claims c JOIN drops d ON c.dropId = d.id WHERE c.userId = ?",
    [userId],
    (err, claims) => {
      if (err) return res.status(500).json({ error: "Failed to fetch claims" })
      res.json(claims)
    },
  )
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: "Internal server error" })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
