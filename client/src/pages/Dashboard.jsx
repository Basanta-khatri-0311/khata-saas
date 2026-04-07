import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import StatsCards from '../components/dashboard/StatsCards';
import TransactionTable from '../components/dashboard/TransactionTable';
import TransactionModal from '../components/dashboard/TransactionModal';
import api from '../services/api';
import { Plus, Search } from 'lucide-react';

const Dashboard = () => {
    const { searchQuery } = useOutletContext();
    const [summary, setSummary] = useState({ totalSales: 0, totalExpenses: 0, profit: 0 });
    const [transactions, setTransactions] = useState([]);

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
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
    }, []);

    const fetchSummary = async () => {
        try {
            const res = await api.get('/transactions/summary');
            setSummary(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchTransactions = async () => {
        try {
            const res = await api.get('/transactions');
            setTransactions(res.data);
        } catch (err) { console.error(err); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = { amount, type, category, note, createdAt: date };

            if (editingTransaction) {
                await api.put(`/transactions/${editingTransaction._id}`, payload);
            } else {
                await api.post('/transactions', payload);
            }

            resetForm();
            await Promise.all([fetchSummary(), fetchTransactions()]);
            setIsModalOpen(false);
        } catch (err) { console.error(err); }
        finally { setSubmitting(false); }
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

    const filteredTransactions = transactions.filter(tx => {
        const search = searchQuery?.toLowerCase() || "";
        return (
            (tx.note?.toLowerCase().includes(search)) ||
            (tx.category?.toLowerCase().includes(search)) ||
            (tx.amount.toString().includes(search))
        );
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
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Overview</h1>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mt-1 font-medium italic">Your financial status at a glance.</p>
                </div>

                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center justify-center gap-2 px-8 h-14 bg-black dark:bg-white text-white dark:text-black font-black rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] active:scale-95 transition-all"
                >
                    <Plus className="w-5 h-5" strokeWidth={3} />
                    New Entry
                </button>
            </div>

            {/* Main Content Sections */}
            <div className="flex flex-col gap-10">
                <StatsCards summary={summary} />

                <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-sm border border-slate-200 dark:border-white/[0.05] overflow-hidden flex flex-col min-h-[500px]">


                    {searchQuery && (
                        <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-bold animate-in fade-in slide-in-from-right-4">
                            <Search className="w-4 h-4" />
                            "{searchQuery}"
                        </div>
                    )}


                    <div className="flex-1 overflow-x-auto">
                        <TransactionTable
                            transactions={filteredTransactions}
                            onDelete={fetchTransactions}
                            onUpdate={fetchSummary}
                            onEdit={openEditModal}
                        />
                    </div>
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
        </div>
    );
};

export default Dashboard;