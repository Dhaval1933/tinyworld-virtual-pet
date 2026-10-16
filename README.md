# 🌍 TinyWorld — Cozy Virtual Pet & Personal Progress Game

> *"Take care of your little world while taking care of yourself."*

TinyWorld is a full-stack MERN application combining an interactive virtual pet experience, an interactive drag-and-drop room customization system, and a gamified habit/activity tracker with real-time progression, coins, and unlocks.

Built as an individual end-term software engineering project.

---

## 📸 Screenshots & Highlights

- **Cozy Pet Experience**: Adopt your companion (Mochi the Cat, Pebble the Bunny, or Sprout), pet, feed, and rest them with real-time mood & stat tracking (Hunger, Happiness, Energy).
- **Interactive Room Customizer**: Place furniture, rotate items by 45°, drag and drop items anywhere on the floor, and persist layouts in MongoDB.
- **Habit & Activity Tracker**: Complete daily tasks (Study, Exercise, Hydration, Reading, Cleaning) or log custom activities to earn Coins and XP.
- **Item Shop & Economy**: Browse furniture, plants, wallpaper, and foods. Purchase items with earned coins and add them to your room inventory.
- **Leveling & Achievements**: XP thresholds, leveling mechanics, and achievements unlocked through daily habits and care actions.

---

## 🛠️ Tech Stack & Architecture

### Backend
- **Node.js** & **Express 4**
- **MongoDB Atlas** with **Mongoose 8**
- **JWT (JSON Web Token)** stored in HTTP-only, secure cookies
- **Bcrypt.js** (12 salt rounds) for password hashing
- **Helmet**, **CORS**, and **Express Rate Limit** for production security
- **Idempotency Protection** on transactions and activity completion to prevent duplicate rewards

### Frontend
- **React 19** with **Vite 8**
- **Tailwind CSS v4** with a custom cozy pastel design system (Cream, Lavender, Sage, Peach, Sky)
- **Lucide React** icons
- **React Router 7** with protected route guards and onboarding redirection
- **Axios** with centralized error interceptors and cookie credentials
- **React Hot Toast** for micro-interactions and celebration toasts

---

## 🚀 Getting Started

### 1. Database Setup
The server is already configured with your MongoDB Atlas cluster:
`mongodb+srv://cbheeem0_db_user:EgTZwsHC7EOYZTau@cluster0.bcjjndf.mongodb.net/tinyworld`

### 2. Seed Initial Data
Populate the 18 shop items and 8 achievement badges:
```bash
npm run seed
# or
cd server && npm run seed
```

### 3. Start the Application
Run both backend and frontend servers:

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

Visit **http://localhost:5173** in your browser!

---

## 📁 Project Structure

```
endtermprojectmern/
├── package.json               # Root scripts
├── server/
│   ├── .env                   # Atlas connection & JWT secrets
│   ├── scripts/
│   │   └── seed.js            # Database seeding script (upserts shop items & achievements)
│   └── src/
│       ├── config/            # DB connection & environment validator
│       ├── controllers/       # Auth, Pet, World, Activity, Shop, Progress
│       ├── middleware/        # JWT auth, error handler, rate limiter
│       ├── models/            # User, Pet, World, Activity, ShopItem, Inventory, etc.
│       ├── routes/            # REST API endpoints (/api/v1/...)
│       ├── utils/             # XP formula, constants, AppError class
│       ├── app.js             # Express app setup
│       └── server.js          # Server entry
└── client/
    ├── index.html             # Font preconnects, SEO metadata
    └── src/
        ├── components/        # Reusable UI tokens (Button, Card, Modal, ProgressBar)
        ├── context/           # AuthContext, GameContext, RoomContext
        ├── layouts/           # AppLayout (Sidebar + Mobile Bar), PublicLayout
        ├── pages/             # Landing, Login, Register, Onboarding, GameRoom, Shop, Activities, Progress, Settings
        ├── services/          # Centralized Axios API service layer
        ├── utils/             # Constants & formatters
        ├── App.jsx            # Router and Route Guards
        └── main.jsx           # App bootstrapping
```

---

## 🎓 Viva & Demonstration Guide

### Key Questions & Answers for Viva

1. **How is state managed between the pet, inventory, and room?**
   - We use three focused React contexts:
     - `AuthContext`: handles JWT authentication state and user profile (`coins`, `level`, `totalXP`).
     - `GameContext`: manages pet stats, active inventory, and user progress.
     - `RoomContext`: isolates room layout coordinates, edit mode, item selection, and debounces saving room layout changes to avoid spamming the database.

2. **How do you prevent duplicate coin rewards if a user double-clicks?**
   - The frontend generates an `idempotencyKey` (UUID) for each completion request. The backend enforces unique `(userId, idempotencyKey)` pairs on the `Activity` model and checks for existing entries before awarding coins or XP.

3. **How does pet stat decay and interaction work?**
   - Pet hunger, happiness, and energy decay dynamically based on time elapsed since last fed, petted, or rested (`lastFedAt`, `lastPettedAt`, `lastRestedAt`).
   - Feeding restores hunger (+25) and happiness (+10); petting increases happiness (+20) and energy (+5); resting restores energy (+30).

4. **How are items placed in the room rendered responsively?**
   - Placed items store normalized coordinates (`x: 0.0 – 1.0`, `y: 0.0 – 1.0`) relative to the room canvas dimensions. This ensures room decorations look identical regardless of screen size or window resizing.
