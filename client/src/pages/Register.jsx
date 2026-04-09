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
        <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center p-6 sm:p-8 font-sans selection:bg-indigo-500/30 transition-colors duration-500">
            <div className="w-full max-w-md group">
                <div className="flex flex-col items-center mb-6 transition-transform duration-500 group-hover:-translate-y-1">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-[0_0_40px_-5px_rgba(79,70,229,0.3)] border border-white/10 mb-4 group-hover:rotate-6 transition-transform">
                        <Wallet className="w-7 h-7 text-white" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">Create Account.</h1>
                    <p className="text-slate-500 dark:text-zinc-500 font-medium text-center">Join the next-gen financial ledger.</p>
                </div>

                <div className="bg-white dark:bg-[#050505] border border-slate-200 dark:border-white/5 rounded-[2rem] p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-colors">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/10 blur-[100px]" />

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-2xl flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-zinc-600 transition-colors group-focus-within:text-indigo-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nitesh Khatri"
                                    required
                                    className="w-full h-12 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl px-11 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-zinc-700 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-sans"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-zinc-600" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="nitesh@khata.io"
                                    required
                                    className="w-full h-12 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl px-11 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-zinc-700 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-sans"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Secure Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-zinc-600" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full h-12 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl px-11 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-zinc-700 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-sans"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-600 hover:text-slate-900 dark:hover:text-zinc-400 transition-colors"
                                >
                                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 mt-2 bg-black dark:bg-white text-white dark:text-black hover:opacity-90 font-bold rounded-xl transition-all shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_30px_-10px_rgba(255,255,255,0.1)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/20 border-t-white dark:border-black/20 dark:border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    Join Khata
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-6 text-slate-500 dark:text-zinc-500 font-medium text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-slate-900 dark:text-white hover:text-indigo-400 transition-colors font-bold underline underline-offset-8 decoration-slate-900/20 dark:decoration-white/20">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
