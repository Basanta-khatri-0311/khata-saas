import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { MessageSquare, Phone, User as UserIcon, TrendingUp, Filter, Search, MoreVertical, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '../context/SettingsContext';

const translations = {
    en: {
        title: 'Udharo Vault',
        subtitle: 'Track credit sales and pending payments.',
        searchPlaceholder: 'Search customers...',
        totalOutstanding: 'Total Outstanding',
        totalDebtors: 'Total Debtors',
        customers: 'Customers',
        activeCredits: 'Active Credits',
        noUdharo: 'No pending Udharo found',
        lastActivity: 'Last Activity',
        pending: 'Pending',
        noPhone: 'No phone saved',
        openingWA: 'Opening WhatsApp...',
        copied: 'Message copied to clipboard! (No phone number saved)'
    },
    ne: {
        title: 'उधारो ढुकुटी',
        subtitle: 'बाँकी उधारो र भुक्तानीहरू ट्र्याक गर्नुहोस्।',
        searchPlaceholder: 'ग्राहक खोज्नुहोस्...',
        totalOutstanding: 'कुल उठ्न बाँकी',
        totalDebtors: 'कुल उधारो लिनेहरू',
        customers: 'ग्राहकहरू',
        activeCredits: 'सक्रिय उधारोहरू',
        noUdharo: 'कुनै बाँकी उधारो भेटिएन',
        lastActivity: 'पछिल्लो कारोबार',
        pending: 'बाँकी',
        noPhone: 'फोन नम्बर छैन',
        openingWA: 'व्हाट्सएप खोल्दै...',
        copied: 'सन्देश क्लिपबोर्डमा प्रतिलिपि गरियो! (फोन नम्बर छैन)'
    }
};

const Udharo = () => {
    const { settings } = useSettings();
    const lang = settings?.language || 'ne';
    const t = translations[lang];

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
        } finally {
            setLoading(false);
        }
    };

    const customerBalances = transactions.reduce((acc, tx) => {
        if (!tx.customerName) return acc;
        if (!acc[tx.customerName]) {
            acc[tx.customerName] = { 
                name: tx.customerName, 
                balance: 0, 
                phone: tx.customerPhone || '',
                lastTransaction: tx.createdAt
            };
        }
        if (tx.type === 'udharo_sale') acc[tx.customerName].balance += tx.amount;
        else if (tx.type === 'udharo_payment') acc[tx.customerName].balance -= tx.amount;
        
        // Track latest transaction date
        if (new Date(tx.createdAt) > new Date(acc[tx.customerName].lastTransaction)) {
            acc[tx.customerName].lastTransaction = tx.createdAt;
        }
        
        return acc;
    }, {});

    const handleWhatsApp = (customer) => {
        const businessName = settings?.businessName || 'Khata';
        const businessPhone = settings?.businessPhone ? `\n\nContact: ${settings.businessPhone}` : '';
        
        const message = lang === 'ne' 
            ? `नमस्ते ${customer.name},\n\nहाम्रो ${businessName} को रेकर्ड अनुसार तपाईंको Rs. ${customer.balance.toLocaleString()} भुक्तानी गर्न बाँकी देखिन्छ। कृपया यथाशीघ्र भुक्तानी गरिदिनुहोला। धन्यवाद!${businessPhone}`
            : `Namaste ${customer.name},\n\nYou have a pending balance of Rs. ${customer.balance.toLocaleString()} in our ${businessName} records. Please settle it at your earliest convenience. Thank you!${businessPhone}`;
        
        if (customer.phone) {
            const whatsappUrl = `https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            toast.success(t.openingWA);
        } else {
            navigator.clipboard.writeText(message);
            toast.success(t.copied);
        }
    };

    const customers = Object.values(customerBalances)
        .filter(c => c.balance > 0)
        .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => b.balance - a.balance);

    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">{t.title}</h1>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mt-1 font-medium">{t.subtitle}</p>
                </div>

                <div className="relative group max-w-sm w-full lg:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl pl-11 pr-4 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-amber-50 dark:bg-amber-500/5 p-6 rounded-3xl border border-amber-100 dark:border-amber-500/10 shadow-sm overflow-hidden relative group">
                     <div className="flex flex-col gap-1 relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-600/60 dark:text-amber-400/50">{t.totalOutstanding}</span>
                        <div className="flex items-baseline gap-2">
                             <span className="text-2xl font-black text-amber-600 dark:text-amber-400">Rs. {Object.values(customerBalances).reduce((sum, c) => sum + (c.balance > 0 ? c.balance : 0), 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-indigo-50 dark:bg-indigo-500/5 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-500/10 shadow-sm overflow-hidden relative group">
                     <div className="flex flex-col gap-1 relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600/60 dark:text-indigo-400/50">{t.totalDebtors}</span>
                        <div className="flex items-baseline gap-2">
                             <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{Object.values(customerBalances).filter(c => c.balance > 0).length} {t.customers}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-sm border border-slate-200 dark:border-white/[0.05] overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-white/[0.05]">
                    <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">{t.activeCredits}</h2>
                </div>

                <div className="flex flex-col divide-y divide-slate-50 dark:divide-white/[0.02]">
                    {customers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center">
                                <UserIcon className="w-8 h-8 text-slate-300 dark:text-gray-600" />
                            </div>
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.noUdharo}</span>
                        </div>
                    ) : (
                        customers.map((c, idx) => (
                            <div key={idx} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:group-hover:bg-indigo-500/10 dark:group-hover:text-indigo-400 transition-all">
                                        <UserIcon className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-base font-bold text-slate-900 dark:text-white">{c.name}</span>
                                        <span className="text-xs font-bold text-slate-500 dark:text-gray-500 flex items-center gap-1">
                                            <Phone className="w-3 h-3" /> {c.phone || t.noPhone}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 lg:gap-8">
                                    <div className="hidden sm:flex flex-col items-end">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.lastActivity}</span>
                                        <span className="text-xs font-bold text-slate-600 dark:text-gray-400">
                                            {new Date(c.lastTransaction).toLocaleDateString()}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{t.pending}</span>
                                        <span className="text-lg font-black text-slate-900 dark:text-white">Rs. {c.balance.toLocaleString()}</span>
                                    </div>

                                    <button 
                                        onClick={() => handleWhatsApp(c)}
                                        className="p-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-600 dark:text-gray-400 hover:bg-green-500 hover:text-white dark:hover:bg-green-500 dark:hover:text-white transition-all active:scale-95"
                                    >
                                        <MessageSquare className="w-5 h-5" />
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
