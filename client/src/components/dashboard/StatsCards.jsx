import React from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const formatNPR = (val) =>
    'Rs. ' + Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const StatsCards = ({ summary }) => {
    const profitPositive = (summary.profit || 0) >= 0;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
                { 
                    label: 'Total Receipts (आम्दानी)', 
                    value: formatNPR(summary.totalSales), 
                    icon: TrendingUp, 
                    color: 'text-slate-900 dark:text-white', 
                    bgIcon: 'bg-emerald-100 dark:bg-emerald-500/10', 
                    textIcon: 'text-emerald-600 dark:text-emerald-400', 
                },
                { 
                    label: 'Total Payments (खर्च)', 
                    value: formatNPR(summary.totalExpenses), 
                    icon: TrendingDown, 
                    color: 'text-slate-900 dark:text-white', 
                    bgIcon: 'bg-rose-100 dark:bg-rose-500/10', 
                    textIcon: 'text-rose-600 dark:text-rose-400', 
                },
                { 
                    label: 'Net Balance (बाँकी)', 
                    value: formatNPR(summary.profit), 
                    icon: Wallet, 
                    color: profitPositive ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600 dark:text-rose-400', 
                    bgIcon: 'bg-indigo-100 dark:bg-indigo-500/10', 
                    textIcon: 'text-indigo-600 dark:text-indigo-400', 
                },
                { 
                    label: 'Outstanding Udharo', 
                    value: formatNPR(summary.totalUdharo), 
                    icon: Wallet, 
                    color: 'text-amber-600 dark:text-amber-400', 
                    bgIcon: 'bg-amber-100 dark:bg-amber-500/10', 
                    textIcon: 'text-amber-600 dark:text-amber-400', 
                },
            ].map(({ label, value, icon: Icon, color, bgIcon, textIcon }, idx) => (
                <div key={label} className="flex flex-col bg-white dark:bg-[#0a0a0a] p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-white/[0.05] transition-all hover:shadow-md dark:hover:border-white/[0.1]">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl ${bgIcon} flex items-center justify-center`}>
                            <Icon className={`w-6 h-6 ${textIcon}`} strokeWidth={2.5} />
                        </div>
                    </div>
                    <span className="text-sm font-semibold text-slate-500 dark:text-gray-400 mb-1">{label}</span>
                    <span className={`text-2xl lg:text-3xl font-bold tracking-tight ${color}`}>{value}</span>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;
