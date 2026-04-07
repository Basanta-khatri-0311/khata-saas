import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../services/api';
import TransactionTable from '../components/dashboard/TransactionTable';
import { isThisWeek, isThisMonth, isThisYear } from 'date-fns';
import { Download } from 'lucide-react';

const Transactions = () => {
    const { searchQuery } = useOutletContext();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState('all'); // all, week, month, year

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await api.get('/transactions');
            setTransactions(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const deleteTransaction = async (id) => {
        try {
            await api.delete(`/transactions/${id}`);
            fetchTransactions();
        } catch (err) { console.error(err); }
    };

    // Apply Time Filter
    const filteredTransactions = transactions.filter(tx => {
        if (timeFilter === 'all') return true;
        
        let date = new Date(tx.createdAt);
        if (timeFilter === 'week') return isThisWeek(date);
        if (timeFilter === 'month') return isThisMonth(date);
        if (timeFilter === 'year') return isThisYear(date);
        return true;
    });

    const exportToCSV = () => {
        if (filteredTransactions.length === 0) return;
        
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Date,Type,Category,Description,Amount\r\n";

        filteredTransactions.forEach(tx => {
            const date = new Date(tx.createdAt).toLocaleDateString();
            const type = tx.type === 'sale' ? 'Receipt' : 'Payment';
            const category = tx.category || 'General';
            const description = (tx.note || '').replace(/,/g, ' '); // remove commas to prevent column breaks
            const amount = tx.amount;
            
            csvContent += `${date},${type},${category},${description},${amount}\r\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `khata_ledger_${timeFilter}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col h-full min-h-[600px] gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Master Ledger</h2>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Review, export, and manage historical transactions.</p>
                </div>
                
                {/* Actions & Filters */}
                <div className="flex items-center gap-3">
                    <button 
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-slate-900 text-sm font-bold rounded-xl transition-all shadow-sm active:scale-95 whitespace-nowrap"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>

                    <div className="flex bg-white dark:bg-[#0a0a0a] p-1 rounded-xl border border-slate-200 dark:border-white/[0.05] shadow-sm overflow-x-auto custom-scrollbar">
                        {[
                            { id: 'all', label: 'All Time' },
                            { id: 'week', label: 'This Week' },
                            { id: 'month', label: 'This Month' },
                            { id: 'year', label: 'This Year' },
                        ].map(f => (
                            <button
                                key={f.id}
                                onClick={() => setTimeFilter(f.id)}
                                className={`px-4 py-2 text-sm font-bold whitespace-nowrap rounded-lg transition-all ${timeFilter === f.id ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300'}`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1">
                <TransactionTable 
                    transactions={filteredTransactions}
                    searchQuery={searchQuery}
                    loading={loading}
                    deleteTransaction={deleteTransaction}
                />
            </div>
        </div>
    );
};

export default Transactions;
