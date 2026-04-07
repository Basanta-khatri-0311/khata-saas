# Khata SaaS - Digital Ledger System

A modern, multi-tenant SaaS (Software as a Service) application for managing business accounts and transactions. This application allows users to maintain digital ledgers, track income and expenses, and generate reports, all secured with JWT authentication and multi-tenant data isolation.

## Features

- **User Authentication**: Secure sign-up and login with JWT (JSON Web Tokens).
- **Multi-Tenancy**: Each user has their own isolated data (transactions and settings).
- **Dashboard**: Visual overview of total income, expenses, and net balance.
- **Transactions Management**:
  - Add, edit, and delete transactions.
  - Categorize as Income or Expense.
  - Filter by date range.
- **Reports**:
  - Generate monthly and yearly reports.
  - Visualized with charts (Income vs. Expense).
- **Settings**:
  - Customize business name and subtitle.
  - Manage income and expense categories.
- **Responsive Design**: Built with Tailwind CSS for a seamless experience on desktop and mobile.

## Tech Stack

### Frontend
- **React**: UI library for building the user interface.
- **React Router**: For client-side routing.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Lucide React**: Icon library.
- **Axios**: For making HTTP requests to the backend.

### Backend
- **Node.js**: JavaScript runtime for the server.
- **Express**: Web framework for building the API.
- **MongoDB**: NoSQL database for storing user data.
- **JWT (jsonwebtoken)**: For authentication and securing routes.
- **Bcrypt.js**: For password hashing.

## Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or a MongoDB Atlas connection string)

### 1. Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `server` directory with the following variables:
   ```env
   PORT=5500
   MONGO_URI=your_mongodb_connection_string_here
   JWT_SECRET=your_secret_key_here
   ```

4. Start the server:
   ```bash
   node server.js
   ```

### 2. Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Usage

1. **Register** a new account.
2. **Login** with your credentials.
3. **Navigate** to the Dashboard, Transactions, Reports, or Settings using the sidebar.
4. **Add** transactions and customize your settings.
5. **Logout** when you are done.

## License

MIT