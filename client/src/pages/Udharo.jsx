import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { MessageSquare, Phone, User as UserIcon, TrendingUp, Filter, Search, MoreVertical, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '../context/SettingsContext';

const Udharo = () => {
    const { settings } = useSettings();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await api.get('/transactions');
            setTransactions(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load Udharo data");
        } finally {
            setLoading(false);
        }
    };

    // Calculate balances
    const customerBalances = transactions.reduce((acc, tx) => {
        if (!tx.customerName) return acc;
        
        const name = tx.customerName;
        if (!acc[name]) {
            acc[name] = { 
                name, 
                phone: tx.customerPhone || '', 
                balance: 0, 
                lastTransaction: tx.createdAt,
                count: 0
            };
        }

        if (tx.type === 'udharo_sale') {
            acc[name].balance += tx.amount;
            acc[name].count += 1;
        } else if (tx.type === 'udharo_payment') {
            acc[name].balance -= tx.amount;
        }

        if (new Date(tx.createdAt) > new Date(acc[name].lastTransaction)) {
            acc[name].lastTransaction = tx.createdAt;
        }

        return acc;
    }, {});

    const customers = Object.values(customerBalances)
        .filter(c => c.balance > 0) // Only show those with pending balance
        .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery));

    const sendNotice = (customer) => {
        const businessName = settings?.businessName || 'Khata';
        const businessPhone = settings?.businessPhone ? `\n\nContact: ${settings.businessPhone}` : '';
        
        const message = `Namaste ${customer.name},\n\nYou have a pending balance of Rs. ${customer.balance.toLocaleString()} in our ${businessName} records. Please settle it at your earliest convenience. Thank you!${businessPhone}`;
        
        if (customer.phone) {
            const whatsappUrl = `https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            toast.success('Opening WhatsApp...');
        } else {
            // Fallback to clipboard if no phone
            navigator.clipboard.writeText(message);
            toast.success('Message copied to clipboard! (No phone number saved)');
        }
    };

    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">Udharo Vault</h1>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mt-1 font-medium">Track credit sales and pending payments.</p>
                </div>

                <div className="relative group max-w-sm w-full lg:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                        type="text"
                        placeholder="Search customers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl pl-11 pr-4 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Stats Cards for Udharo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-amber-50 dark:bg-amber-500/5 p-6 rounded-3xl border border-amber-100 dark:border-amber-500/10 shadow-sm overflow-hidden relative group">
                     <div className="flex flex-col gap-1 relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-600/60 dark:text-amber-400/50">Total Outstanding</span>
                        <div className="flex items-baseline gap-2">
                             <span className="text-2xl font-black text-amber-600 dark:text-amber-400">Rs. {Object.values(customerBalances).reduce((sum, c) => sum + (c.balance > 0 ? c.balance : 0), 0).toLocaleString()}</span>
                        </div>
                    </div>
                    <TrendingUp className="absolute -right-4 -bottom-4 w-24 h-24 text-amber-200/30 dark:text-amber-400/5 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                </div>
                
                <div className="bg-indigo-50 dark:bg-indigo-500/5 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-500/10 shadow-sm overflow-hidden relative group">
                     <div className="flex flex-col gap-1 relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600/60 dark:text-indigo-400/50">Total Debtors</span>
                        <div className="flex items-baseline gap-2">
                             <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{Object.values(customerBalances).filter(c => c.balance > 0).length} Customers</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-sm border border-slate-200 dark:border-white/[0.05] overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-white/[0.05]">
                    <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Active Credits</h2>
                </div>

                <div className="flex flex-col divide-y divide-slate-50 dark:divide-white/[0.02]">
                    {loading ? (
                        <div className="py-20 flex justify-center">
                            <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                        </div>
                    ) : customers.length === 0 ? (
                        <div className="py-32 flex flex-col items-center justify-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center">
                                <UserIcon className="w-8 h-8 text-slate-300 dark:text-gray-600" />
                            </div>
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">No pending Udharo found</span>
                        </div>
                    ) : (
                        customers.map((c, idx) => (
                            <div key={idx} className="p-4 sm:p-6 hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-lg shadow-sm group-hover:scale-110 transition-transform">
                                        {c.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-base font-bold text-slate-900 dark:text-white">{c.name}</span>
                                        <span className="text-xs font-bold text-slate-500 dark:text-gray-500 flex items-center gap-1">
                                            <Phone className="w-3 h-3" /> {c.phone || 'No phone saved'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 lg:gap-8">
                                    <div className="hidden sm:flex flex-col items-end">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Activity</span>
                                        <span className="text-xs font-bold text-slate-600 dark:text-gray-400">{new Date(c.lastTransaction).toLocaleDateString()}</span>
                                    </div>
                                    
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Pending</span>
                                        <span className="text-lg font-black text-slate-900 dark:text-white">Rs. {c.balance.toLocaleString()}</span>
                                    </div>

                                    <button 
                                        onClick={() => sendNotice(c)}
                                        className="h-10 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] flex items-center gap-2 transition-all active:scale-95 text-xs font-black uppercase tracking-widest"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        Notice
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Udharo;
