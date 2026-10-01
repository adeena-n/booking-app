# University Lab & Equipment Booking System - Frontend

An enterprise-grade, responsive University Laboratory and Equipment Allocation portal built with **React**, **Tailwind CSS**, **React Router**, and **Supabase Auth**.

This frontend is architected to integrate directly with a **Node.js + Express + PostgreSQL (Supabase) + TypeORM** backend via standardized REST APIs.

---

## 🚀 Live Demo Workflow (Hackathon Presentation Scenario)

The frontend is specifically prepared to walk hackathon judges through the exact end-to-end story requested in the brief:

1. **Step 1 — Student (Guljabeen)**:
   - Log in as Student.
   - Navigate to **Browse Resources** (`/resources`).
   - Search for `Embedded Systems Lab` or `Arduino Uno Kit`.
   - Click **Book Lab** or **New Booking** (`/bookings/new`).
   - Select Friday (e.g. `2026-10-02`), `14:00` to `16:00`.
   - Click **Check Availability**:
     - System triggers `POST /api/bookings/check-availability`.
     - Detects the conflicting booking (`1:00 PM – 3:00 PM`), displaying the **HTTP 409 Conflict** banner.
     - System runs the **Intelligent Recommendation Algorithm**, displaying alternative labs (e.g., *Electronics Lab with 93% Match*) and alternative slots, or the option to **Join Lab Waitlist**.
   - Select the alternative or an open slot and click **Submit Booking Request**.
   - A new booking (`#BK-xxxx`) is generated with status: `Pending Approval`.

2. **Step 2 — Lab Staff (John Doe)**:
   - Switch role to **Lab Staff** via the Top Header or Sidebar Switcher.
   - Open **Staff Operations Hub** (`/staff`).
   - Under **Pending Approvals**, review the request from Guljabeen.
   - Click **Approve Request**. Status updates to `Approved` / `Reserved`.

3. **Step 3 — Student Verification & Pass Generation**:
   - Switch back to **Student**.
   - Notice the unread notification badge: *"Your booking for #BK-xxxx has been approved."*
   - Open Booking Details (`/bookings/:id`) to see the updated **Booking Timeline** (`Pending Approval` → `Approved` → `Reserved`).
   - Click **Add to Calendar (.ics)** to export an iCalendar pass.
   - Click **Show Pass QR** to display the student verification pass.

4. **Step 4 — Equipment Issuing (Arrival)**:
   - Switch to **Lab Staff**.
   - Under **Today's Equipment Dispatch**, click **Issue Equipment**.
   - Confirm quantity (5 kits) and handover time. Status advances to `In Use`.

5. **Step 5 — Equipment Return & Inspection**:
   - Under **Equipment Returns**, click **Confirm Return**.
   - Select condition: `Good` (or `Damaged` / `Missing`), add inspection remarks, record late return flag if applicable.
   - Status transitions to `Completed`.

6. **Step 6 — Administrator Analytics Updated**:
   - Switch to **Administrator**.
   - Open **Admin Center** (`/admin`) or Dashboard (`/dashboard`).
   - Watch the live telemetry metrics automatically reflect:
     - `Active Bookings`: -1
     - `Completed Bookings`: +1
     - Equipment and Lab usage distribution charts immediately updated.

---

## 🛠️ Technology Stack

- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v3
- **Routing**: React Router v7 (`BrowserRouter`, `Routes`, `Route`, `Navigate`)
- **Authentication**: Supabase Auth client (`@supabase/supabase-js`)
- **API Communication**: Centralized HTTP client (`src/api/client.js`) with automatic Bearer token injection
- **Icons**: Lucide React
- **QR Pass Generator**: Embedded vector rendering

---

## 📁 Project Architecture

