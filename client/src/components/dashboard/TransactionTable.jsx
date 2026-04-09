import React from 'react';
import { ReceiptText, Calendar, TrendingUp, TrendingDown, Trash2, User as UserIcon } from 'lucide-react';
const formatNPR = (val) =>
    'Rs. ' + Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const TransactionTable = ({ transactions, searchQuery, loading, onDelete, onEdit, title = "Recent Ledger" }) => {
    
    // Search Functionality Filter
    const filteredTransactions = transactions.filter(tx => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (tx.note && tx.note.toLowerCase().includes(query)) || 
               (tx.amount && tx.amount.toString().includes(query)) ||
               (tx.type && tx.type.toLowerCase().includes(query));
    });

    return (
        <div className="flex flex-col bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-sm border border-slate-200 dark:border-white/[0.05] overflow-hidden h-full max-h-[600px] transition-colors">
            <div className="px-5 sm:px-6 py-5 border-b border-slate-100 dark:border-white/[0.05] flex items-center justify-between sticky top-0 bg-white dark:bg-[#0a0a0a] z-10 transition-colors">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">{title}</h2>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-white/[0.05] border border-transparent dark:border-white/[0.05] px-2.5 py-1 rounded-full">
                        {filteredTransactions.length} entries
                    </span>
                </div>
            </div>

            <div className="overflow-x-auto overflow-y-auto w-full flex-1 p-0 sm:p-2 custom-scrollbar flex flex-col relative">
                <table className="w-full border-collapse min-w-[500px] sm:min-w-0">
                    <thead className="sticky top-0 bg-white dark:bg-[#0a0a0a] z-10 transition-colors">
                        <tr>
                            {['Date', 'Details', 'Amount', ''].map((h, i) => (
                                <th
                                    key={i}
                                    className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500 border-b border-slate-100 dark:border-white/[0.05] bg-white dark:bg-[#0a0a0a] transition-colors
                                        ${h === 'Date' || h === 'Details' || h === 'Amount' ? 'w-[30%] sm:w-[32%]' : 'w-20'}
                                        ${h === 'Amount' ? 'text-right' : ''}`}
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
                            const displayDate = tx.createdAt 
                                ? new Date(tx.createdAt).toLocaleDateString() 
                                : 'N/A';

                            const isSale = tx.type === 'sale';

                            return (
                                <tr key={tx._id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors rounded-xl overflow-hidden">
                                    <td className="p-3 sm:p-4 whitespace-nowrap align-middle">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">{displayDate}</span>
                                            <span className="text-xs font-semibold text-slate-400 dark:text-gray-500 flex items-center gap-1 mt-0.5">
                                                <Calendar className="w-3 h-3 text-gray-500" />
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
                                                    {(tx.type === 'udharo_sale' || tx.type === 'udharo_payment') && tx.customerName ? (
                                                        <span className="flex items-center gap-1.5">
                                                            <UserIcon className="w-3.5 h-3.5 text-indigo-500" />
                                                            {tx.customerName}
                                                        </span>
                                                    ) : (
                                                        tx.note || (isSale ? 'General Receipt' : 'General Payment')
                                                    )}
                                                </span>
                                                <span className={`text-[11px] sm:text-xs font-semibold mt-0.5 ${tx.type === 'udharo_sale' ? 'text-amber-500' : tx.type === 'udharo_payment' ? 'text-cyan-500' : isSale ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                                    {tx.type === 'udharo_sale' ? 'Udharo (Owed)' : tx.type === 'udharo_payment' ? 'Udharo Settlement' : tx.category || (isSale ? 'Income' : 'Expense')}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3 sm:p-4 text-right align-middle">
                                        <span className={`text-sm sm:text-base font-bold whitespace-nowrap ${isSale ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                                            {isSale ? '+' : '-'}{formatNPR(tx.amount)}
                                        </span>
                                    </td>
                                    <td className="p-2 sm:p-4 w-24 align-middle text-right px-2 sm:px-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(tx)}
                                                className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 dark:text-gray-400 opacity-100 md:opacity-0 group-hover:opacity-100 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95 shadow-sm"
                                                title="Edit entry"
                                            >
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                            </button>
                                            <button
                                                onClick={() => onDelete(tx._id)}
                                                className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 dark:text-gray-400 opacity-100 md:opacity-0 group-hover:opacity-100 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 dark:hover:border-rose-500/30 transition-all active:scale-95 shadow-sm"
                                                title="Delete entry"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
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
