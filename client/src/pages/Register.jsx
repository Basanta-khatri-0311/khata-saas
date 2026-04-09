import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, UserPlus, Mail, Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await register({ name, email, password });
            if (user?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050505] flex items-center justify-center p-6 sm:p-8 font-sans selection:bg-indigo-500/30 transition-colors duration-500 relative overflow-hidden">
            {/* Background Grid Elements */}
            <div className="fixed inset-0 grid-bg pointer-events-none z-0" />
            <div className="fixed inset-0 noise pointer-events-none z-0" />

            <div className="w-full max-w-md group relative z-10">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-600/20 mb-6">
                        <Wallet className="w-7 h-7 text-white" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2 uppercase italic">Register</h1>
                    <p className="text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Start managing yours business today</p>
                </div>

                <div className="bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl shadow-black/5">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-2xl flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-zinc-700 transition-colors" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your Name"
                                    required
                                    className="w-full h-14 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl px-12 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-zinc-800 outline-none focus:border-indigo-500/50 transition-all font-sans"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-zinc-700 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="yourname@gmail.com"
                                    required
                                    className="w-full h-14 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl px-12 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-zinc-800 outline-none focus:border-indigo-500/50 transition-all font-sans"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-zinc-700" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full h-14 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-2xl px-12 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-zinc-800 outline-none focus:border-indigo-500/50 transition-all font-sans"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-700 hover:text-indigo-500 transition-colors"
                                >
                                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full h-14 mt-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-[0.2em] rounded-2xl overflow-hidden transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-xs shadow-xl shadow-black/5"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/20 border-t-white dark:border-black/20 dark:border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <UserPlus className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-600 dark:text-white hover:underline underline-offset-8">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