```
src/
├── api/                     # Centralized API service modules
│   ├── client.js            # Base Axios/Fetch wrapper + Bearer token injector + error parser
│   ├── authApi.js           # /api/auth/me, Supabase session auth
│   ├── labsApi.js           # /api/labs
│   ├── equipmentApi.js      # /api/equipment
│   ├── bookingsApi.js       # /api/bookings, check-availability, issue, return, .ics
│   ├── waitlistApi.js       # /api/waitlist
│   ├── notificationsApi.js  # /api/notifications
│   ├── maintenanceApi.js    # /api/maintenance
│   ├── recommendationsApi.js# /api/recommendations/labs
│   └── analyticsApi.js      # /api/analytics/overview, usage
├── components/
│   ├── common/              # Reusable UI primitives (Button, Input, Select, Modal, StatusBadge, EmptyState, LoadingSpinner, ErrorState, ConfirmDialog)
│   ├── bookings/            # BookingTimeline, ConflictAlert (409), QRModal, RecommendationCard
│   └── resources/           # LabCard, EquipmentCard
├── context/
│   ├── AuthContext.jsx      # Supabase auth, user profile, role state, demo switcher
│   └── ToastContext.jsx     # In-app toast feedback notifications
├── layouts/
│   └── AppLayout.jsx        # Desktop sidebar, mobile drawer, top navbar, role switcher
├── pages/
│   ├── LoginPage.jsx        # Login & 1-click persona switchers
│   ├── DashboardPage.jsx    # Dynamic role-based dashboards
│   ├── ResourcesPage.jsx    # Multi-faceted search catalog
│   ├── LabDetailsPage.jsx   # Lab specs & slot booking
│   ├── EquipmentDetailsPage.jsx # Hardware stock & reservation form
│   ├── BookingCreatePage.jsx# Form + Availability check + Conflict resolution
│   ├── BookingDetailsPage.jsx # Timeline, .ics download, pass QR
│   ├── BookingListPage.jsx  # History with status tabs
│   ├── WaitlistPage.jsx     # Queue positions & offer claims
│   ├── StaffPanelPage.jsx   # Approvals, Issue, Return, Maintenance
│   ├── AdminPanelPage.jsx   # KPIs, Labs, Equipment, RBAC, Audit log
│   └── NotificationsPage.jsx# Real-time notification inbox
├── services/
│   ├── supabase.js          # Supabase client setup with graceful dev fallback
│   └── mockFallback.js      # High-fidelity offline emulator strictly matching backend REST contract
├── utils/
│   ├── formatters.js        # Date, time, score formatters
│   └── calendar.js          # iCalendar (.ics) export fallback
├── App.jsx                  # Route table & ProtectedRoute guards
└── main.jsx
```

---

## 🔐 Role-Based Access Control (RBAC)

| Feature / Page | Student / Faculty | Lab Staff | Department Coordinator | Administrator |
|---|:---:|:---:|:---:|:---:|
| Browse & Search Resources | ✅ | ✅ | ✅ | ✅ |
| Check Slot Availability | ✅ | ✅ | ✅ | ✅ |
| Create Booking Requests | ✅ | ❌ | ❌ | ❌ |
| View Personal Bookings | ✅ | ❌ | ❌ | ❌ |
| Join & Track Waitlist | ✅ | ❌ | ❌ | ❌ |
| Approve / Reject Bookings | ❌ | ✅ | ✅ | ✅ |
| Issue Equipment | ❌ | ✅ | ✅ | ✅ |
| Inspect Returns & Record Damage | ❌ | ✅ | ✅ | ✅ |
| Schedule Maintenance Blocks | ❌ | ✅ | ✅ | ✅ |
| Manage Labs & Equipment | ❌ | ❌ | ✅ | ✅ |
| User Permissions & Global Audit | ❌ | ❌ | ❌ | ✅ |

---

## ⚙️ Environment Configuration

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

When connecting to the live Express backend, simply set `VITE_API_BASE_URL` to your backend host. If the backend is temporarily offline, the built-in contract fallback emulator allows seamless navigation and interactive testing.

---

## 🏃 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Production Build
```bash
npm run build
```
The compiled assets will be generated in `dist/`.
