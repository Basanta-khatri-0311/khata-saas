import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    const location = useLocation();
    
    if (loading) return null;

    if (!user) {
        return <Navigate to="/" replace />;
    }

    // Redirect to pending page if not active
    if (user.status !== 'active' && location.pathname !== '/pending') {
        return <Navigate to="/pending" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
