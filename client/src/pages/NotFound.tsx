import React from 'react';
import { Link } from 'react-router-dom';
import { Ghost, Box } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center p-6 transition-colors duration-500">
            <div className="relative w-full max-w-lg">
                {/* Background Decor */}
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-600/10 dark:bg-indigo-600/5 blur-[120px] rounded-full" />
                <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-slate-600/10 dark:bg-zinc-600/5 blur-[120px] rounded-full" />
                
                <div className="relative z-10 text-center space-y-8 animate-in fade-in zoom-in duration-700">
                    <div className="flex justify-center">
                        <div className="relative group">
                            <Box className="w-32 h-32 text-slate-200 dark:text-zinc-800 transition-transform duration-700 group-hover:rotate-12" strokeWidth={1} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-5xl font-black text-slate-400 dark:text-white italic tracking-tighter">404</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Sector Missing</h1>
                        <p className="text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                            The requested resource is not available in the system registry.
                        </p>
                    </div>

                    <div className="pt-6">
                        <Link 
                            to="/" 
                            className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:opacity-80 transition-all border-b-2 border-indigo-500/20 pb-1"
                        >
                            Execute Root Reset
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
