import React from 'react';
import { Navigate, Outlet, useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = () => {
    const { user, loading } = useAuth();
    const context = useOutletContext();

    if (loading) return null;

    return user && user.role === 'admin' 
        ? <Outlet context={context} /> 
        : <Navigate to="/dashboard" replace />;
};

export default AdminRoute;
