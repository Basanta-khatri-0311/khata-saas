# Khata SaaS
**Industrial-Grade Financial Infrastructure for Nepal**

**Live Preview:** [khata-bk.netlify.app](https://khata-bk.netlify.app/)

Khata is a high-performance, responsive financial ledger and multi-tenant SaaS platform tailored specifically for businesses in Nepal. Built with an industrial-modern aesthetic, it provides businesses with precision in tracking income, expenses, and credit (Udharo) while maintaining complete data isolation and seamless bilingual localization (English/Nepali).

---

## 🌟 Core Capabilities

### 🔐 Industrial-Grade RBAC
Multi-tenant architecture with atomic role-based access control. Secure data partitioning ensures total tenant isolation and data integrity.

### 📶 Offline Ledger Sync
Connectivity-resilient tracking. Record transactions offline seamlessly; data syncs automatically and safely to the cloud the moment the connection is restored.

### 🇳🇵 Native Bilingual Engine
Seamless localized operation built for the Nepali market. Switch between English and Nepali interfaces instantly across the entire platform, including invoices.

### 📓 Udharo (Credit) Control
Precision credit management. Track pending receivables and payables with automated balance reconciliation, customer histories, and settlement tracking.

### 🎙️ Voice-Assist Data Entry
Speech-to-text integration for rapid ledger entry. Speak your transactions (e.g., "500 for tea") and the engine automatically parses the amount and description.

### 🖨️ Bilingual Invoice Printing
Generate and print professional, localized receipts and invoices instantly from any transaction record.

### 📊 Visual Intelligence Dashboard
Data-dense analytics using high-frequency engines (powered by MongoDB Aggregation Pipelines) to visualize cash flow, categories, and growth trends without compromising server stability.

### 🤖 Smart Receipt Scanning (OCR)
AI-powered extraction of totals and merchants from physical receipts using Gemini Flash for blazing fast context-aware data entry.

### 🔄 Recurring Automation
Scheduled auto-posting for recurring payments, rent, and subscriptions powered by background cron jobs. Never miss logging a fixed expense again.

### 📦 Inventory & Stock Control
Synchronization of physical stock tracking within the financial ledger ecosystem. Automatically deduct stock on sale and seamlessly add custom unregistered items to inventory on-the-fly.

### 📑 Document Export Engine
Bulk generation of professional PDF and CSV financial master ledgers with date range filters.

---

## 🛠️ Technology Stack

**Frontend Architecture:**
- **React 18** (UI Core)
- **Vite** (Build Tooling)
- **Framer Motion** (Fluid Animations)
- **Tailwind CSS v4** (Design System)
- **Recharts** (Data Visualization)

**Backend Infrastructure:**
- **Node.js & Express.js** (API Framework)
- **MongoDB & Mongoose** (Data Layer)
- **JWT & bcrypt.js** (Security & Encryption)
- **Express Rate Limit** (DDoS & Brute-force Protection)

---

## 🚀 Installation & Setup

Khata requires Node.js (v16+) and a MongoDB instance.

### 1. Clone Repository
```bash
git clone https://github.com/Basanta-khatri-0311/khata-saas.git
cd khata-saas
```

### 2. Environment Configuration
Create a `.env` file in the `server` directory. **(Crucial: The server will refuse to start without a valid JWT_SECRET).**
```env
PORT=5200
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_cryptographic_secret
```

### 3. Initialize Services
**Boot Backend:**
```bash
cd server
npm install
npm run dev
```

**Boot Frontend:**
```bash
cd client
npm install
npm run dev
```

---

## 🛣️ Upcoming Enterprise Modules

We are continually evolving Khata to serve modern business needs. The following enterprise modules are currently in the research and development phase:

* **AI-Driven Financial Insights:** Automated cash-flow forecasting and anomaly detection.

---

## ☁️ Deployment

Khata is cloud-native and highly scalable.
- **Frontend:** Pre-configured for edge deployment on Netlify or Vercel.
- **Backend:** Architected for horizontal scaling on Render, Heroku, or DigitalOcean App Platform.

## 📄 License
This project is licensed under the MIT License. See the LICENSE file for details.