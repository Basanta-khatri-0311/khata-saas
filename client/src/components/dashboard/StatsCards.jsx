import React from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const formatNPR = (val) =>
    'Rs. ' + Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const StatsCards = ({ summary }) => {
    // For now, defaulting totalSales and totalExpenses to 0 as requested, we'll implement later
    const displaySales = 0; 
    const displayExpenses = 0;
    const profitPositive = (summary.profit || 0) >= 0;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
                { 
                    label: 'Total Receipts (आम्दानी)', 
                    value: formatNPR(displaySales), 
                    icon: TrendingUp, 
                    color: 'text-slate-900 dark:text-white', 
                    bgIcon: 'bg-emerald-100 dark:bg-emerald-500/10', 
                    textIcon: 'text-emerald-600 dark:text-emerald-400', 
                    trend: 'Not set' 
                },
                { 
                    label: 'Total Payments (खर्च)', 
                    value: formatNPR(displayExpenses), 
                    icon: TrendingDown, 
                    color: 'text-slate-900 dark:text-white', 
                    bgIcon: 'bg-rose-100 dark:bg-rose-500/10', 
                    textIcon: 'text-rose-600 dark:text-rose-400', 
                    trend: 'Not set' 
                },
                { 
                    label: 'Net Balance (बाँकी)', 
                    value: formatNPR(summary.profit), 
                    icon: Wallet, 
                    color: profitPositive ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600 dark:text-rose-400', 
                    bgIcon: 'bg-indigo-100 dark:bg-indigo-500/10', 
                    textIcon: 'text-indigo-600 dark:text-indigo-400', 
                    trend: 'All time' 
                },
            ].map(({ label, value, icon: Icon, color, bgIcon, textIcon, trend }, idx) => (
                <div key={label} className="flex flex-col bg-white dark:bg-[#0a0a0a] p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-white/[0.05] transition-all hover:shadow-md dark:hover:border-white/[0.1]">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-2xl ${bgIcon} flex items-center justify-center`}>
                            <Icon className={`w-6 h-6 ${textIcon}`} strokeWidth={2.5} />
                        </div>
                        {idx !== 2 ? (
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${idx === 0 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400'}`}>
                                {trend}
                            </span>
                        ) : (
                            <span className="text-xs font-semibold text-slate-400 dark:text-gray-500">{trend}</span>
                        )}
                    </div>
                    <span className="text-sm font-semibold text-slate-500 dark:text-gray-400 mb-1">{label}</span>
                    <span className={`text-2xl lg:text-3xl font-bold tracking-tight ${color}`}>{value}</span>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;
