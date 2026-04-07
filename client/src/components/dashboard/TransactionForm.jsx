import React, { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const TransactionForm = ({ addTransaction, submitting, amount, setAmount, note, setNote, type, setType, category, setCategory, date, setDate, isModal = false }) => {
    const { settings } = useSettings();
    const categories = type === 'sale' ? (settings?.incomeCategories || []) : (settings?.expenseCategories || []);

    const today = new Date().toISOString().split('T')[0];

    // Auto-select first category if empty when type changes
    useEffect(() => {
        if (!category && categories.length > 0) {
            setCategory(categories[0]);
        } else if (categories.length > 0 && !categories.includes(category)) {
            setCategory(categories[0]);
        }
    }, [type, categories, category, setCategory]);

    const formContent = (
        <form onSubmit={addTransaction} className="flex flex-col gap-6">
            {/* Type Toggle */}
            <div className="flex p-1.5 bg-slate-100 dark:bg-white/5 rounded-2xl">
                <button
                    type="button"
                    onClick={() => setType('sale')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all
                        ${type === 'sale'
                            ? 'bg-white dark:bg-white/10 text-emerald-600 dark:text-emerald-400 shadow-sm'
                            : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'
                        }`}
                >Receipt</button>
                <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all
                        ${type === 'expense'
                            ? 'bg-white dark:bg-white/10 text-rose-600 dark:text-rose-400 shadow-sm'
                            : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'
                        }`}
                >Payment</button>
            </div>

            {/* Amount Input */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest ml-1 text-[10px]">Amount</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-gray-500 font-bold">Rs.</span>
                    <input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        min="0"
                        step="0.01"
                        className="w-full h-14 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-4 text-base font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-gray-600 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-sans"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-5">
                {/* Category Dropdown */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest ml-1 text-[10px]">Transaction Category</label>
                    <div className="relative">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full h-14 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer pr-10"
                        >
                            {categories.map((cat, idx) => (
                                <option key={idx} value={cat} className="text-slate-900 bg-white dark:bg-[#0a0a0a]">{cat}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                        </div>
                    </div>
                </div>

                {/* Date Picker */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest ml-1 text-[10px]">Transaction Date</label>
                    <input
                        type="date"
                        max={today}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full h-14 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-sans cursor-pointer"
                    />
                </div>
            </div>

            {/* Description Input */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest ml-1 text-[10px]">Description</label>
                <input
                    type="text"
                    placeholder="What was this for?"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full h-14 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-600 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
            </div>

            <button
                type="submit"
                disabled={submitting || !amount}
                className="w-full h-14 mt-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-[0_10px_25px_-10px_rgba(79,70,229,0.4)] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 text-sm"
            >
                {submitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        <Plus className="w-5 h-5" strokeWidth={3} />
                        Confirm Entry
                    </>
                )}
            </button>
        </form>
    );

    if (isModal) return formContent;

    return (
        <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-sm border border-slate-200 dark:border-white/[0.05] p-5 sm:p-6 transition-colors">
            <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Quick Entry</h2>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Record a new transaction</p>
            </div>
            {formContent}
        </div>
    );
};

export default TransactionForm;
