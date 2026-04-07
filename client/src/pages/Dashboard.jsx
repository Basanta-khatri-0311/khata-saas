import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../services/api';

// Components
import StatsCards from '../components/dashboard/StatsCards';
import TransactionForm from '../components/dashboard/TransactionForm';
import TransactionTable from '../components/dashboard/TransactionTable';

const Dashboard = () => {
    const { searchQuery } = useOutletContext();
    const [summary, setSummary] = useState({ totalSales: 0, totalExpenses: 0, profit: 0 });
    const [transactions, setTransactions] = useState([]);
    
    // Form State
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('sale');
    const [category, setCategory] = useState('');
    const [note, setNote] = useState('');
    
    // App State
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

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
            await api.post('/transactions', { amount, type, category, note });
            setAmount('');
            setNote('');
            setCategory('');
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

    // Calculate Day Book (Today only)
    const isToday = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const todayTransactions = transactions.filter(tx => tx.createdAt && isToday(tx.createdAt));

    const todaySales = todayTransactions
        .filter(tx => tx.type === 'sale')
        .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

    const todayExpenses = todayTransactions
        .filter(tx => tx.type === 'expense')
        .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

    const todayBalance = todaySales - todayExpenses;

    const dayBookSummary = {
        totalSales: todaySales,
        totalExpenses: todayExpenses,
        profit: todayBalance
    };

    return (
        <>
            <StatsCards summary={dayBookSummary} />

            {/* Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
                
                <div className="xl:col-span-1">
                    <TransactionForm 
                        addTransaction={addTransaction}
                        submitting={submitting}
                        amount={amount}
                        setAmount={setAmount}
                        category={category}
                        setCategory={setCategory}
                        note={note}
                        setNote={setNote}
                        type={type}
                        setType={setType}
                    />
                </div>

                <div className="xl:col-span-2 flex flex-col h-full min-h-[400px]">
                    <TransactionTable 
                        transactions={todayTransactions}
                        searchQuery={searchQuery}
                        loading={loading}
                        deleteTransaction={deleteTransaction}
                    />
                </div>
            </div>
        </>
    );
};

export default Dashboard;