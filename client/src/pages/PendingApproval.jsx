import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Clock, LogOut, ShieldAlert } from 'lucide-react';

const PendingApproval = () => {
    const { user, logout } = useAuth();
    const isSuspended = user?.status === 'suspended';

    return (
        <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center p-6 font-sans transition-colors duration-500">
            <div className="w-full max-w-md bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/5 p-8 sm:p-10 flex flex-col items-center text-center animate-in fade-in zoom-in duration-700">
                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 rotate-3 ${isSuspended ? 'bg-rose-500/10' : 'bg-amber-500/10'}`}>
                    {isSuspended ? (
                        <ShieldAlert className="w-12 h-12 text-rose-500" strokeWidth={2.5} />
                    ) : (
                        <Clock className="w-12 h-12 text-amber-500" strokeWidth={2.5} />
                    )}
                </div>

                <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-4">
                    {isSuspended ? "Access Revoked" : "Await Verification"}
                </h1>
                
                <p className="text-sm font-medium text-slate-500 dark:text-gray-500 leading-relaxed mb-10">
                    {isSuspended 
                        ? "Your account has been suspended by the administrator. Access to the financial ledger is currently restricted."
                        : `Hello ${user?.name}, your registration is successful! Our administration is currently reviewing your credentials. You will gain full access shortly.`
                    }
                </p>

                <div className="w-full flex flex-col gap-6">
                    <div className="py-4 px-6 bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-slate-100 dark:border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-gray-600 block mb-1">Status Registry</span>
                        <span className={`text-xs font-black uppercase tracking-widest ${isSuspended ? 'text-rose-500' : 'text-amber-500'}`}>
                            {user?.status}
                        </span>
                    </div>

                    <button 
                        onClick={logout}
                        className="h-14 w-full bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:opacity-80 active:scale-95 transition-all shadow-xl shadow-black/10 dark:shadow-white/5"
                    >
                        <LogOut className="w-5 h-5 text-rose-500" />
                        Exit Session
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PendingApproval;
