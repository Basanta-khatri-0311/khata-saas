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
        logoutTimerRef.current = setTimeout(() => {
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

    // Robust Initialization
    useEffect(() => {
        const initAuth = () => {
            try {
                const stored = localStorage.getItem('userInfo');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setUser(parsed);
                    // Manually trigger timer instead of dependency
                    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
                    logoutTimerRef.current = setTimeout(() => logout(), 3600000);
                }
            } catch (err) {
                console.error("Storage Error:", err);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, [logout]);

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
