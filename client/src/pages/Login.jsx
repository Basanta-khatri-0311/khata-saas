import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, LogIn, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false)

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await login(email, password);
            if (user?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 sm:p-8 font-sans selection:bg-indigo-500/30">
            <div className="w-full max-w-md group">
                <div className="flex flex-col items-center mb-10 transition-transform duration-500 group-hover:-translate-y-1">
                    <div className="w-16 h-16 rounded-3xl bg-indigo-600 flex items-center justify-center shadow-[0_0_40px_-5px_rgba(79,70,229,0.3)] border border-white/10 mb-6 group-hover:rotate-6 transition-transform">
                        <Wallet className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Welcome Back.</h1>
                    <p className="text-zinc-500 font-medium">Log in to manage your digital khata.</p>
                </div>

                <div className="bg-[#050505] border border-white/5 rounded-[40px] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
                    {/* Subtle Gradient Glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/10 blur-[100px]" />

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-2xl flex items-center gap-3 animate-shake">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 transition-colors group-focus-within:text-indigo-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    required
                                    className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl px-12 text-sm font-medium text-white placeholder:text-zinc-700 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Secure Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl px-12 text-sm font-medium text-white placeholder:text-zinc-700 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                                >
                                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 mt-4 bg-white text-black hover:bg-zinc-200 font-bold rounded-2xl transition-all shadow-[0_10px_30px_-10px_rgba(255,255,255,0.2)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 text-base"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    Login
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-zinc-500 font-medium">
                    New to Khata?{' '}
                    <Link to="/register" className="text-white hover:text-indigo-400 transition-colors font-bold underline underline-offset-8 decoration-white/20">
                        Create an account
                    </Link>
                </p>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-shake { animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both; }
            `}} />
        </div>
    );
};

export default Login;
