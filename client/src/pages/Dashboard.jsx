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
import { useSettings } from '../context/SettingsContext';

const translations = {
    en: {
        overview: 'Overview',
        todayAtGlance: 'Today at a glance.',
        newEntry: 'New Entry',
        todayTransactions: "Today's Ledger",
        offlineSyncSuccess: 'Offline transactions synced successfully!',
        offlineEditError: 'Cannot edit transactions while offline',
        offlineSaveSuccess: 'Saved Offline. Will sync when connected 📶',
        onlineSaveSuccess: 'Transaction Recorded 🚀',
        onlineUpdateSuccess: 'Transaction Updated ✨',
        showingResults: 'Showing results for:',
        recordRemoved: 'Transaction Removed 🗑️',
        editError: 'Failed to delete transaction'
    },
    ne: {
        overview: 'विवरण (Overview)',
        todayAtGlance: 'आजको कारोबार एक नजरमा।',
        newEntry: 'नयाँ प्रविष्टि',
        todayTransactions: 'आजको आर्थिक खाता',
        offlineSyncSuccess: 'अफलाइन कारोबारहरू सफलतापूर्वक सिंक गरियो!',
        offlineEditError: 'अफलाइन हुँदा सम्पादन गर्न मिल्दैन',
        offlineSaveSuccess: 'अफलाइन सुरक्षित गरियो। नेट जोडिएपछि सिंक हुनेछ 📶',
        onlineSaveSuccess: 'कारोबार रेकर्ड गरियो 🚀',
        onlineUpdateSuccess: 'कारोबार सम्पादन गरियो ✨',
        showingResults: 'खोजिएका नतिजाहरू:',
        recordRemoved: 'कारोबार हटाइयो 🗑️',
        editError: 'कारोबार हटाउन असफल भयो'
    }
};

const Dashboard = () => {
    const { settings } = useSettings();
    const lang = settings?.language || 'ne';
    const t = translations[lang];
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
    const [note, setNote] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');

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

    // Sync date state when settings load
    useEffect(() => {
        if (settings && !editingTransaction && !isModalOpen) {
            setDate(new Date().toISOString().split('T')[0]);
        }
    }, [settings, isModalOpen, editingTransaction]);

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
            const payload = { amount, type, category, note, createdAt: date, customerName, customerPhone };

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
                    const isUdharo = payload.type === 'udharo_sale';

                    const newSales = isSale ? prev.totalSales + numAmount : prev.totalSales;
                    const newExpenses = (payload.type === 'expense') ? prev.totalExpenses + numAmount : prev.totalExpenses;
                    const newUdharo = isUdharo ? (prev.totalUdharo || 0) + numAmount : (prev.totalUdharo || 0);

                    return {
                        totalSales: newSales,
                        totalExpenses: newExpenses,
                        totalUdharo: newUdharo,
                        profit: newSales - newExpenses
                    };
                });
            } else {
                await Promise.all([fetchSummary(), fetchTransactions()]);
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error('SAVE FAILURE:', err);
            toast.error(err?.response?.data?.error || 'Failed to save changes. Please try again.');
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
            toast.error(t.editError);
        } finally {
            setSubmitting(false);
        }
    };

    const debtors = Object.values(transactions.reduce((acc, tx) => {
        if (!tx.customerName) return acc;
        if (!acc[tx.customerName]) acc[tx.customerName] = { name: tx.customerName, balance: 0, phone: tx.customerPhone || '' };
        if (tx.type === 'udharo_sale') acc[tx.customerName].balance += tx.amount;
        else if (tx.type === 'udharo_payment') acc[tx.customerName].balance -= tx.amount;
        return acc;
    }, {})).filter(d => d.balance > 0);

    const resetForm = () => {
        setAmount('');
        setNote('');
        setCategory('');
        setDate(new Date().toISOString().split('T')[0]);
        setType('sale');
        setCustomerName('');
        setCustomerPhone('');
        setEditingTransaction(null);
    };

    const openEditModal = (tx) => {
        setEditingTransaction(tx);
        setAmount(tx.amount);
        setType(tx.type);
        setCategory(tx.category);
        setDate(tx.createdAt ? new Date(tx.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
        setNote(tx.note);
        setCustomerName(tx.customerName || '');
        setCustomerPhone(tx.customerPhone || '');
        setIsModalOpen(true);
    };

    const openDeleteModal = (id) => {
        setTransactionToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const todayAD = new Date().toISOString().split('T')[0];

    const todaysTransactions = transactions.filter(tx => {
        if (!tx.createdAt) return false;
        const txDateAD = new Date(tx.createdAt).toISOString().split('T')[0];
        return txDateAD === todayAD;
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
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{t.overview}</h1>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mt-1 font-medium italic">{t.todayAtGlance}</p>
                </div>

                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center justify-center gap-2 px-8 h-14 bg-black dark:bg-white text-white dark:text-black font-black rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] active:scale-95 transition-all transition-colors"
                >
                    <Plus className="w-5 h-5" strokeWidth={3} />
                    {t.newEntry}
                </button>
            </div>

            {/* Main Content Sections */}
            <div className="flex flex-col gap-10">
                <StatsCards summary={summary} />

                <div className="flex flex-col gap-4">
                    {searchQuery && (
                        <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-bold w-fit animate-in fade-in slide-in-from-left-4">
                            <Search className="w-4 h-4" />
                            {t.showingResults} "{searchQuery}"
                        </div>
                    )}

                    <TransactionTable
                        transactions={todaysTransactions}
                        searchQuery={searchQuery}
                        onUpdate={fetchSummary}
                        onEdit={openEditModal}
                        onDelete={openDeleteModal}
                        title={t.todayTransactions}
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
                customerName={customerName}
                setCustomerName={setCustomerName}
                customerPhone={customerPhone}
                setCustomerPhone={setCustomerPhone}
                debtors={debtors}
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