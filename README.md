# 🌍 TinyWorld — Cozy Virtual Pet & Personal Progress Game

> *"Take care of your little world while taking care of yourself."*

TinyWorld is a full-stack MERN application that merges an interactive virtual pet experience, a responsive 2D drag-and-drop room customization engine, and a gamified habit/activity tracker with server-authoritative progression, coin economies, and achievements.

Built as an individual end-term software engineering project.

---

## 🔗 Live Deployment & Demonstration

- **🌐 Live Web Application (Frontend)**: [https://tinyworld-virtual-pet.vercel.app](https://tinyworld-virtual-pet.vercel.app)
- **⚙️ Live REST API (Backend)**: [https://tinyworld-backend.onrender.com](https://tinyworld-backend.onrender.com)
- **🩺 API Health Status**: [https://tinyworld-backend.onrender.com/api/v1/health](https://tinyworld-backend.onrender.com/api/v1/health)
- **🎥 Product Video Walkthrough**: [Watch Demo Video on Google Drive](https://drive.google.com/file/d/1Ghbwt1nUgUVGnXLmxG3jUkFwZ1Iw9tYi/view?usp=sharing)
- **📦 GitHub Repository**: [https://github.com/Dhaval1933/tinyworld-virtual-pet](https://github.com/Dhaval1933/tinyworld-virtual-pet)

---

## 📸 Core Features & Highlights

- **🐾 Cozy Pet Companions**: Adopt Mochi the Cat, Pebble the Bunny, or Sprout. Interact in real-time — feed, pet, and rest your companion. Pet mood, hunger, happiness, and energy dynamically decay over time. Includes physical reactions (giggles, head pats, high-fives) and high-pitch cartoon voice mimic like Talking Tom!
- **🤖 Dual-Provider Conversational AI & Natural Speech Engine**: Real-time intelligent pet conversation powered by **Groq AI (Qwen 2.5)** with an automated failover backup to **Google Gemini AI Studio** (`gemini-flash-lite-latest` / `gemini-3.8-flash`). Includes custom speech synthesis with 5 natural voice profiles (Sweet & Natural, Playful Kitten, Cozy Friend, Cheerful Animation, Gentle Whisper) and device voice selection.
- **💳 Razorpay Payment Gateway & Paywall Pass**: Integrated Razorpay subscription paywall for the premium AI Companion Pass (₹100/month). Features server-signed order generation, cryptographic **HMAC-SHA256 signature verification**, and 30-day access tracking, while keeping Talking Tom voice mimic mode 100% free.
- **🛋️ 2D Drag-and-Drop Room Engine**: Interactive room canvas with customizable themes (`cozy`, `forest`, `cloud`, `ocean`), 45° rotation, dynamic Y/layer depth sorting, bounds clamping, undo/cancel capability, and persistence to MongoDB Atlas with normalized coordinates.
- **🪟 Fitted Window Curtains**: Dedicated arched window slot with scalloped valance and ruffled tieback curtains; cannot be placed on random floor coordinates.
- **🌿 Scenic Balcony Expansion**: Switch between Indoor Room and Outdoor Balcony. Features a free default Sunset Horizon view and 5 unlockable panoramas (Cherry Blossom, Ocean Breeze, Rainy Garden, City Lights, Cosmic Galaxy) with level and coin unlocking, and 100% layout isolation from indoor furniture.
- **🎮 Talking Tom-Style Mini-Games Arcade**: 3 playable games (**Treat Catch Frenzy**, **Paw Pop Reflex**, **Cloud Hopper**) with 60fps physics, sound effects, combos, and server-authoritative coin (+25) and XP (+30) rewards.
- **⏱️ Habit Tracking & Focus Timer**: Log preset wellness habits (Reading, Meditation, Hydration, Exercise, Study, Journaling) or custom activities with category selection. Includes an integrated Pomodoro/sprint timer (15m, 25m, 45m) with circular SVG progress ring and chime alert.
- **💰 Server-Authoritative Economy**: Anti-cheat coin and XP rewards calculated strictly on the backend. Mathematical XP formula ($XP = 100 \times level^{1.5}$) governs level progression.
- **🛍️ Item Shop & Room Inventory**: Browse 33 items across furniture, plants, rugs, and outdoor balcony decors. Level locks, atomic balance deductions (`$gte`), duplicate non-stackable prevention, and immediate integration with the 2D room inventory drawer.
- **🏆 Achievements & Wallet Ledger**: Automatic badge unlocking, coin reward bonuses, and an immutable `WalletTransaction` audit trail tracking every earned and spent coin.

---

## 🛠️ Tech Stack & Architecture

### Backend
- **Node.js** & **Express 4**
- **MongoDB Atlas** with **Mongoose 8**
- **Groq Cloud API** (`qwen/qwen3.8-27b`) & **Google Gemini AI Studio API** (Resilient dual-engine AI)
- **Razorpay Node SDK** with server-side HMAC-SHA256 cryptographic verification
- **JWT (JSON Web Token)** stored in HTTP-only, secure cookies
- **Bcrypt.js** (12 salt rounds) for password hashing
- **Helmet**, **CORS**, and **Express Rate Limit** for API protection
- **Idempotency Protection** (`idempotencyKey` UUID) preventing duplicate completion & double-claiming

### Frontend
- **React 19** with **Vite 8**
- **Tailwind CSS v4** with a custom pastel palette (Cream, Lavender, Sage, Peach, Sky)
- **Web Speech API** (SpeechSynthesis & SpeechRecognition) for talking pet voice interaction
- **Razorpay Standard Checkout SDK** integration
- **Lucide React** icons
- **React Router 7** with protected route guards and onboarding redirection
- **Axios** with centralized error interceptors and `withCredentials: true`
- **React Hot Toast** for notifications and celebratory toasts

---

## 🚀 Local Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB Atlas** cluster connection string

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone <repository-url>
cd endtermprojectmern

# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
cd ..
```

### 2. Configure Environment Variables

Create `.env` files for both server and client:

#### Server (`server/.env`)
```ini
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/tinyworld
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
```

#### Client (`client/.env`)
```ini
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Seed Initial Shop Catalog & Achievements
Populate the 18 shop items and 8 achievement badges:
```bash
npm run seed
# or
cd server && npm run seed
```

### 4. Start Development Servers
Run backend and frontend servers in separate terminals (or concurrently):

**Backend (Port 5000):**
```bash
npm run server
# or
cd server && npm run dev
```

**Frontend (Port 5173):**
```bash
npm run client
# or
cd client && npm run dev
```

Visit **http://localhost:5173** to launch TinyWorld!

---

## 🧪 Automated Testing Suite

The application includes an automated test suite verifying security, state transitions, validation, and user data isolation:

```bash
# Run all test suites
npm test
# or
cd server && npm test
```

### Test Coverage Breakdown (166 / 166 Tests Passing):
1. **`server/scripts/test-auth-onboarding.js` (40 tests)**
   - Input validation (email format, password length)
   - Password hashing (bcrypt 12 rounds) and absence of password leaks in API responses
   - HTTP-only JWT cookie issuance and session verification
   - Protected route guards (401 Unauthorized)
   - Pet adoption, starter inventory, and starter room creation
   - Duplicate onboarding prevention (400 Bad Request)
   - Multi-user isolation (User A cannot view User B's pet/room)
   - Logout flow and cookie clearance
   - Password change flow (`PATCH /api/v1/users/change-password`): rejects bad current password, rejects short passwords, updates hash, verifies old password rejected, verifies new password login succeeds (200)
2. **`server/scripts/test-room-scene.js` (44 tests)**
   - Normalized coordinate bounds validation (0 <= x, y <= 1)
   - Rotation angle persistence (45° increments)
   - Drag-and-drop coordinate persistence to MongoDB Atlas
   - Inventory ownership verification (403 Forbidden when placing unowned items)
   - Maximum capacity limit enforcement (max 30 items per room)
   - Room theme switching (`cozy`, `forest`, `cloud`, `ocean`)
   - Scenic Balcony isolation & view unlock verification
3. **`server/scripts/test-activity-progression.js` (44 tests)**
   - Server-authoritative coin and XP reward calculations
   - Idempotency key duplicate completion prevention (no double rewards)
   - Daily limit enforcement (max 10 activities/day) and daily summary meter
   - Pet progression boost (+20 XP, +5 happiness)
   - Level progression mathematical formula
   - Shop catalog level-locking enforcement (403 Forbidden)
   - Non-existent item rejection (404 Not Found)
   - Insufficient funds rejection (400 Bad Request)
   - Duplicate non-stackable item purchase rejection (409 Conflict)
   - Wallet transaction ledger auditing (`earn` and `spend`)
   - Automatic achievement unlocks and coin bonus rewards
   - Strict multi-user inventory and ledger isolation
4. **`server/scripts/test-pet-chat.js` (15 tests)**
   - Unauthorized access rejection (401)
   - Paywall protection for unsubscribed users (403 SUBSCRIPTION_REQUIRED)
   - Conversational AI responses via Groq/Gemini with pet stats boost
   - Multi-turn conversation history persistence
5. **`server/scripts/test-razorpay-e2e.js` (23 tests)**
   - Razorpay gateway order generation (₹100 / 10000 paise)
   - Cryptographic HMAC-SHA256 signature verification & fraud rejection
   - 30-day AI Companion Pass activation and status check
   - Post-subscription AI chat feature unlock verification

---

## 🌐 Production Deployment Guide

### Architecture Overview
- **Backend API**: Deployed as a Web Service on **Render**, **Railway**, or **AWS EC2/Elastic Beanstalk**.
- **Frontend SPA**: Deployed on **Vercel**, **Netlify**, or **Cloudflare Pages**.
- **Database**: Hosted on **MongoDB Atlas**.

### Step 1: Deploy Backend (e.g., Render / Railway)
1. Link repository and set Root Directory to `server`.
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Configure Environment Variables:
   - `MONGODB_URI`: Atlas connection string
   - `JWT_SECRET`: Random 64-character secret
   - `JWT_EXPIRES_IN`: `7d`
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (or leave default assigned by host)
   - `CLIENT_URL`: `https://your-tinyworld-client.vercel.app`
   - `COOKIE_SECURE`: `true`
   - `COOKIE_SAME_SITE`: `none` (required for cross-domain cookies when frontend and backend use different domains)

### Step 2: Deploy Frontend (e.g., Vercel)
1. Link repository and set Root Directory to `client`.
2. Framework Preset: `Vite`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Configure Environment Variables:
   - `VITE_API_URL`: `https://your-tinyworld-api.onrender.com/api/v1`
6. Add `client/vercel.json` for SPA client-side routing rewrites:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 📁 Directory Structure

```
endtermprojectmern/
├── package.json                    # Root scripts (server, client, seed, test, build)
├── KNOWLEDGE_GRAPH.md              # System knowledge graph & architecture documentation
├── README.md                       # Production guide, setup, and viva reference
├── server/
│   ├── .env.example                # Server environment template
│   ├── scripts/
│   │   ├── seed.js                 # Database seeding script (33 shop items, 8 achievements)
│   │   ├── test-auth-onboarding.js # Auth & onboarding test suite (40 tests)
│   │   ├── test-room-scene.js      # Room scene, balcony isolation & views test suite (44 tests)
│   │   └── test-activity-progression.js # Progression & economy test suite (44 tests)
│   └── src/
│       ├── config/                 # DB connection, CORS, and env validator
│       ├── controllers/            # Auth, Pet, World, Activity, Shop, Progress, Users
│       ├── middleware/             # JWT auth, error handler, rate limiter, validators
│       ├── models/                 # User, Pet, World, Activity, ShopItem, Inventory, etc.
│       ├── routes/                 # REST API routes (/api/v1/...)
│       ├── utils/                  # achievementChecker, XP formula, AppError
│       ├── app.js                  # Express app setup, Helmet, CORS, Morgan
│       └── server.js               # HTTP listener
└── client/
    ├── .env.example                # Client environment template
    ├── index.html                  # HTML entry, Google Fonts preconnect, SEO meta tags
    ├── vite.config.js              # Vite + React + Tailwind v4 configuration
    └── src/
        ├── components/
        │   ├── common/             # Button, Card, Modal, ProgressBar, Loading
        │   ├── room/               # RoomScene, RoomIllustrations, PetAvatar, RoomInventoryDrawer
        │   ├── games/              # TreatCatchGame, PawPopGame, CloudHopperGame
        │   └── activities/         # FocusTimer
        ├── context/                # AuthContext, GameContext, RoomContext
        ├── layouts/                # AppLayout, PublicLayout
        ├── pages/                  # Landing, Login, Register, Onboarding, GameRoom, Shop, Activities, MiniGamesPage, Progress, Settings
        ├── services/               # Centralized Axios API services
        ├── utils/                  # formatters, constants
        ├── App.jsx                 # Router & route guards
        └── main.jsx                # React bootstrapping
```

---

## 🎓 Viva & Technical Evaluation Q&A

### 1. How is security implemented for authentication and authorization?
- Passwords are encrypted using **bcrypt.js** with 12 salt rounds before database persistence.
- Sessions are maintained using a **JSON Web Token (JWT)** stored in an **HTTP-only, SameSite cookie**, protecting against XSS token theft.
- Protected endpoints pass through the `auth` middleware, verifying the signature and loading the authenticated user context (`req.user`).
- Ownership checks are enforced on every mutating action: a user can only place items they own in their inventory and cannot modify or access another user's room or pet.

### 2. How do you prevent duplicate rewards if a user spams the completion button?
- Each activity completion generates a unique UUID `idempotencyKey` on the client.
- The `Activity` collection enforces a compound unique index on `{ userId: 1, idempotencyKey: 1 }`.
- In `activityController.js`, incoming keys are checked first. If already processed, the API returns the existing record with `{ duplicate: true }` without awarding duplicate coins, XP, or pet stat bonuses.

### 3. How do you ensure the 2D room canvas remains responsive across all screens?
- Item coordinates are saved as **normalized floating-point numbers** between `0.0` and `1.0` (`x = itemPixels / canvasWidth`, `y = itemPixels / canvasHeight`).
- When rendering on different screen widths (mobile, tablet, desktop), coordinates are multiplied by the container's current bounding rect dimensions, preserving precise relative positioning and perspective.

### 4. How are coin balances and purchases kept consistent?
- Shop purchases use an atomic MongoDB query:
  `User.findOneAndUpdate({ _id: userId, coins: { $gte: item.price } }, { $inc: { coins: -item.price } })`
- If coins are insufficient, the query matches 0 documents and returns 400 immediately, eliminating race conditions or negative balances.
- Every transaction is written to the `WalletTransaction` audit ledger (`type: 'earn' | 'spend'`).
