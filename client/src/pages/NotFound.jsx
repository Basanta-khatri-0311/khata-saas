import React from 'react';
import { Link } from 'react-router-dom';
import { Ghost, Box } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
            <div className="relative">
                {/* Background Decor */}
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-zinc-600/10 blur-[120px] rounded-full" />
                
                <div className="relative z-10 text-center space-y-8">
                    <div className="flex justify-center">
                        <div className="relative">
                            <Box className="w-32 h-32 text-zinc-800" strokeWidth={1} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-5xl font-black text-white italic">404</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <h1 className="text-3xl font-black text-white tracking-widest uppercase italic">Sector Missing</h1>
                        <p className="text-zinc-500 font-bold uppercase tracking-tight text-xs">
                            The requested resource is not available in the current ledger state.
                        </p>
                    </div>

                    <div className="pt-6">
                        <Link 
                            to="/" 
                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors border-b border-white/10 pb-1"
                        >
                            Back to System Root
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
