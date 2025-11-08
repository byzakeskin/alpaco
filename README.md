# DropSpot - Exclusive Drop Platform

A modern full-stack application for managing limited edition product drops with waitlist and claim system.

## 📷 Images
![Main Page](https://github.com/byzakeskin/alpaco/blob/main/main.png)
![SignUp-SignIn Page](https://github.com/byzakeskin/alpaco/blob/main/signup-signin.png)
![Drop Page](https://github.com/byzakeskin/alpaco/blob/main/drops.png)
![Admin Page](https://github.com/byzakeskin/alpaco/blob/main/admin-page.png)
![Admin Edit Page](https://github.com/byzakeskin/alpaco/blob/main/admin-edit.png)

## 🎯 Features

- **User Authentication**: Sign up and login with JWT
- **Drop Management**: Browse exclusive limited edition items
- **Waitlist System**: Join/leave waitlists with position tracking
- **Claim Window**: Claim items during active claim periods
- **Admin Panel**: Full CRUD operations for drops
- **Real-time Status**: Live stock updates and claim window status

## 🛠️ Tech Stack

- **Frontend**: React + Next.js 16 + TypeScript
- **Backend**: Node.js + Express + SQLite
- **Styling**: Tailwind CSS v4
- **Authentication**: JWT
- **State Management**: React Context API

## 📁 Project Structure

\`\`\`
dropspot/
├── app/
│   ├── layout.tsx              # Root layout with auth provider
│   ├── page.tsx                # Landing/home page
│   ├── login/                  # Login page
│   ├── signup/                 # Sign up page
│   ├── drops/
│   │   ├── page.tsx            # Main drops listing page
│   │   └── [id]/claim/         # Claim page for specific drop
│   ├── admin/                  # Admin panel
│   └── api/
│       ├── auth/               # Authentication routes
│       ├── admin/drops/        # Admin CRUD routes
│       └── drops/              # User drop routes
├── context/
│   └── AuthContext.tsx         # Auth state management
├── server.js                   # Express backend
├── scripts/
│   └── init-db.js              # Database initialization
└── README.md
\`\`\`

## 🚀 Quick Start

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Setup Database
\`\`\`bash
node scripts/init-db.js
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000)

## 👤 Test Accounts

### Admin Account
- Email: `admin@dropspot.com`
- Password: `admin123`
- Access: Full CRUD operations on drops

### User Account
- Email: `user@dropspot.com`
- Password: `user123`
- Access: Browse drops, join waitlists, claim items

## 📋 User Workflow

1. **Sign Up/Login** → Create account or access existing
2. **Browse Drops** → View all active and upcoming drops
3. **Join Waitlist** → Click "Join Waitlist" on any drop
4. **Monitor Position** → See your position in the waitlist
5. **Wait for Claim Window** → Drop shows status and claim dates
6. **Claim During Window** → Click "Claim Now" when window is open
7. **Get Claim Code** → Receive unique code valid for 24 hours

## ⚙️ Admin Workflow

1. **Login as Admin** → Use admin credentials
2. **Go to Admin Panel** → Click admin button or visit /admin
3. **Create New Drop** → Click "New Drop" and fill form
4. **Edit Drop** → Click "Edit" on any drop card
5. **Delete Drop** → Click trash icon (with confirmation)
6. **Monitor Status** → See real-time claimed/stock counts

## 🎨 Key Pages

### Drops Page (`/drops`)
- Grid layout of all active drops
- Waitlist status indicator
- Stock progress bar
- Join/Leave/Claim buttons based on drop status

### Claim Page (`/drops/[id]/claim`)
- Success screen after claiming
- Unique claim code (24-hour validity)
- Copy to clipboard functionality
- Countdown timer

### Admin Panel (`/admin`)
- Form to create/edit drops
- Grid view of all drops
- Edit/Delete actions
- Real-time claim tracking

## 🔐 Authentication

- JWT-based token authentication
- Tokens stored in localStorage
- Admin role verification
- Protected routes based on user role

## 📊 Data Models

### Drops
\`\`\`typescript
{
  id: string
  name: string
  description: string
  stock: number
  claimed: number
  imageUrl: string
  dropStartDate: string
  claimStartDate: string
  claimEndDate: string
}
\`\`\`

### Users
\`\`\`typescript
{
  id: string
  email: string
  password: string (hashed)
  role: "admin" | "user"
}
\`\`\`

### Waitlist
\`\`\`typescript
{
  dropId: string
  position: number
  isJoined: boolean
}
\`\`\`

## 🎯 Key Features Explained

### Waitlist System
- Users join drops in a queue
- Position automatically assigned
- Queue maintained across claim window
- Visible position indicator for users

### Claim Window
- Admin sets specific start/end times
- Users can only claim during window
- Claim code auto-generated (24-hour validity)
- Stock decrements automatically

### Stock Management
- Real-time stock tracking
- "Sold Out" status when stock = claimed
- Progress bar showing availability
- Concurrent claim handling

## 🧪 Testing

### Test Waitlist Flow
1. Login as user
2. Find any drop
3. Click "Join Waitlist"
4. See position update
5. Leave waitlist

### Test Claim Flow
1. Admin creates drop with future claim dates
2. Wait until claim window opens
3. User sees "Claim Now" button becomes active
4. Click claim and get code
5. Test copy to clipboard

### Test Admin Panel
1. Login with admin account
2. Create new drop
3. Edit drop details
4. Delete drop with confirmation

## 📱 Responsive Design

- Mobile-first approach
- Tablet optimizations (md breakpoint)
- Desktop full layout (lg breakpoint)
- Touch-friendly buttons and spacing

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Drops
- `GET /api/admin/drops` - Get all drops
- `POST /api/admin/drops` - Create new drop
- `PUT /api/admin/drops/[id]` - Update drop
- `DELETE /api/admin/drops/[id]` - Delete drop

### Waitlist
- `POST /api/drops/[id]/join` - Join waitlist
- `POST /api/drops/[id]/leave` - Leave waitlist
- `GET /api/drops/waitlist` - Get user's waitlist status

### Claims
- `POST /api/drops/[id]/claim` - Claim an item

## 🎨 Design System

### Colors
- **Primary**: `#00d9ff` (Cyan)
- **Secondary**: `#ff006e` (Pink)
- **Background**: `#0a0a0a` (Dark)
- **Card**: `#131313` (Darker)
- **Muted**: `#262626` (Gray)

### Typography
- **Headings**: Bold, Large (2xl-5xl)
- **Body**: Regular, Medium (base-lg)
- **Captions**: Small, Muted (xs-sm)

## 📝 Notes

- Mock API endpoints return deterministic data
- JWT tokens not fully validated in mock
- Database schema supports SQLite
- Ready for backend integration
- Fully typed with TypeScript
- Responsive and accessible

## 🚀 Next Steps

1. Connect real backend (Node.js/Express)
2. Implement JWT verification
3. Add database persistence
4. Setup email notifications
5. Add analytics tracking
6. Implement payment integration

