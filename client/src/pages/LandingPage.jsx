import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Wallet, Shield, PieChart, FileText, ArrowRight, Sun, Moon, Zap, UserPlus, Layers, Globe, Activity } from 'lucide-react';

const LandingPage = () => {
    const { user, loading } = useAuth();
    const { theme, toggleTheme } = useTheme();

    if (loading) return null;

    if (user) {
        return <Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} replace />;
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#050505] text-slate-900 dark:text-zinc-100 transition-colors duration-500 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
            
            {/* Minimalist Navigation */}
            <nav className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-6 sm:px-16 z-[100] backdrop-blur-md bg-white/80 dark:bg-[#050505]/80 border-b border-slate-100 dark:border-white/[0.05]">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-black dark:bg-white flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-white dark:text-black" strokeWidth={2.5} />
                    </div>
                    <span className="text-lg font-black tracking-tight uppercase italic">KHATA</span>
                </div>

                <div className="flex items-center gap-8">
                    <button 
                        onClick={toggleTheme}
                        className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                    >
                        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                    <Link to="/login" className="hidden sm:block text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-black dark:hover:text-white transition-colors">Sign In</Link>
                    <Link to="/register" className="h-10 px-5 bg-black dark:bg-white text-white dark:text-black rounded-lg text-[10px] font-bold uppercase tracking-[0.1em] flex items-center gap-2 hover:opacity-80 transition-all">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Clean Hero System */}
            <section className="pt-48 pb-32 px-6 sm:px-16 max-w-7xl mx-auto flex flex-col items-start text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-6 font-mono">
                    System v2.4.0 — Operational
                </div>

                <h1 className="text-6xl sm:text-8xl font-black tracking-tighter leading-[0.85] mb-10 max-w-3xl">
                    Industrial <br /> Financial <br /> Ledger.
                </h1>

                <p className="text-lg sm:text-xl font-medium text-slate-500 dark:text-zinc-400 max-w-xl leading-relaxed mb-12 border-l-2 border-slate-200 dark:border-zinc-800 pl-8">
                    A multi-tenant SaaS infrastructure designed for businesses that demand precision, multitenancy, and Bikram Sambat localization. Built for high-volume ledger operations.
                </p>

                <div className="flex flex-wrap items-center gap-6">
                    <Link to="/register" className="h-14 px-10 bg-black dark:bg-white text-white dark:text-black rounded-xl font-black uppercase tracking-widest flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10 dark:shadow-white/5">
                        Register Yourself <ArrowRight className="w-4 h-4" />
                    </Link>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Infrastructure Live
                    </div>
                </div>
            </section>

            {/* Features Specification Table */}
            <section className="px-6 sm:px-16 py-24 border-t border-slate-100 dark:border-white/[0.05]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        
                        {/* Entry 01 */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-slate-400">
                                <span className="text-[10px] font-black font-mono">CORE_001</span>
                                <div className="h-[1px] flex-1 bg-slate-100 dark:bg-white/10" />
                            </div>
                            <h3 className="text-3xl font-black tracking-tight uppercase">RBAC Protocol</h3>
                            <p className="text-slate-500 dark:text-zinc-500 font-medium leading-relaxed max-w-md">
                                Industrial Role-Based Access Control. Isolated multitenancy ensures your business data remains strictly confidential and secure under military-grade encryption standards.
                            </p>
                            <ul className="space-y-3">
                                {['Atomic Permissions', 'Data Isolation', 'Secure Shell'].map(f => (
                                    <li key={f} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">
                                        <div className="w-1 h-4 bg-indigo-500" /> {f}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Entry 02 */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-slate-400">
                                <span className="text-[10px] font-black font-mono">LOCL_002</span>
                                <div className="h-[1px] flex-1 bg-slate-100 dark:bg-white/10" />
                            </div>
                            <h3 className="text-3xl font-black tracking-tight uppercase">B.S. Date Sync</h3>
                            <p className="text-slate-500 dark:text-zinc-500 font-medium leading-relaxed max-w-md">
                                Native Bikram Sambat integration. Align your financial reports with local tax regulations effortlessly. Sync global ledger entries with the regional B.S. calendar.
                            </p>
                            <ul className="space-y-3">
                                {['Precise Conversion', 'IRD Compliance', 'Regional Sync'].map(f => (
                                    <li key={f} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">
                                        <div className="w-1 h-4 bg-emerald-500" /> {f}
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                </div>
            </section>

            {/* Industrial Data Section */}
            <section className="px-6 sm:px-16 py-32 bg-slate-50 dark:bg-white/[0.01] border-y border-slate-100 dark:border-white/[0.05]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="max-w-xl">
                        <h2 className="text-4xl font-black tracking-tighter uppercase mb-6">Real-Time Analytical Output</h2>
                        <p className="text-slate-500 dark:text-zinc-500 font-medium leading-relaxed">
                            Visualize your cash flow trends with our high-frequency data engine. Track income, expenses, and category distributions through a minimalist analytical interface.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                        {[
                            { label: 'Uptime', val: '99.9%', icon: Activity },
                            { label: 'Latency', val: '12ms', icon: Zap },
                            { label: 'Cleansed', val: '100%', icon: Shield },
                            { label: 'Scalable', val: '∞', icon: Layers }
                        ].map((s, i) => (
                            <div key={i} className="p-6 bg-white dark:bg-[#050505] border border-slate-200 dark:border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2">
                                <s.icon className="w-5 h-5 text-slate-400" />
                                <span className="text-xl font-black">{s.val}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Terminal CTA */}
            <section className="py-40 px-6 sm:px-16 text-center">
                <h2 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase mb-12">Initialize Your <br /> Corporate Ledger.</h2>
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Link to="/register" className="h-16 px-12 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:scale-[1.03] transition-all">
                        Establish Entry Post <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Industrial Monochrome Footer */}
            <footer className="py-16 px-6 sm:px-16 border-t border-slate-100 dark:border-white/[0.05] bg-white dark:bg-[#050505]">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 opacity-40">
                    <div className="flex items-center gap-3 grayscale cursor-default">
                        <Wallet className="w-5 h-5" strokeWidth={2.5} />
                        <span className="text-sm font-black tracking-tight uppercase italic">KHATA_SYS</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest">© 2026 Modular Financial Systems. Strictly Confidential.</p>
                </div>
            </footer>

        </div>
    );
};

export default LandingPage;
