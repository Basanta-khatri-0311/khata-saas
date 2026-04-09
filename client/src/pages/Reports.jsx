import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { format } from 'date-fns';

const Reports = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState('6M'); // '6M', '1Y', 'ALL'

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

    // Filter Logic
    const filteredTransactions = transactions.filter(tx => {
        if (!tx.createdAt) return false;
        const txDate = new Date(tx.createdAt);
        const today = new Date();

        if (timeFilter === '1Y') {
            return txDate.getFullYear() === today.getFullYear();
        }
        if (timeFilter === '6M') {
            const boundary = new Date(today.getFullYear(), today.getMonth() - 5, 1);
            return txDate.getTime() >= boundary.getTime();
        }
        return true; // ALL
    });

    // Calculate Comparison Pie (Overall Income vs Expense)
    const totalSales = filteredTransactions.filter(t => t.type === 'sale').reduce((a, b) => a + Number(b.amount), 0);
    const totalExpenses = filteredTransactions.filter(t => t.type === 'expense').reduce((a, b) => a + Number(b.amount), 0);

    const dataPie = [
        { name: 'Income', value: totalSales },
        { name: 'Expenses', value: totalExpenses }
    ];

    // Calculate Category Breakdown for Expenses Pie Chart
    const expenseCategories = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, tx) => {
            const cat = tx.category || 'General';
            acc[cat] = (acc[cat] || 0) + Number(tx.amount);
            return acc;
        }, {});
        
    const dataExpensePie = Object.entries(expenseCategories)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    // Calculate Category Breakdown for Income Pie Chart
    const incomeCategories = filteredTransactions
        .filter(t => t.type === 'sale')
        .reduce((acc, tx) => {
            const cat = tx.category || 'General';
            acc[cat] = (acc[cat] || 0) + Number(tx.amount);
            return acc;
        }, {});
        
    const dataIncomePie = Object.entries(incomeCategories)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    // Grouping logic for Bar Chart
    const grouped = filteredTransactions.reduce((acc, tx) => {
        const d = new Date(tx.createdAt);
        const key = timeFilter === 'ALL' ? `${d.getFullYear()}` : `${d.getFullYear()}-${d.getMonth() + 1}`; 
        const nameLabel = timeFilter === 'ALL' ? format(d, 'yyyy') : format(d, 'MMM yyyy');

        if (!acc[key]) acc[key] = { name: nameLabel, Income: 0, Expenses: 0, timestamp: new Date(d.getFullYear(), timeFilter === 'ALL' ? 0 : d.getMonth(), 1).getTime() };
        
        if (tx.type === 'sale') acc[key].Income += Number(tx.amount);
        if (tx.type === 'expense') acc[key].Expenses += Number(tx.amount);
        return acc;
    }, {});

    const dataBar = Object.values(grouped).sort((a,b) => a.timestamp - b.timestamp);

    const INC_COLORS = ['#10b981', '#059669', '#34d399', '#064e3b', '#6ee7b7'];
    const EXP_COLORS = ['#f43f5e', '#e11d48', '#fb7185', '#9f1239', '#fda4af'];

    if (loading) return (
        <div className="flex items-center justify-center h-[calc(100vh-200px)] animate-pulse">
            <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="flex flex-col gap-8 pb-10 max-w-full font-sans overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">Analytics</h1>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mt-1 font-medium italic">Monitor your financial performance metrics.</p>
                </div>

                <div className="flex bg-white dark:bg-[#0a0a0a] p-1 rounded-xl border border-slate-200 dark:border-white/[0.05] shadow-sm">
                    {[
                        { id: '6M', label: '6 Months' },
                        { id: '1Y', label: 'This Year' },
                        { id: 'ALL', label: 'All Time' },
                    ].map(f => (
                        <button
                            key={f.id}
                            onClick={() => setTimeFilter(f.id)}
                            className={`px-4 py-2 text-[10px] uppercase tracking-widest font-black rounded-lg transition-all ${timeFilter === f.id ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300'}`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20 min-w-0">
                
                {/* Historical Monthly Bar Chart */}
                <div className="md:col-span-2 lg:col-span-2 bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-sm border border-slate-200 dark:border-white/[0.05] p-6 sm:p-8 h-[450px] min-w-0 overflow-hidden">
                    <h3 className="text-sm font-black text-slate-400 dark:text-gray-500 border-b border-slate-100 dark:border-white/5 pb-4 mb-8 uppercase tracking-widest">Cash Flow Trend</h3>
                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={dataBar}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} opacity={0.15} />
                            <XAxis dataKey="name" tick={{fill: '#6b7280', fontSize: 10, fontWeight: 700}} axisLine={false} tickLine={false} />
                            <YAxis tick={{fill: '#6b7280', fontSize: 10, fontWeight: 700}} axisLine={false} tickLine={false} tickFormatter={(v) => `Rs ${v}`} />
                            <Tooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '12px'}} />
                            <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px'}} />
                            <Bar dataKey="Income" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={32} />
                            <Bar dataKey="Expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>


                {/* Income Categories */}
                <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-sm border border-slate-200 dark:border-white/[0.05] p-8 h-[450px] flex flex-col min-w-0 overflow-hidden">
                    <h3 className="text-sm font-black text-slate-400 dark:text-gray-500 border-b border-slate-100 dark:border-white/5 pb-4 mb-4 uppercase tracking-widest">Income Breakdown</h3>
                    <div className="flex-1 flex justify-center items-center">
                        {dataIncomePie.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={dataIncomePie} innerRadius={80} outerRadius={120} paddingAngle={4} dataKey="value" stroke="none">
                                        {dataIncomePie.map((_, i) => <Cell key={i} fill={INC_COLORS[i % INC_COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff'}} />
                                    <Legend iconType="circle" wrapperStyle={{fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px'}} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : <span className="text-sm font-black text-slate-400 uppercase tracking-widest">No income recorded</span>}
                    </div>
                </div>

                {/* Expense Categories */}
                <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-sm border border-slate-200 dark:border-white/[0.05] p-8 h-[450px] flex flex-col min-w-0 overflow-hidden">
                    <h3 className="text-sm font-black text-slate-400 dark:text-gray-500 border-b border-slate-100 dark:border-white/5 pb-4 mb-4 uppercase tracking-widest">Expense Distribution</h3>
                    <div className="flex-1 flex justify-center items-center">
                        {dataExpensePie.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={dataExpensePie} innerRadius={80} outerRadius={120} paddingAngle={4} dataKey="value" stroke="none">
                                        {dataExpensePie.map((_, i) => <Cell key={i} fill={EXP_COLORS[i % EXP_COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff'}} />
                                    <Legend iconType="circle" wrapperStyle={{fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px'}} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : <span className="text-sm font-black text-slate-400 uppercase tracking-widest">No expenses recorded</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
