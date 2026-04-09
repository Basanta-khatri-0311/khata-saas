import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import StatsCards from '../components/dashboard/StatsCards';
import TransactionTable from '../components/dashboard/TransactionTable';
import TransactionModal from '../components/dashboard/TransactionModal';
import DeleteConfirmModal from '../components/dashboard/DeleteConfirmModal';
import api from '../services/api';
import { Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { addTransactionToSync, getTransactionsToSync } from '../services/db';

const Dashboard = () => {
    const { searchQuery } = useOutletContext();
    const [summary, setSummary] = useState({ totalSales: 0, totalExpenses: 0, profit: 0 });
    const [transactions, setTransactions] = useState([]);
    
    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState(null);
    const [editingTransaction, setEditingTransaction] = useState(null);
    
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('sale');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [note, setNote] = useState('');
    
    // App State
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            await Promise.all([fetchSummary(), fetchTransactions()]);
            setLoading(false);
        };
        loadInitialData();

        const handleSyncUpdate = () => {
            fetchSummary();
            fetchTransactions();
            toast.success('Offline transactions synced successfully!');
        };
        window.addEventListener('transactions-updated', handleSyncUpdate);

        return () => window.removeEventListener('transactions-updated', handleSyncUpdate);
    }, []);

    const fetchSummary = async () => {
        try {
            const res = await api.get('/transactions/summary');
            setSummary(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchTransactions = async () => {
        try {
            let serverData = await new Promise(resolve => {
                setTransactions(prev => { resolve(prev.filter(t => !t.isOffline)); return prev; });
            });

            if (navigator.onLine) {
                try {
                    const res = await api.get('/transactions');
                    serverData = res.data;
                } catch (err) {
                    console.error('Failed to fetch from server', err);
                }
            }

            try {
                const offlineTxs = await getTransactionsToSync();
                const formattedOffline = offlineTxs.map(tx => ({
                    ...tx,
                    _id: `offline-${tx.id}`,
                    isOffline: true
                }));
                setTransactions([...formattedOffline, ...serverData]);
            } catch (err) {
                console.error("Failed to load offline txs", err);
                setTransactions(serverData);
            }
        } catch (err) { console.error(err); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = { amount, type, category, note, createdAt: date };
            
            let handledOffline = false;
            const saveOffline = async () => {
                if (editingTransaction) {
                    toast.error('Cannot edit transactions while offline');
                    throw new Error("Cannot edit offline");
                } else {
                    try {
                        const tempId = `temp-${Date.now()}`;
                        await addTransactionToSync(payload);
                        toast.success('Saved Offline. Will sync when connected 📶');
                        handledOffline = true;
                        setTransactions(prev => [{ ...payload, _id: tempId, isOffline: true }, ...prev]);
                    } catch (dbErr) {
                        console.error('IndexedDB Error:', dbErr);
                        toast.error('Offline storage failed');
                        throw dbErr;
                    }
                }
            };

            if (!navigator.onLine) {
                await saveOffline();
            } else {
                try {
                    if (editingTransaction) {
                        await api.put(`/transactions/${editingTransaction._id}`, payload);
                        toast.success('Transaction Updated ✨');
                    } else {
                        await api.post('/transactions', payload);
                        toast.success('Transaction Recorded 🚀');
                    }
                } catch (netErr) {
                    const isNetworkFailure = !netErr.response || netErr.code === 'ERR_NETWORK' || netErr.message.includes('Network Error') || netErr.message.includes('timeout');
                    if (isNetworkFailure) {
                        await saveOffline();
                    } else {
                        throw netErr;
                    }
                }
            }

            resetForm();
            if (handledOffline) {
                // Optimistically update summary state
                setSummary(prev => {
                    const numAmount = Number(payload.amount);
                    const isSale = payload.type === 'sale';
                    const newSales = isSale ? prev.totalSales + numAmount : prev.totalSales;
                    const newExpenses = !isSale ? prev.totalExpenses + numAmount : prev.totalExpenses;
                    return {
                        totalSales: newSales,
                        totalExpenses: newExpenses,
                        profit: newSales - newExpenses
                    };
                });
            } else {
                await Promise.all([fetchSummary(), fetchTransactions()]);
            }
            setIsModalOpen(false);
        } catch (err) { 
            toast.error('Failed to save changes. Please try again.');
        }
        finally { setSubmitting(false); }
    };

    const handleDelete = async () => {
        if (!transactionToDelete) return;
        setSubmitting(true);
        try {
            await api.delete(`/transactions/${transactionToDelete}`);
            toast.success('Transaction Removed 🗑️');
            await Promise.all([fetchTransactions(), fetchSummary()]);
            setIsDeleteModalOpen(false);
            setTransactionToDelete(null);
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete transaction');
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setAmount('');
        setNote('');
        setCategory('');
        setDate(new Date().toISOString().split('T')[0]);
        setType('sale');
        setEditingTransaction(null);
    };

    const openEditModal = (tx) => {
        setEditingTransaction(tx);
        setAmount(tx.amount);
        setType(tx.type);
        setCategory(tx.category);
        setDate(tx.createdAt ? new Date(tx.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
        setNote(tx.note);
        setIsModalOpen(true);
    };

    const openDeleteModal = (id) => {
        setTransactionToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const todayDateStr = new Date().toISOString().split('T')[0];

    const todaysTransactions = transactions.filter(tx => {
        const txDate = new Date(tx.createdAt).toISOString().split('T')[0];
        return txDate === todayDateStr;
    });

    if (loading) return (
        <div className="flex items-center justify-center h-[calc(100vh-200px)] animate-pulse">
            <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Overview</h1>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mt-1 font-medium italic">Today at a glance.</p>
                </div>
                
                <button 
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center justify-center gap-2 px-8 h-14 bg-black dark:bg-white text-white dark:text-black font-black rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] active:scale-95 transition-all transition-colors"
                >
                    <Plus className="w-5 h-5" strokeWidth={3} />
                    New Entry
                </button>
            </div>

            {/* Main Content Sections */}
            <div className="flex flex-col gap-10">
                <StatsCards summary={summary} />

                <div className="flex flex-col gap-4">
                    {searchQuery && (
                        <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-bold w-fit animate-in fade-in slide-in-from-left-4">
                            <Search className="w-4 h-4" />
                            Showing results for: "{searchQuery}"
                        </div>
                    )}
                    
                    <TransactionTable 
                        transactions={todaysTransactions} 
                        searchQuery={searchQuery}
                        onUpdate={fetchSummary}
                        onEdit={openEditModal}
                        onDelete={openDeleteModal}
                        title="Today's Transactions"
                    />
                </div>
            </div>

            {/* Transaction Modal */}
            <TransactionModal 
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingTransaction(null); }}
                addTransaction={handleSave}
                submitting={submitting}
                amount={amount}
                setAmount={setAmount}
                note={note}
                setNote={setNote}
                type={type}
                setType={setType}
                category={category}
                setCategory={setCategory}
                date={date}
                setDate={setDate}
                isEditing={!!editingTransaction}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setTransactionToDelete(null); }}
                onConfirm={handleDelete}
                submitting={submitting}
            />
        </div>
    );
};

export default Dashboard;