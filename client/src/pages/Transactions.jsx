import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../services/api';
import TransactionTable from '../components/dashboard/TransactionTable';
import TransactionModal from '../components/dashboard/TransactionModal';
import DeleteConfirmModal from '../components/dashboard/DeleteConfirmModal';
import { isThisWeek, isThisMonth, isThisYear } from 'date-fns';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';

const Transactions = () => {
    const { searchQuery } = useOutletContext();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [timeFilter, setTimeFilter] = useState('all');

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState(null);
    const [editingTransaction, setEditingTransaction] = useState(null);
    
    // Form field states
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('sale');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [note, setNote] = useState('');

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

    const handleSave = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = { amount, type, category, note, createdAt: date };
            
            if (editingTransaction) {
                await api.put(`/transactions/${editingTransaction._id}`, payload);
                toast.success('Transaction Updated ✨');
            } else {
                await api.post('/transactions', payload);
                toast.success('Transaction Recorded 🚀');
            }
            
            resetForm();
            await fetchTransactions();
            setIsModalOpen(false);
        } catch (err) { 
            console.error(err); 
            toast.error('Failed to save changes');
        }
        finally { setSubmitting(false); }
    };

    const handleDelete = async () => {
        if (!transactionToDelete) return;
        setSubmitting(true);
        try {
            await api.delete(`/transactions/${transactionToDelete}`);
            toast.success('Transaction Removed 🗑️');
            await fetchTransactions();
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
            csvContent += `${date},${type},${tx.category || 'General'},${(tx.note || '').replace(/,/g, ' ')},${tx.amount}\r\n`;
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
        <div className="flex flex-col h-full min-h-[600px] gap-8 pb-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Master Ledger</h1>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mt-1 font-medium italic">Your complete financial history.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                    <button 
                        onClick={exportToCSV}
                        className="flex items-center gap-2 h-12 px-6 bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-sm active:scale-95 transition-colors"
                    >
                        <Download className="w-4 h-4" strokeWidth={3} />
                        Export Data
                    </button>

                    <div className="flex bg-white dark:bg-[#0a0a0a] p-1 rounded-xl border border-slate-200 dark:border-white/[0.05] shadow-sm">
                        {['all', 'week', 'month', 'year'].map(f => (
                            <button
                                key={f}
                                onClick={() => setTimeFilter(f)}
                                className={`px-4 py-2 text-[10px] uppercase tracking-widest font-black rounded-lg transition-all ${timeFilter === f ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-sm border border-slate-200 dark:border-white/[0.05] overflow-hidden">
                <TransactionTable 
                    transactions={filteredTransactions}
                    searchQuery={searchQuery}
                    loading={loading}
                    onDelete={openDeleteModal}
                    onEdit={openEditModal}
                    title="All Ledger"
                />
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

export default Transactions;
