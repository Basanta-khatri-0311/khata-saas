import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Settings as SettingsIcon, Save, Plus, X } from 'lucide-react';

const Settings = () => {
    const { settings, updateSettings, loading } = useSettings();
    const [formData, setFormData] = useState({
        businessName: '',
        businessSubtitle: '',
        incomeCategories: [],
        expenseCategories: []
    });
    
    const [newIncCat, setNewIncCat] = useState('');
    const [newExpCat, setNewExpCat] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (settings) {
            setFormData({
                businessName: settings.businessName || '',
                businessSubtitle: settings.businessSubtitle || '',
                incomeCategories: settings.incomeCategories || [],
                expenseCategories: settings.expenseCategories || []
            });
        }
    }, [settings]);

    const handleSave = async () => {
        setSaving(true);
        await updateSettings(formData);
        setSaving(false);
    };

    const addCategory = (type) => {
        if (type === 'income' && newIncCat.trim()) {
            setFormData(prev => ({ ...prev, incomeCategories: [...prev.incomeCategories, newIncCat.trim()] }));
            setNewIncCat('');
        } else if (type === 'expense' && newExpCat.trim()) {
            setFormData(prev => ({ ...prev, expenseCategories: [...prev.expenseCategories, newExpCat.trim()] }));
            setNewExpCat('');
        }
    };

    const removeCategory = (type, index) => {
        if (type === 'income') {
            setFormData(prev => ({ ...prev, incomeCategories: prev.incomeCategories.filter((_, i) => i !== index) }));
        } else {
            setFormData(prev => ({ ...prev, expenseCategories: prev.expenseCategories.filter((_, i) => i !== index) }));
        }
    };

    if (loading) return null;

    return (
        <div className="flex flex-col gap-8 max-w-4xl">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <SettingsIcon className="w-6 h-6 text-indigo-500" /> System Prefernces
                </h2>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Configure your organization details and ledger categories globally.</p>
            </div>

            <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-sm border border-slate-200 dark:border-white/[0.05] p-6 sm:p-8">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-4 mb-6">Organization Identity</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-wider">Business Name</label>
                        <input 
                            type="text" 
                            value={formData.businessName}
                            onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                            className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/50 outline-none text-slate-900 dark:text-white"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-wider">Subtitle / Tagline</label>
                        <input 
                            type="text" 
                            value={formData.businessSubtitle}
                            onChange={(e) => setFormData({...formData, businessSubtitle: e.target.value})}
                            className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/50 outline-none text-slate-900 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Income Categories */}
                <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-sm border border-slate-200 dark:border-white/[0.05] p-6 sm:p-8">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-4 mb-6">Income Categories</h3>
                    
                    <div className="flex gap-2 mb-4">
                        <input 
                            type="text" value={newIncCat} onChange={e => setNewIncCat(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addCategory('income')}
                            placeholder="Add category..."
                            className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none text-slate-900 dark:text-white"
                        />
                        <button onClick={() => addCategory('income')} className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors">
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {formData.incomeCategories.map((cat, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
                                {cat}
                                <button onClick={() => removeCategory('income', idx)} className="hover:text-emerald-900 dark:hover:text-emerald-200"><X className="w-3 h-3"/></button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Expense Categories */}
                <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-sm border border-slate-200 dark:border-white/[0.05] p-6 sm:p-8">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-4 mb-6">Expense Categories</h3>
                    
                    <div className="flex gap-2 mb-4">
                        <input 
                            type="text" value={newExpCat} onChange={e => setNewExpCat(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addCategory('expense')}
                            placeholder="Add category..."
                            className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-rose-500/50 outline-none text-slate-900 dark:text-white"
                        />
                        <button onClick={() => addCategory('expense')} className="p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-colors">
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {formData.expenseCategories.map((cat, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 text-sm font-medium">
                                {cat}
                                <button onClick={() => removeCategory('expense', idx)} className="hover:text-rose-900 dark:hover:text-rose-200"><X className="w-3 h-3"/></button>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                    {saving ? 'Saving...' : <><Save className="w-5 h-5"/> Save Preferences</>}
                </button>
            </div>
        </div>
    );
};

export default Settings;
