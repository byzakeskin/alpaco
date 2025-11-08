import sqlite3 from "sqlite3"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, "..", "db", "dropspot.db")

// Create db directory if it doesn't exist
const dbDir = path.dirname(dbPath)
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err)
    process.exit(1)
  }
  console.log("Connected to SQLite database")
  initDatabase()
})

function initDatabase() {
  // Create users table
  db.run(
    `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `,
    (err) => {
      if (err) console.error("Error creating users table:", err)
      else console.log("Users table created/verified")
    },
  )

  // Create drops table
  db.run(
    `
    CREATE TABLE IF NOT EXISTS drops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      stock INTEGER NOT NULL,
      claimed INTEGER DEFAULT 0,
      imageUrl TEXT,
      dropStartDate DATETIME NOT NULL,
      claimStartDate DATETIME NOT NULL,
      claimEndDate DATETIME NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `,
    (err) => {
      if (err) console.error("Error creating drops table:", err)
      else console.log("Drops table created/verified")
    },
  )

  // Create waitlist table
  db.run(
    `
    CREATE TABLE IF NOT EXISTS waitlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      dropId INTEGER NOT NULL,
      position INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (dropId) REFERENCES drops(id) ON DELETE CASCADE,
      UNIQUE(userId, dropId)
    )
  `,
    (err) => {
      if (err) console.error("Error creating waitlist table:", err)
      else console.log("Waitlist table created/verified")
    },
  )

  // Create claims table
  db.run(
    `
    CREATE TABLE IF NOT EXISTS claims (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      dropId INTEGER NOT NULL,
      claimedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (dropId) REFERENCES drops(id) ON DELETE CASCADE,
      UNIQUE(userId, dropId)
    )
  `,
    (err) => {
      if (err) console.error("Error creating claims table:", err)
      else console.log("Claims table created/verified")
    },
  )

  // Seed test data
  db.run(
    `
    INSERT OR IGNORE INTO users (id, email, password, role) VALUES
    (1, 'admin@dropspot.com', '$2b$10$abcdef1234567890abcdefghijklmnopqr', 'admin'),
    (2, 'user@dropspot.com', '$2b$10$abcdef1234567890abcdefghijklmnopqr', 'user')
  `,
    (err) => {
      if (err) console.error("Error seeding users:", err)
      else console.log("Users seeded")
    },
  )

  setTimeout(() => {
    db.close()
    console.log("Database initialized successfully!")
    process.exit(0)
  }, 1000)
}
