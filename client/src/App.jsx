import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { getTransactionsToSync, clearSyncTransaction } from './services/db';
import api from './services/api';
// Core Shell & Components
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Landing & Auth
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

// Interior Operating Pages
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AdminPanel from './pages/AdminPanel';
import PendingApproval from './pages/PendingApproval';

const AppContent = () => {
    const { user, loading } = useAuth();

    React.useEffect(() => {
        const handleSync = async () => {
            if (!navigator.onLine) return;
            try {
                const offlineTxs = await getTransactionsToSync();
                if (offlineTxs.length > 0) {
                    for (const tx of offlineTxs) {
                        try {
                            const { id, timestamp, ...payload } = tx;
                            await api.post('/transactions', payload);
                            await clearSyncTransaction(id);
                        } catch (err) {
                            console.error('Failed to sync transaction', tx, err);
                        }
                    }
                    window.dispatchEvent(new Event('transactions-updated'));
                }
            } catch (err) {
                console.error('Error during sync check:', err);
            }
        };

        window.addEventListener('online', handleSync);
        // Also try taking a look on mount just in case
        handleSync();

        return () => window.removeEventListener('online', handleSync);
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
        </div>
    );

    return (
        <Routes>
            {/* PUBLIC GATEWAY - These are prioritized at the top level */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* SECURED OPERATIONAL SECTOR - Wrapped in pathless protectors to avoid root collisions */}
            <Route element={<ProtectedRoute />}>
                <Route path="/pending" element={<PendingApproval />} />

                {/* Main Operating Shell */}
                <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />

                    {/* Admin Executive Area */}
                    <Route element={<AdminRoute />}>
                        <Route path="/admin" element={<AdminPanel />} />
                    </Route>

                    {/* Root of the Secured Shell redirects based on user context */}
                    <Route path="/shell" element={<Navigate to={user?.role === 'admin' ? "/admin" : "/dashboard"} replace />} />
                </Route>
            </Route>

            {/* CATCH-ALL REDIRECTS TO SYSTEM START */}
            <Route path="*" element={<NotFound />} />

        </Routes>
    );
}

const App = () => {
    return (
        <AuthProvider>
            <SettingsProvider>
                <Router>
                    <div className="min-h-screen">
                        <Toaster position="top-right" />
                        <AppContent />
                    </div>
                </Router>
            </SettingsProvider>
        </AuthProvider>
    );
};

export default App;