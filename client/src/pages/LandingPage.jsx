import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Wallet, Shield, PieChart, FileText, ArrowRight, Sun, Moon, Zap, UserPlus, Layers, Globe, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
    const { user, loading } = useAuth();
    const { theme, toggleTheme } = useTheme();

    if (loading) return null;

    if (user) {
        return <Navigate to={user.role === 'admin' ? "/admin" : "/dashboard"} replace />;
    }

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-zinc-100 transition-colors duration-500 font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
            
            {/* Background Grid Elements */}
            <div className="fixed inset-0 grid-bg pointer-events-none z-0" />
            <div className="fixed inset-0 noise pointer-events-none z-0" />

            {/* Minimalist Navigation */}
            <nav className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-6 sm:px-16 z-[100] backdrop-blur-md bg-white/30 dark:bg-[#050505]/30 border-b border-slate-100 dark:border-white/[0.05]">
                <div className="flex items-center gap-2.5 relative z-10">
                    <div className="w-9 h-9 rounded-xl bg-black dark:bg-white flex items-center justify-center shadow-lg shadow-black/10">
                        <Wallet className="w-5 h-5 text-white dark:text-black" strokeWidth={2.5} />
                    </div>
                    <span className="text-lg font-black tracking-tight uppercase italic transition-colors">KHATA</span>
                </div>

                <div className="flex items-center gap-8 relative z-10">
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
            <motion.section 
                {...fadeInUp}
                className="sm:pt-56 pt-40 pb-32 px-6 sm:px-16 max-w-7xl mx-auto flex flex-col items-start text-left relative z-10"
            >
                <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] mb-12 max-w-4xl italic">
                    Industrial <br /> Financial <br /> Ledger.
                </h1>

                <p className="text-lg sm:text-xl font-medium text-slate-500 dark:text-zinc-400 max-w-xl leading-relaxed mb-16 border-l-2 border-indigo-500 pl-8">
                    Multi-tenant infrastructure with Offline Ledger Sync, Udharo Monitoring, and native Bilingual support. Built for precision.
                </p>

                <div className="flex flex-wrap items-center gap-8">
                    <Link to="/register" className="h-16 px-12 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-black/20 dark:shadow-white/5">
                        Start your Ledger <ArrowRight className="w-5 h-4" />
                    </Link>
                </div>
            </motion.section>

            {/* Features Expanded Specification */}
            <section className="px-6 sm:px-16 py-32 border-t border-slate-100 dark:border-white/[0.05] relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 sm:gap-24">

                        {/* Feature 01: Offline Sync */}
                        <motion.div {...fadeInUp} className="space-y-6">
                            <h3 className="text-3xl font-black tracking-tighter uppercase italic text-indigo-500">Offline Sync</h3>
                            <p className="text-slate-500 dark:text-zinc-500 font-medium leading-relaxed">
                                Record transactions without internet. Our system buffers ledger entries and synchronizes instantly when you're back online.
                            </p>
                            <ul className="space-y-3">
                                {['Low Latency', 'Instant Buffer', 'Auto-Sync'].map(f => (
                                    <li key={f} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> {f}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Feature 02: Bilingual Support */}
                        <motion.div {...fadeInUp} transition={{ delay: 0.1, duration: 0.8 }} className="space-y-6">
                            <h3 className="text-3xl font-black tracking-tighter uppercase italic text-emerald-500">Bilingual Ops</h3>
                            <p className="text-slate-500 dark:text-zinc-500 font-medium leading-relaxed">
                                Native support for English and Nepali. Switching languages updates every report, invoice, and interface label instantly.
                            </p>
                            <ul className="space-y-3">
                                {['English / Nepali', 'Regional Formats', 'Dual Reports'].map(f => (
                                    <li key={f} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {f}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Feature 03: Udharo Management */}
                        <motion.div {...fadeInUp} transition={{ delay: 0.2, duration: 0.8 }} className="space-y-6">
                            <h3 className="text-3xl font-black tracking-tighter uppercase italic text-amber-500">Udharo Control</h3>
                            <p className="text-slate-500 dark:text-zinc-500 font-medium leading-relaxed">
                                Advanced credit tracking with automated balance reconciliation. Monitor payments and manage accounts with surgical precision.
                            </p>
                            <ul className="space-y-3">
                                {['Credit Tracking', 'Pending Alerts', 'Direct Ledger'].map(f => (
                                    <li key={f} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {f}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Analytical & Visual System */}
            <section className="px-6 sm:px-16 py-32 bg-white/30 dark:bg-white/[0.01] border-y border-slate-100 dark:border-white/[0.05] relative z-10 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto flex flex-col lg:row items-center justify-between gap-16">
                    <motion.div {...fadeInUp} className="max-w-xl">
                        <h2 className="text-5xl font-black tracking-tighter uppercase mb-6 italic">Visual Intelligence</h2>
                        <p className="text-slate-500 dark:text-zinc-500 font-medium leading-relaxed mb-8">
                            Transform yours raw ledger data into actionable insight. Our high-frequency data engine generates real-time income and expense distribution charts instantly.
                        </p>
                        <div className="flex items-center gap-8">
                            <div className="flex flex-col">
                                <span className="text-2xl font-black">99.9%</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Accuracy Rate</span>
                            </div>
                            <div className="w-px h-10 bg-slate-200 dark:bg-white/10" />
                            <div className="flex flex-col">
                                <span className="text-2xl font-black">12ms</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Processing</span>
                            </div>
                        </div>
                    </motion.div>
                    <div className="grid grid-cols-2 gap-6 w-full lg:w-auto">
                        {[
                            { label: 'Security', val: 'Atomic', icon: Shield },
                            { label: 'Sync', val: 'Direct', icon: Activity },
                            { label: 'Reports', val: 'Ready', icon: FileText },
                            { label: 'Data', val: 'Unified', icon: PieChart }
                        ].map((s, i) => (
                            <motion.div 
                                key={i} 
                                {...fadeInUp}
                                transition={{ delay: 0.1 * i, duration: 0.8 }}
                                className="p-8 bg-white dark:bg-black/50 border border-slate-200 dark:border-white/5 rounded-[2rem] flex flex-col items-center justify-center gap-3 shadow-xl shadow-black/5 transition-transform hover:-translate-y-1"
                            >
                                <s.icon className="w-6 h-6 text-indigo-500" />
                                <span className="text-xl font-black uppercase tracking-tight">{s.val}</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{s.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Terminal Final CTA */}
            <motion.section 
                {...fadeInUp}
                className="py-48 px-6 sm:px-16 text-center relative z-10"
            >
                <h2 className="text-5xl sm:text-7xl font-black tracking-tighter uppercase mb-16 italic">Initialize Your <br /> Station.</h2>
                <div className="flex flex-wrap items-center justify-center gap-6">
                    <Link to="/register" className="h-20 px-16 bg-black dark:bg-white text-white dark:text-black rounded-3xl font-black uppercase tracking-[0.2em] flex items-center gap-4 hover:scale-[1.03] transition-all shadow-2xl shadow-indigo-600/10 active:scale-95">
                        Register Entity <ArrowRight className="w-6 h-6" />
                    </Link>
                </div>
            </motion.section>

            {/* Industrial Monochrome Footer */}
            <footer className="py-20 px-6 sm:px-16 border-t border-slate-100 dark:border-white/[0.05] bg-white/50 dark:bg-[#050505]/50 backdrop-blur-md relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-2.5 opacity-40 grayscale">
                        <Wallet className="w-5 h-5 text-black dark:text-white" />
                        <span className="text-sm font-black uppercase italic">KHATA</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30 text-center">© {new Date().getFullYear()} Modular Financial Systems. Strictly Confidential.</p>
                </div>
            </footer>

        </div>
    );
};

export default LandingPage;
