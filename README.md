# Khata SaaS

**Live Preview:** [khata-bk.netlify.app](https://khata-bk.netlify.app/)

Khata is a modern, responsive financial ledger and business management platform designed for SaaS multi-tenancy. It provides robust tools for administrators to manage user access and for businesses to efficiently track their income, expenses, and financial health.

## Key Features

- **Role-Based Access Control (RBAC):** Secure separation of concerns between System Administrators and Business Users.
- **User Management Portal:** Administrators can easily approve, suspend, or manage user registrations.
- **Financial Dashboard:** Real-time analytics, cash flow tracking, and category distribution visualized through interactive charts.
- **Full Ledger System:** Comprehensive transaction tracking with advanced time-based filtering and search mechanisms.
- **Localization:** Integrated with Bikram Sambat (B.S.) date formats tailored for regional financial compliance.
- **Seamless Theming:** Native responsive UI with a fully interpolated Dark/Light mode toggle for optimal accessibility.

## Technology Stack

**Frontend**
- React 18
- React Router DOM v6
- Context API (State Management)
- Tailwind CSS (Styling & Design System)
- Recharts (Data Visualization)
- Lucide React (Iconography)

**Backend**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & bcrypt.js (Authentication & Security)

## Installation & Setup

Ensure you have [Node.js](https://nodejs.org/) (v16+) and [MongoDB](https://www.mongodb.com/) installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/Basanta-khatri-0311/khata-saas.git
cd khata-saas
```

### 2. Configure Environment Variables
Create a `.env` file in the `server` directory and add the following keys:
```env
PORT=5200
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

### 3. Install Dependencies & Run

**Backend:**
```bash
cd server
npm install
npm run dev
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

## Development Roadmap

As part of our commitment to continuous improvement and maximizing impact, the following features are actively being explored for upcoming releases:

- **Automated Email Workflows:** Trigger secure, automatic email notifications when a pending user registration is approved or rejected by an Administrator.
- **Multi-Branch / Multi-Store Architectures:** Allowing users to segregate their ledgers into independent branches or physical store locations under a single organization.
- **Voice-Assisted Transactions:** Implementing speech-to-text integration for rapid, hands-free data entry and ledger logging in fast-paced business environments.
- **Progressive Web App (PWA) & Offline Mode:** Evolving the platform into an installable PWA with local data caching, enabling seamless ledger management even without an active internet connection.
- **Custom Financial Reports:** Empowering businesses to dynamically generate, customize, and export deeply tailored financial reports based on specific stakeholder requirements.

## Deployment

Khata is optimized for modern PaaS platforms.
- **Frontend:** Pre-configured for Netlify or Vercel (includes `_redirects` for SPA routing).
- **Backend:** Ready for deployment on Render, Heroku, or DigitalOcean instances.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.