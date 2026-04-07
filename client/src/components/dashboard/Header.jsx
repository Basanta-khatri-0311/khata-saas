import React from 'react';
import { Search, Bell, Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Header = ({ isSidebarOpen, setIsSidebarOpen, searchQuery, setSearchQuery }) => {
    const { theme, toggleTheme } = useTheme();

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
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Overview</h1>
                    <p className="text-sm text-slate-500 dark:text-gray-400 font-medium">Welcome back, here's your financial summary.</p>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end">
                <div className="flex items-center relative w-full max-w-[200px] sm:max-w-[260px]">
                    <Search className="w-4 h-4 text-slate-400 dark:text-gray-500 absolute left-3" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search notes..." 
                        className="h-10 w-full pl-9 pr-4 bg-slate-100 dark:bg-white/5 border-none rounded-full text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500" 
                    />
                </div>
                
                <button 
                    onClick={toggleTheme}
                    className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <button className="hidden sm:flex w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 items-center justify-center text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-black"></span>
                </button>
            </div>
        </header>
    );
};

export default Header;
