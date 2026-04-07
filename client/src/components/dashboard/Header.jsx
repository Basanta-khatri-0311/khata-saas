import React from 'react';
import { Search, Calendar, Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import NepaliDate from 'nepali-date-converter';

const Header = ({ isSidebarOpen, setIsSidebarOpen, searchQuery, setSearchQuery }) => {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const npDate = new NepaliDate();

    return (
        <header className="h-20 flex items-center justify-between px-4 sm:px-8 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/[0.05] shrink-0 z-10 transition-colors duration-300">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="md:hidden p-2 text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div className="flex flex-col hidden sm:flex">
                    <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                        {isAdmin ? 'Command Center' : 'Overview'}
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500 mt-1">Status: Operational</p>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end">
                <div className="flex items-center relative w-full max-w-[200px] sm:max-w-[260px]">
                    <Search className="w-4 h-4 text-slate-400 dark:text-gray-500 absolute left-3" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={isAdmin ? "Search registry..." : "Search ledger..."} 
                        className="h-10 w-full pl-9 pr-4 bg-slate-100 dark:bg-white/5 border-none rounded-full text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500" 
                    />
                </div>
                
                <button 
                    onClick={toggleTheme}
                    className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
                    <Calendar className="w-4 h-4 text-indigo-500" strokeWidth={2.5} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-gray-300">
                        {npDate.format('YYYY MMMM DD')} B.S.
                    </span>
                </div>
            </div>
        </header>
    );
};

export default Header;
