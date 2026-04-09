import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center p-6 transition-colors duration-500">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
                <div className="flex justify-center">
                    <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 shadow-2xl shadow-red-500/5">
                        <ShieldAlert className="w-12 h-12 text-red-500" strokeWidth={2.5} />
                    </div>
                </div>
                
                <div className="space-y-3">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Access Denied</h1>
                    <p className="text-slate-500 dark:text-zinc-500 font-medium">
                        You do not have the necessary clearance level to access this operational sector.
                    </p>
                </div>

                <div className="pt-8">
                    <Link 
                        to="/dashboard" 
                        className="inline-flex items-center gap-3 px-8 h-14 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-black/10 dark:shadow-white/5 text-sm"
                    >
                        <ArrowLeft className="w-5 h-5" strokeWidth={3} />
                        Return to Base
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
