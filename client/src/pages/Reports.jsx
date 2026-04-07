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

    // Calculate Overall totals for Pie Chart (Dynamic based on filter)
    const totalSales = filteredTransactions.filter(t => t.type === 'sale').reduce((a, b) => a + Number(b.amount), 0);
    const totalExpenses = filteredTransactions.filter(t => t.type === 'expense').reduce((a, b) => a + Number(b.amount), 0);

    const dataPie = [
        { name: 'Income', value: totalSales },
        { name: 'Expenses', value: totalExpenses }
    ];

    // Group dynamically explicitly by format for the Bar Chart
    const grouped = filteredTransactions.reduce((acc, tx) => {
        const d = new Date(tx.createdAt);
        
        // If "ALL" time and spans multiple years, we might just want to group by year. 
        // For now, Month-Year is universally detailed and Recharts gracefully handles large data bounds.
        const key = timeFilter === 'ALL' ? `${d.getFullYear()}` : `${d.getFullYear()}-${d.getMonth() + 1}`; 
        const nameLabel = timeFilter === 'ALL' ? format(d, 'yyyy') : format(d, 'MMM yyyy');

        if (!acc[key]) acc[key] = { name: nameLabel, Income: 0, Expenses: 0, timestamp: new Date(d.getFullYear(), timeFilter === 'ALL' ? 0 : d.getMonth(), 1).getTime() };
        
        if (tx.type === 'sale') acc[key].Income += Number(tx.amount);
        if (tx.type === 'expense') acc[key].Expenses += Number(tx.amount);
        return acc;
    }, {});

    // Sort chronologically
    const dataBar = Object.values(grouped).sort((a,b) => a.timestamp - b.timestamp);

    const COLORS = ['#10b981', '#f43f5e'];

    return (
        <div className="flex flex-col gap-6 h-full min-h-[600px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics & Reports</h2>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Check your historical comparisons and cash flow breakdown.</p>
                </div>

                {/* Filters */}
                <div className="flex bg-white dark:bg-[#0a0a0a] p-1 rounded-xl border border-slate-200 dark:border-white/[0.05] shadow-sm">
                    {[
                        { id: '6M', label: 'Last 6 Months' },
                        { id: '1Y', label: 'This Year' },
                        { id: 'ALL', label: 'All Time' },
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
                
                {/* Historical Monthly Bar Chart */}
                <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-sm border border-slate-200 dark:border-white/[0.05] p-6 h-[400px]">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                        Cash Flow Trend {timeFilter === '6M' ? '(Last 6 Months)' : timeFilter === '1Y' ? '(This Year)' : '(All Time Yearly History)'}
                    </h3>
                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={dataBar} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} opacity={0.2} />
                            <XAxis dataKey="name" tick={{fill: '#6b7280', fontSize: 12}} axisLine={false} tickLine={false} />
                            <YAxis tick={{fill: '#6b7280', fontSize: 12}} axisLine={false} tickLine={false} width={60} tickFormatter={(value) => `Rs ${value}`} />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff'}} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            <Bar dataKey="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Overall Income vs Expense */}
                <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-sm border border-slate-200 dark:border-white/[0.05] p-6 h-[400px] flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                        Income vs Expense Ratio {timeFilter === '6M' ? '(Last 6 Months)' : timeFilter === '1Y' ? '(This Year)' : '(All Time)'}
                    </h3>
                    <div className="flex-1 flex justify-center items-center">
                        {totalSales === 0 && totalExpenses === 0 ? (
                            <span className="text-sm font-semibold text-slate-500">No data available for this period.</span>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={dataPie} innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                                        {dataPie.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff'}} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
