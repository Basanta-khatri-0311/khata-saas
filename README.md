# KHATA — The Industrial Digital Ledger (SaaS-Ready) 🛡️📊💼

**KHATA** is a high-performance, multi-tenant financial management ecosystem designed for businesses that demand precision, speed, and a premium "Command Center" experience. Built with a sleek **True Black/Industrial aesthetic**, it bridges the gap between traditional bookkeeping and modern SaaS scalability.

---

## 🛠️ The "Command Center" Experience

KHATA is architected with a dual-mode operative system, providing distinct experiences for the **Master Administrator** and the **General User**.

### 🛡️ Master Administrator (SaaS Control)
*   **Central Registry**: Monitor all operatives (users) from a unified Command Center.
*   **Clearance Management**: Approve new registrations, suspend accounts, or terminate access in real-time.
*   **Registry Search**: Rapidly filter through the global user database using the role-aware search header.
*   **System Integrity**: Complete isolation of business data between different tenants.

### 👤 General User (Financial Ledger)
*   **Dynamic Dashboard**: Instant visualization of Net Balance, Income, and Expenses with high-impact "Status: Operational" readouts.
*   **Master Ledger**: A full-archive transaction system with powerful time-based filtering (Week, Month, Year, All-Time).
*   **BSR-Compliant Localization**: Fully integrated with **Nepali Date (Bikram Sambat)** using `nepali-date-converter` for local financial alignment.
*   **Analytics Engine**: Interactive charts (Recharts) visualizing cash flow trends and category distribution.
*   **Adaptive Settings**: Customize business branding and manage custom financial categories.

---

## 🏗️ Technical Architecture

### Core Stack
| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Tailwind CSS, Lucide Icons, Recharts |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Security** | JWT (JSON Web Tokens), Bcrypt.js, RBAC Middleware |
| **State** | React Context API (Auth, Settings, Theme) |

### Key Systems
*   **Liquid Layout**: A fully responsive interface that dynamically adjusts content width based on sidebar state.
*   **Active-Guardian Middleware**: Server-side verification that blocks data access for "Pending" or "Suspended" users at the routing level.
*   **Localized Clock**: Real-time Nepali (B.S.) date synchronization across the header and report exports.

---

## 🚀 Rapid Deployment

### 1. Environment Configuration (`/server/.env`)
```env
PORT=5500
MONGO_URI=your_mongodb_cluster_uri
JWT_SECRET=your_industrial_grade_secret
```

### 2. Backend Ignition
```bash
cd server
npm install
node server.js
```

### 3. Frontend Launch
```bash
cd client
npm install
npm run dev
```

---

## 💎 Design Philosophy
KHATA adheres to a **Minimalist Industrial** aesthetic. 
*   **Rounded-3xl Geometry**: Fluid, modern container shapes.
*   **High-Contrast Typography**: Heavy font weights (`font-black`) for critical data readouts.
*   **Functional Micro-animations**: Subtle hover effects and toast notifications (React Hot Toast) for sensory feedback.
*   **Bespoke Dark Mode**: A "True Black" theme designed to reduce eye strain in high-intensity financial environments.

---

## 📜 Master Admin Setup
To claim the **Master Admin** vacancy on a fresh deployment:
1.  Use a client like Postman or the web Registry to sign up.
2.  The first user to register with `role: "admin"` in the payload will be automatically granted Master Admin clearance and activated.
3.  All subsequent registrations will be defaulted to `User` / `Pending` status.

---

**Developed for the next generation of financial operatives.** 🚀💎🛡️