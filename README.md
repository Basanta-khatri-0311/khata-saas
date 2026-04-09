# Khata SaaS
**Industrial-Grade Financial Infrastructure**

**Live Preview:** [khata-bk.netlify.app](https://khata-bk.netlify.app/)

Khata is a high-performance, responsive financial ledger and multi-tenant SaaS platform. Built with an industrial-modern aesthetic, it provides businesses with precision in tracking income, expenses, and credit (Udharo) while maintaining complete data isolation and bilingual localization.

---

## Key Features

- **Industrial-Grade RBAC:** Multi-tenant architecture with atomic role-based access control. Secure data partitioning ensures total tenant isolation.
- **Offline Ledger Sync:** Connectivity-resilient tracking. Record transactions offline; sync automatically when the connection is restored.
- **Native Bilingual Engine:** Seamless localized operation. Switch between English and Nepali interfaces instantly across the entire platform.
- **Udharo (Credit) Control:** Precision credit management. Track pending receivables and payables with automated balance reconciliation and history.
- **Visual Intelligence Dashboard:** Data-dense analytics using high-frequency engines to visualize cash flow, categories, and growth trends.
- **Audit Logging & Transparency:** Complete modification tracking. Maintain a clear history of all changes to ensure operational accountability.
- **Industrial UI System:** Bespoke design system with theme-aware grid backgrounds, noise texture, and fluid scroll animations.

---

## Technology Stack

### Frontend
- **React 18** (UI Core)
- **Framer Motion** (Scroll Animations & Transitions)
- **Tailwind CSS** (Design System)
- **Recharts** (Data Visualization)
- **Lucide React** (Iconography)
- **Context API** (State & Theme Management)

### Backend
- **Node.js & Express.js** (API Framework)
- **MongoDB & Mongoose** (Data Layer)
- **JWT & bcrypt.js** (Security & Encryption)

---

## Installation and Setup

Ensure you have Node.js (v16+) and MongoDB installed.

### 1. Clone Repository
```bash
git clone https://github.com/Basanta-khatri-0311/khata-saas.git
cd khata-saas
```

### 2. Environment Configuration
Create a .env file in the server directory:
```env
PORT=port_number
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

### 3. Initialize Application
**Server-side:**
```bash
cd server && npm install && npm run dev
```

**Client-side:**
```bash
cd client && npm install && npm run dev
```

---

## Development Roadmap

The following units are planned for future releases:

- [ ] **Document Export Engine:** Generation of PDF and CSV financial reports and invoices.
- [ ] **Bilingual Print Layouts:** Localized printing support for invoices and ledgers in both English and Nepali.
- [ ] **Automated Workflow Notifications:** Email and SMS alerts for transaction approvals and security events.
- [ ] **Voice-Assist Data Entry:** Speech-to-text integration for rapid ledger entry.
- [ ] **Inventory Control Module:** Integration of physical stock tracking within the financial ledger system.

---

## Deployment

Khata is optimized for cloud deployment.
- **Frontend:** Pre-configured for Netlify or Vercel.
- **Backend:** Architected for Render, Heroku, or DigitalOcean.

## License

This project is licensed under the MIT License. See the LICENSE file for details.