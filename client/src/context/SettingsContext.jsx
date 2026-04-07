import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        businessName: 'Khata',
        businessSubtitle: 'खाता प्रणाली',
        incomeCategories: ['General Income', 'Sales', 'Services'],
        expenseCategories: ['General Expense', 'Rent', 'Khaja', 'Salary', 'Internet']
    });
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/settings');
            if (res.data) setSettings(res.data);
        } catch (err) {
            console.error('Failed to fetch settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async (newSettings) => {
        try {
            const res = await api.put('/settings', newSettings);
            setSettings(res.data);
            return true;
        } catch (err) {
            console.error('Failed to update settings:', err);
            return false;
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);
