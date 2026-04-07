import { useState, useEffect } from 'react';
import api from '../services/api';

// Components
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import StatsCards from '../components/dashboard/StatsCards';
import TransactionForm from '../components/dashboard/TransactionForm';
import TransactionTable from '../components/dashboard/TransactionTable';

const Dashboard = () => {
    const [summary, setSummary] = useState({ totalSales: 0, totalExpenses: 0, profit: 0 });
    const [transactions, setTransactions] = useState([]);
    
    // Form State
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('sale');
    const [note, setNote] = useState('');
    
    // App State
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Initialize Sidebar to be open on larger screens and closed on mobile automatically
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        Promise.all([fetchSummary(), fetchTransactions()]).finally(() => setLoading(false));
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

    const addTransaction = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/transactions', { amount, type, note });
            setAmount('');
            setNote('');
            await Promise.all([fetchSummary(), fetchTransactions()]);
        } catch (err) { console.error(err); }
        finally { setSubmitting(false); }
    };

    const deleteTransaction = async (id) => {
        try {
            await api.delete(`/transactions/${id}`);
            await Promise.all([fetchTransactions(), fetchSummary()]);
        } catch (err) { console.error(err); }
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] dark:bg-black text-slate-800 dark:text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden">
            
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative border-l border-transparent dark:border-white/[0.05]">
                
                <Header 
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen} 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />

                {/* Dashboard Body */}
                <div className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-6 sm:gap-8 pb-24 custom-scrollbar">

                    <StatsCards summary={summary} />

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
                        
                        <div className="xl:col-span-1">
                            <TransactionForm 
                                addTransaction={addTransaction}
                                submitting={submitting}
                                amount={amount}
                                setAmount={setAmount}
                                note={note}
                                setNote={setNote}
                                type={type}
                                setType={setType}
                            />
                        </div>

                        <div className="xl:col-span-2 flex flex-col h-full min-h-[400px]">
                            <TransactionTable 
                                transactions={transactions}
                                searchQuery={searchQuery}
                                loading={loading}
                                deleteTransaction={deleteTransaction}
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
                
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #444; }
            `}</style>
        </div>
    );
};

export default Dashboard;