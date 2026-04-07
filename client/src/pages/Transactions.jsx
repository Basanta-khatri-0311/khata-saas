import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../services/api';
import TransactionTable from '../components/dashboard/TransactionTable';
import { isThisWeek, isThisMonth, isThisYear } from 'date-fns';

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

    return (
        <div className="flex flex-col h-full min-h-[600px] gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Master Ledger</h2>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Review and manage all historical transactions.</p>
                </div>
                
                {/* Filters */}
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
