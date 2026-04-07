import React from 'react';
import { ReceiptText, Calendar, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import NepaliDate from 'nepali-date-converter';

const formatNPR = (val) =>
    'Rs. ' + Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const TransactionTable = ({ transactions, searchQuery, loading, deleteTransaction }) => {
    
    // Search Functionality Filter
    const filteredTransactions = transactions.filter(tx => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (tx.note && tx.note.toLowerCase().includes(query)) || 
               (tx.amount && tx.amount.toString().includes(query)) ||
               (tx.type && tx.type.toLowerCase().includes(query));
    });

    return (
        <div className="flex flex-col bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-sm border border-slate-200 dark:border-white/[0.05] overflow-hidden h-full max-h-[600px] transition-colors">
            <div className="px-5 sm:px-6 py-5 border-b border-slate-100 dark:border-white/[0.05] flex items-center justify-between sticky top-0 bg-white dark:bg-[#0a0a0a] z-10 transition-colors">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Ledger</h2>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-white/[0.05] border border-transparent dark:border-white/[0.05] px-2.5 py-1 rounded-full">
                        {filteredTransactions.length} entries
                    </span>
                </div>
            </div>

            <div className="overflow-y-auto w-full flex-1 p-2 custom-scrollbar flex flex-col relative">
                <table className="w-full border-collapse">
                    <thead className="sticky top-0 bg-white dark:bg-[#0a0a0a] z-10 transition-colors">
                        <tr>
                            {['Date', 'Details', 'Amount', ''].map((h, i) => (
                                <th
                                    key={i}
                                    className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500 border-b border-slate-100 dark:border-white/[0.05] bg-white dark:bg-[#0a0a0a] transition-colors
                                        ${h === 'Amount' ? 'text-right' : ''}
                                        ${h === '' ? 'w-10' : ''}`}
                                >{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={4} className="py-20 text-center text-slate-400 dark:text-gray-600">
                                    <div className="inline-flex gap-2 items-center">
                                        {[0, 150, 300].map(d => (
                                            <span key={d} className="w-2 h-2 rounded-full bg-slate-300 dark:bg-white/20 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        )}
                        {!loading && filteredTransactions.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-32">
                                    {/* Centered zero state using absolute/inset alignment inside table */}
                                    <div className="absolute inset-x-0 bottom-0 top-[100px] flex flex-col items-center justify-center gap-4">
                                        <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center transition-colors">
                                            <ReceiptText className="w-8 h-8 text-slate-300 dark:text-gray-600" strokeWidth={1.5} />
                                        </div>
                                        <span className="text-sm font-semibold text-slate-500 dark:text-gray-400">
                                            {searchQuery ? 'No results match your search.' : 'No transactions recorded yet.'}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {!loading && filteredTransactions.length > 0 && filteredTransactions.map((tx) => {
                            let bsDateStr = 'N/A'
                            try {
                                if (tx.createdAt) {
                                    bsDateStr = new NepaliDate(new Date(tx.createdAt)).format('YYYY-MM-DD')
                                }
                            } catch (e) {}

                            const isSale = tx.type === 'sale';

                            return (
                                <tr key={tx._id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors rounded-xl overflow-hidden">
                                    <td className="p-3 sm:p-4 whitespace-nowrap align-middle">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">{bsDateStr}</span>
                                            <span className="text-xs font-semibold text-slate-400 dark:text-gray-500 flex items-center gap-1 mt-0.5">
                                                <Calendar className="w-3 h-3 text-gray-500" /> BS
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-3 sm:p-4 align-middle">
                                        <div className="flex items-center gap-3">
                                            <div className={`hidden sm:flex w-10 h-10 rounded-full items-center justify-center shrink-0 ${isSale ? 'bg-emerald-100 dark:bg-emerald-500/10' : 'bg-rose-100 dark:bg-rose-500/10'}`}>
                                                {isSale ? <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[13px] sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                                                    {tx.note || (isSale ? 'General Receipt' : 'General Payment')}
                                                </span>
                                                <span className={`text-[11px] sm:text-xs font-semibold mt-0.5 ${isSale ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                                    {tx.category || (isSale ? 'Income' : 'Expense')}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3 sm:p-4 text-right align-middle">
                                        <span className={`text-sm sm:text-base font-bold whitespace-nowrap ${isSale ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                                            {isSale ? '+' : '-'}{formatNPR(tx.amount)}
                                        </span>
                                    </td>
                                    <td className="p-2 sm:p-4 w-10 align-middle text-right px-2 sm:px-4">
                                        <button
                                            onClick={() => deleteTransaction(tx._id)}
                                            className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 dark:text-gray-400 opacity-100 md:opacity-0 group-hover:opacity-100 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 dark:hover:border-rose-500/30 transition-all active:scale-95 shadow-sm"
                                            title="Delete entry"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionTable;
