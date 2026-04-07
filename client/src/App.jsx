import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AdminPanel from './pages/AdminPanel';
import PendingApproval from './pages/PendingApproval';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import { Toaster } from 'react-hot-toast';

const AppRoutes = () => {
    const { user } = useAuth();
    
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route path="/" element={<ProtectedRoute />}>
                    {/* Non-Active users land here */}
                    <Route path="pending" element={<PendingApproval />} />

                    {/* Active users access Main Shell */}
                    <Route element={<MainLayout />}>
                        <Route index element={<Navigate to={user?.role === 'admin' ? "/admin" : "/dashboard"} replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="transactions" element={<Transactions />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="settings" element={<Settings />} />
                        
                        {/* Admin Specific Routes */}
                        <Route element={<AdminRoute />}>
                            <Route path="admin" element={<AdminPanel />} />
                        </Route>
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

const App = () => {
    return (
        <AuthProvider>
            <SettingsProvider>
                <Toaster position="top-right" reverseOrder={false} />
                <AppRoutes />
            </SettingsProvider>
        </AuthProvider>
    );
};

export default App;