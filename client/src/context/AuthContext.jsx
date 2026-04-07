import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const logoutTimerRef = useRef(null);

    const logout = useCallback(() => {
        localStorage.removeItem('userInfo');
        setUser(null);
        if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    }, []);

    const resetLogoutTimer = useCallback(() => {
        if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
        // Set timer for 1 hour (3600000ms)
        logoutTimerRef.current = setTimeout(() => {
            console.log("Session expired due to inactivity");
            logout();
        }, 3600000); 
    }, [logout]);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
        resetLogoutTimer();
        return data;
    };

    const register = async (regData) => {
        const { data } = await api.post('/auth/register', regData);
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
        resetLogoutTimer();
        return data;
    };

    // Check for existing session on load
    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
            resetLogoutTimer();
        }
        setLoading(false);
    }, [resetLogoutTimer]);

    // Global Activity Listener for the 1-hour timeout
    useEffect(() => {
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        const handleActivity = () => {
            if (user) resetLogoutTimer();
        };

        events.forEach(event => window.addEventListener(event, handleActivity));
        return () => {
            events.forEach(event => window.removeEventListener(event, handleActivity));
            if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
        };
    }, [user, resetLogoutTimer]);

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
