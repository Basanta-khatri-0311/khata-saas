import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../dashboard/Sidebar';
import Header from '../dashboard/Header';

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex h-screen bg-[#F8FAFC] dark:bg-black text-slate-800 dark:text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden transition-colors duration-300">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative border-l border-transparent dark:border-white/[0.05] transition-colors duration-300">
                <Header
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />

                {/* Scrollable Page Body */}
                <div className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-6 sm:gap-8 pb-24 custom-scrollbar">
                    <Outlet context={{ searchQuery }} />
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
                
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #444; }
            `}</style>
        </div>
    );
};

export default MainLayout;
