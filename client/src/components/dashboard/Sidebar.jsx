import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, PieChart, Wallet, X, ChevronLeft, ChevronRight, Settings as SettingsIcon, LogOut, ShieldCheck } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';

const translations = {
    en: {
        dashboard: 'Dashboard',
        transactions: 'Transactions',
        udharo: 'Udharo',
        reports: 'Reports',
        settings: 'Settings',
        admin: 'Admin Panel',
        logout: 'Log Out',
        subtitle: 'Khata System'
    },
    ne: {
        dashboard: 'ड्यासबोर्ड',
        transactions: 'कारोबारहरू',
        udharo: 'उधारो खाता',
        reports: 'रिपोर्टहरू',
        settings: 'सेटिङहरू',
        admin: 'एडमिन प्यानल',
        logout: 'लगाउट (Logout)',
        subtitle: 'खाता प्रणाली'
    }
};

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { settings } = useSettings();
    const { logout, user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const lang = settings?.language || 'ne';
    const t = translations[lang];

    const businessItems = [
        { label: t.dashboard, path: '/dashboard', icon: LayoutDashboard },
        { label: t.transactions, path: '/transactions', icon: ReceiptText },
        { label: t.udharo, path: '/udharo', icon: Wallet },
        { label: t.reports, path: '/reports', icon: PieChart },
        { label: t.settings, path: '/settings', icon: SettingsIcon },
    ];

    const adminItems = [
        { label: t.admin, path: '/admin', icon: ShieldCheck },
    ];

    const menuItems = isAdmin ? adminItems : businessItems;

    const handleLinkClick = () => {
        if (window.innerWidth < 768) {
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 dark:bg-black/80 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar container */}
            <aside className={`
                fixed md:relative inset-y-0 left-0 z-50
                flex flex-col bg-white dark:bg-[#050505] border-r border-slate-200 dark:border-white/[0.05]
                transition-all duration-300 ease-in-out shrink-0
                ${isOpen
                    ? 'translate-x-0 w-[280px] p-6'
                    : '-translate-x-full md:translate-x-0 md:w-[84px] p-6 md:p-4 md:py-6'}
            `}>
                {/* Desktop Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute -right-3 top-8 hidden md:flex items-center justify-center w-6 h-6 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-full shadow-sm text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-transform z-50"
                >
                    {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                <div className={`flex items-center justify-between ${!isOpen && 'md:justify-center'}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/20">
                            <Wallet className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>
                        {isOpen && (
                            <div className="flex flex-col whitespace-nowrap overflow-hidden">
                                <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                                    {settings?.businessName || 'Khata'}
                                </span>
                                <span className="text-[11px] font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-widest">
                                    {settings?.businessSubtitle || t.subtitle}
                                </span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="md:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg"
                    >
                        <X className="w-5 h-5 dark:text-gray-400" />
                    </button>
                </div>

                <nav className="flex flex-col gap-2 flex-1 mt-8 overflow-y-auto custom-scrollbar">
                    {isOpen && <div className="text-[11px] font-bold text-slate-400 dark:text-gray-600 uppercase tracking-widest mb-2 px-3 whitespace-nowrap transition-opacity">{t.menu}</div>}
                    {menuItems.map(({ label, path, icon: Icon }) => (
                        <NavLink
                            key={label}
                            to={path}
                            onClick={handleLinkClick}
                            className={({ isActive }) => `flex items-center ${isOpen ? 'gap-3 px-3' : 'justify-center px-0'} py-3 rounded-xl transition-all duration-200 group
                                ${isActive
                                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400'
                                    : 'text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            title={!isOpen ? label : ''}
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-gray-500 group-hover:text-slate-600 dark:group-hover:text-gray-400'} transition-colors`} strokeWidth={isOpen ? 2 : 2.5} />
                                    {isOpen && <span className="text-[14px] font-bold uppercase tracking-tight whitespace-nowrap overflow-hidden">{label}</span>}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-white/5 font-sans">
                    <button
                        onClick={() => {
                            logout();
                            handleLinkClick();
                        }}
                        className={`flex items-center ${isOpen ? 'gap-3 px-3 w-full' : 'justify-center'} py-3 rounded-xl transition-all duration-200 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-bold group`}
                        title={!isOpen ? t.logout : ''}
                    >
                        <LogOut className="w-5 h-5 shrink-0" strokeWidth={2.5} />
                        {isOpen && <span className="text-[14px] uppercase tracking-wider">{t.logout}</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
