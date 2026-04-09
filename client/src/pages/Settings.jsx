import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Settings as SettingsIcon, Save, Plus, X, Globe, Calendar } from 'lucide-react';
import DeleteConfirmModal from '../components/dashboard/DeleteConfirmModal';
import toast from 'react-hot-toast';

const translations = {
    en: {
        title: 'System Preferences',
        subtitle: 'Configure organization details and ledger categories globally.',
        identity: 'Organization Identity',
        businessName: 'Business Name',
        tagline: 'Subtitle / Tagline',
        whatsapp: 'Business WhatsApp (Notice Sender)',
        localization: 'Localization & System',
        language: 'System Language',
        income: 'Income Categories',
        expense: 'Expense Categories',
        save: 'Save All Changes',
        confirmTitle: 'Remove Category?',
        confirmMessage: 'Are you sure you want to remove this category?',
        confirmBtn: 'Remove Now',
        placeholder: 'Type and press enter...',
        success: 'System Preferences Saved 🗳️'
    },
    ne: {
        title: 'प्रणाली सेटिङहरू',
        subtitle: 'संस्थाको विवरण र खाताका वर्गहरू यहाँबाट मिलाउनुहोस्।',
        identity: 'संस्थाको पहिचान',
        businessName: 'व्यवसायको नाम',
        tagline: 'उप-शीर्षक / नारा',
        whatsapp: 'व्यवसायको वाट्सएप (नोटिस पठाउन)',
        localization: 'भाषा र प्रणाली',
        language: 'प्रणालीको भाषा',
        income: 'आम्दानीका वर्गहरू',
        expense: 'खर्चका वर्गहरू',
        save: 'सबै परिवर्तनहरू सुरक्षित गर्नुहोस्',
        confirmTitle: 'वर्ग हटाउने?',
        confirmMessage: 'के तपाईं पक्का यो वर्ग हटाउन चाहनुहुन्छ?',
        confirmBtn: 'अहिले हटाउनुहोस्',
        placeholder: 'लेख्नुहोस् र इन्टर थिच्नुहोस्...',
        success: 'प्रणाली प्राथमिकताहरू सुरक्षित गरियो 🗳️'
    }
};

