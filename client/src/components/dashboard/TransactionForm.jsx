import React from 'react';
import { Plus } from 'lucide-react';

const TransactionForm = ({ addTransaction, submitting, amount, setAmount, note, setNote, type, setType }) => {
    return (
        <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-sm border border-slate-200 dark:border-white/[0.05] p-5 sm:p-6 transition-colors">
            <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Quick Entry</h2>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Record a new transaction</p>
            </div>
            
            <form onSubmit={addTransaction} className="flex flex-col gap-5">
                {/* Type Toggle */}
                <div className="flex p-1 bg-slate-100 dark:bg-white/5 rounded-xl">
                    <button
                        type="button"
                        onClick={() => setType('sale')}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all
                            ${type === 'sale'
                                ? 'bg-white dark:bg-white/10 text-emerald-600 dark:text-emerald-400 shadow-sm'
                                : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'
                            }`}
                    >Receipt</button>
                    <button
                        type="button"
                        onClick={() => setType('expense')}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all
                            ${type === 'expense'
                                ? 'bg-white dark:bg-white/10 text-rose-600 dark:text-rose-400 shadow-sm'
                                : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'
                            }`}
                    >Payment</button>
                </div>

                {/* Amount Input */}
                <div className="flex flex-col gap-1.5 mt-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-wider">Amount</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-gray-500 font-bold">Rs.</span>
                        <input
                            id="amount-input"
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            min="0"
                            step="0.01"
                            className="w-full h-12 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-12 pr-4 text-base font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-gray-600 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                        />
                    </div>
                </div>

                {/* Description Input */}
                <div className="flex flex-col gap-1.5 mt-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-wider">Description</label>
                    <input
                        type="text"
                        placeholder="What was this for?"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full h-12 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-600 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting || !amount}
                    className="w-full h-12 mt-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {submitting ? 'Saving...' : (
                        <>
                            <Plus className="w-5 h-5" />
                            Save Transaction
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default TransactionForm;
