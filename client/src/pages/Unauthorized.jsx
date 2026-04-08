import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="flex justify-center">
                    <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                        <ShieldAlert className="w-12 h-12 text-red-500" strokeWidth={2.5} />
                    </div>
                </div>
                
                <div className="space-y-3">
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Access Denied</h1>
                    <p className="text-zinc-500 font-medium">
                        You do not have the necessary clearance level to access this operational sector.
                    </p>
                </div>

                <div className="pt-8">
                    <Link 
                        to="/dashboard" 
                        className="inline-flex items-center gap-3 px-8 h-14 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 transition-all active:scale-95"
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