const Settings = () => {
    const { settings, updateSettings, loading } = useSettings();
    const [formData, setFormData] = useState({
        businessName: '',
        businessSubtitle: '',
        businessPhone: '',
        incomeCategories: [],
        expenseCategories: [],
        language: 'ne'
    });
    
    const [newIncCat, setNewIncCat] = useState('');
    const [newExpCat, setNewExpCat] = useState('');
    const [saving, setSaving] = useState(false);

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        type: '', 
        index: null,
        categoryName: ''
    });

    useEffect(() => {
        if (settings) {
            setFormData({
                businessName: settings.businessName || '',
                businessSubtitle: settings.businessSubtitle || '',
                businessPhone: settings.businessPhone || '',
                incomeCategories: settings.incomeCategories || [],
                expenseCategories: settings.expenseCategories || [],
                language: settings.language || 'ne'
            });
        }
    }, [settings]);

    const lang = formData.language || 'ne';
    const t = translations[lang];

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateSettings(formData);
            toast.success(t.success);
        } catch (err) {
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const addCategory = (type) => {
        const value = type === 'income' ? newIncCat.trim() : newExpCat.trim();
        if (!value) return;

        if (type === 'income') {
            if (formData.incomeCategories.includes(value)) return toast.error('Already exists');
            setFormData(prev => ({ ...prev, incomeCategories: [...prev.incomeCategories, value] }));
            setNewIncCat('');
            toast.success(`Income Category "${value}" Added ✨`);
        } else {
            if (formData.expenseCategories.includes(value)) return toast.error('Already exists');
            setFormData(prev => ({ ...prev, expenseCategories: [...prev.expenseCategories, value] }));
            setNewExpCat('');
            toast.success(`Expense Category "${value}" Added ✨`);
        }
    };

    const requestRemoveCategory = (type, index, name) => {
        setConfirmModal({
            isOpen: true,
            type,
            index,
            categoryName: name
        });
    };

    const confirmRemoveCategory = () => {
        const { type, index, categoryName } = confirmModal;
        if (type === 'income') {
            setFormData(prev => ({ ...prev, incomeCategories: prev.incomeCategories.filter((_, i) => i !== index) }));
        } else {
            setFormData(prev => ({ ...prev, expenseCategories: prev.expenseCategories.filter((_, i) => i !== index) }));
        }
        toast.success(`Category "${categoryName}" Removed 🗑️`);
        setConfirmModal({ isOpen: false, type: '', index: null, categoryName: '' });
    };

    if (loading) return null;

    return (
        <div className="flex flex-col gap-8 w-full pb-12 transition-all">
            <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-tight">
                    <SettingsIcon className="w-6 h-6 text-indigo-500" strokeWidth={2.5} /> {t.title}
                </h2>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1 font-medium italic">{t.subtitle}</p>
            </div>

            {/* Localization Preferences */}
            <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-sm border border-slate-200 dark:border-white/[0.05] p-6 sm:p-8">
                <h3 className="text-sm font-black text-slate-400 dark:text-gray-500 border-b border-slate-100 dark:border-white/5 pb-4 mb-6 uppercase tracking-widest flex items-center gap-2">
                    <Globe className="w-4 h-4" /> {t.localization}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    {/* Language Toggle */}
                    <div className="flex flex-col gap-4">
                        <label className="text-[10px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-widest">{t.language}</label>
                        <div className="flex p-1 bg-slate-100 dark:bg-white/5 rounded-2xl w-fit">
                            <button 
                                onClick={() => setFormData({...formData, language: 'en'})}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${formData.language === 'en' ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-gray-500 hover:text-slate-700'}`}
                            >ENGLISH</button>
                            <button 
                                onClick={() => setFormData({...formData, language: 'ne'})}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${formData.language === 'ne' ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-gray-500 hover:text-slate-700'}`}
                            >नेपाली</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Organization Identity Card */}
            <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-sm border border-slate-200 dark:border-white/[0.05] p-6 sm:p-8">
                <h3 className="text-sm font-black text-slate-400 dark:text-gray-500 border-b border-slate-100 dark:border-white/5 pb-4 mb-6 uppercase tracking-widest">{t.identity}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-widest">{t.businessName}</label>
                        <input 
                            type="text" 
                            value={formData.businessName}
                            onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                            className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none text-slate-900 dark:text-white"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-widest">{t.tagline}</label>
                        <input 
                            type="text" 
                            value={formData.businessSubtitle}
                            onChange={(e) => setFormData({...formData, businessSubtitle: e.target.value})}
                            className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none text-slate-900 dark:text-white"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-widest">{t.whatsapp}</label>
                        <input 
                            type="tel" 
                            value={formData.businessPhone}
                            placeholder="e.g. 9800000000"
                            onChange={(e) => setFormData({...formData, businessPhone: e.target.value})}
                            className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none text-slate-900 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-sm border border-slate-200 dark:border-white/[0.05] p-6 sm:p-8 flex flex-col">
                    <h3 className="text-sm font-black text-slate-400 dark:text-gray-500 border-b border-slate-100 dark:border-white/5 pb-4 mb-6 uppercase tracking-widest">{t.income}</h3>
                    
                    <div className="flex gap-2 mb-6">
                        <input 
                            type="text" value={newIncCat} onChange={e => setNewIncCat(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addCategory('income')}
                            placeholder={t.placeholder}
                            className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:gray-600"
                        />
                        <button 
                            onClick={() => addCategory('income')} 
                            className="p-2.5 bg-indigo-600 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-black rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-600/10 dark:shadow-none"
                        >
                            <Plus className="w-5 h-5 flex-shrink-0" strokeWidth={3} />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {formData.incomeCategories.map((cat, idx) => (
                            <div key={idx} className="group flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-white/5 rounded-xl border border-transparent hover:border-indigo-500/30 transition-all cursor-default animate-in fade-in zoom-in duration-200">
                                <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-gray-300">{cat}</span>
                                <button 
                                    onClick={() => requestRemoveCategory('income', idx, cat)} 
                                    className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <X className="w-3 h-3" strokeWidth={3} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-sm border border-slate-200 dark:border-white/[0.05] p-6 sm:p-8 flex flex-col">
                    <h3 className="text-sm font-black text-slate-400 dark:text-gray-500 border-b border-slate-100 dark:border-white/5 pb-4 mb-6 uppercase tracking-widest">{t.expense}</h3>
                    
                    <div className="flex gap-2 mb-6">
                        <input 
                            type="text" value={newExpCat} onChange={e => setNewExpCat(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addCategory('expense')}
                            placeholder={t.placeholder}
                            className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:gray-600"
                        />
                        <button 
                            onClick={() => addCategory('expense')} 
                            className="p-2.5 bg-indigo-600 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-black rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-600/10 dark:shadow-none"
                        >
                            <Plus className="w-5 h-5 flex-shrink-0" strokeWidth={3} />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {formData.expenseCategories.map((cat, idx) => (
                            <div key={idx} className="group flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-white/5 rounded-xl border border-transparent hover:border-indigo-500/30 transition-all cursor-default animate-in fade-in zoom-in duration-200">
                                <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-gray-300">{cat}</span>
                                <button 
                                    onClick={() => requestRemoveCategory('expense', idx, cat)} 
                                    className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <X className="w-3 h-3" strokeWidth={3} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="h-14 px-10 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-black/10 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                >
                    {saving ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black rounded-full animate-spin" />
                    ) : (
                        <><Save className="w-5 h-5" strokeWidth={3} /> {t.save}</>
                    )}
                </button>
            </div>

            <DeleteConfirmModal 
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmRemoveCategory}
                title={t.confirmTitle}
                message={t.confirmMessage}
                confirmText={t.confirmBtn}
            />
        </div>
    );
};

export default Settings;
