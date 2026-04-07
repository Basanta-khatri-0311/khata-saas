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

    const COLORS = ['#10b981', '#f43f5e'];
    const INC_COLORS = ['#10b981', '#059669', '#34d399', '#064e3b', '#6ee7b7'];
    const EXP_COLORS = ['#f43f5e', '#e11d48', '#fb7185', '#9f1239', '#fda4af'];

    return (
        <div className="flex flex-col gap-6 h-full min-h-[600px] mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-sans tracking-tight">Analytics & Reports</h2>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Check your historical comparisons and category distributions.</p>
                </div>

                <div className="flex bg-white dark:bg-[#0a0a0a] p-0 border border-slate-200 dark:border-white/[0.05] shadow-sm">
                    {[
                        { id: '6M', label: 'Last 6 Months' },
                        { id: '1Y', label: 'This Year' },
                        { id: 'ALL', label: 'All Time' },
                    ].map(f => (
                        <button
                            key={f.id}
                            onClick={() => setTimeFilter(f.id)}
                            className={`px-4 py-2 text-sm font-bold whitespace-nowrap transition-all ${timeFilter === f.id ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-300'}`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pb-20">
                
                {/* Historical Monthly Bar Chart */}
                <div className="md:col-span-2 lg:col-span-2 bg-white dark:bg-[#0a0a0a] rounded-[32px] shadow-sm border border-slate-200 dark:border-white/[0.05] p-6 sm:p-8 h-[450px]">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Cash Flow Trend</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={dataBar}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} opacity={0.15} />
                            <XAxis dataKey="name" tick={{fill: '#6b7280', fontSize: 11}} axisLine={false} tickLine={false} />
                            <YAxis tick={{fill: '#6b7280', fontSize: 11}} axisLine={false} tickLine={false} tickFormatter={(v) => `Rs ${v}`} />
                            <Tooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: '16px'}} />
                            <Legend verticalAlign="top" align="right" />
                            <Bar dataKey="Income" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={32} />
                            <Bar dataKey="Expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>


                {/* Income Categories */}
                <div className="bg-white dark:bg-[#0a0a0a] rounded-[32px] shadow-sm border border-slate-200 dark:border-white/[0.05] p-6 h-[400px] flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Income Sources</h3>
                    <div className="flex-1 flex justify-center items-center">
                        {dataIncomePie.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={dataIncomePie} innerRadius={60} outerRadius={105} paddingAngle={4} dataKey="value" stroke="none">
                                        {dataIncomePie.map((_, i) => <Cell key={i} fill={INC_COLORS[i % INC_COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: '16px'}} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : <span className="text-sm font-semibold text-slate-500">No income data.</span>}
                    </div>
                </div>

                {/* Expense Categories */}
                <div className="bg-white dark:bg-[#0a0a0a] rounded-[32px] shadow-sm border border-slate-200 dark:border-white/[0.05] p-6 h-[400px] flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Expense Areas</h3>
                    <div className="flex-1 flex justify-center items-center">
                        {dataExpensePie.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={dataExpensePie} innerRadius={60} outerRadius={105} paddingAngle={4} dataKey="value" stroke="none">
                                        {dataExpensePie.map((_, i) => <Cell key={i} fill={EXP_COLORS[i % EXP_COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: '16px'}} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : <span className="text-sm font-semibold text-slate-500">No expense data.</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
