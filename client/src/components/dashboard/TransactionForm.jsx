import React, { useEffect, useState } from 'react';
import { Plus, Mic } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const translations = {
    en: {
        receipt: 'Receipt',
        payment: 'Payment',
        udharo: 'Udharo',
        settle: 'Settle',
        amount: 'Amount',
        category: 'Transaction Category',
        date: 'Transaction Date',
        description: 'Description',
        descPlaceholder: 'What was this for?',
        confirm: 'Confirm Entry',
        customerName: 'Customer Name',
        customerPhone: 'Phone Number',
        phonePlaceholder: 'Mobile/WhatsApp',
        selectDebtor: 'Select Debtor',
        chooseCustomer: '-- Choose Customer --',
        fullName: 'Full Name',
        quickEntry: 'Quick Entry',
        recordNew: 'Record a new transaction',
        recurring: 'Recurring',
        repeatEvery: 'Repeats Every',
        daily: 'Daily',
        weekly: 'Weekly',
        monthly: 'Monthly',
    },
    ne: {
        receipt: 'रसिद (आम्दानी)',
        payment: 'भुक्तानी (खर्च)',
        udharo: 'उधारो',
        settle: 'हिसाब मिलान',
        amount: 'रकम',
        category: 'कारोबारको वर्ग',
        date: 'कारोबार मिति',
        description: 'विवरण',
        descPlaceholder: 'यो केका लागि थियो?',
        confirm: 'रेकर्ड सुनिश्चित गर्नुहोस्',
        customerName: 'ग्राहकको नाम',
        customerPhone: 'फोन नम्बर',
        phonePlaceholder: 'मोबाइल/वाट्सएप',
        selectDebtor: 'ऋणी छान्नुहोस्',
        chooseCustomer: '-- ग्राहक छान्नुहोस् --',
        fullName: 'पुरा नाम',
        quickEntry: 'द्रुत प्रविष्टि',
        recordNew: 'नयाँ कारोबार रेकर्ड गर्नुहोस्',
        recurring: 'दोहोरिने',
        repeatEvery: 'दोहोर्याउने क्रम',
        daily: 'दैनिक',
        weekly: 'साप्ताहिक',
        monthly: 'मासिक',
    }
};

const TransactionForm = ({ 
    addTransaction, 
    submitting, 
    amount, 
    setAmount, 
    note, 
    setNote, 
    type, 
    setType, 
    category, 
    setCategory, 
    date, 
    setDate, 
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    debtors = [],
    isModal = false,
    recurrence,
    setRecurrence,
}) => {
    const { settings } = useSettings();
    const categories = (type === 'sale' || type === 'udharo_sale') ? (settings?.incomeCategories || []) : (settings?.expenseCategories || []);
    const lang = settings?.language || 'ne';
    const t = translations[lang];

    const today = new Date().toISOString().split('T')[0];

    const [isListening, setIsListening] = useState(false);

    const startListening = () => {
        if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
            alert('Voice recognition is not supported in this browser.');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = lang === 'ne' ? 'ne-NP' : 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (e) => {
            console.error('Speech recognition error', e);
            setIsListening(false);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            
            // Try to extract amount (first number found)
            const match = transcript.match(/\d+(\.\d+)?/);
            if (match) {
                setAmount(match[0]);
                // Remove the number and clean up
                let cleanDesc = transcript.replace(match[0], '').trim();
                // Remove common words like "rupees" or "for" from description if they lead
                cleanDesc = cleanDesc.replace(/^(rupees|for|को)\s+/i, '').trim();
                setNote(cleanDesc);
            } else {
                setNote(transcript);
            }
        };

        recognition.start();
    };

    // Auto-select first category if empty when type changes
    useEffect(() => {
        if (!category && categories.length > 0) {
            setCategory(categories[0]);
        } else if (categories.length > 0 && !categories.includes(category)) {
            setCategory(categories[0]);
        }
    }, [type, categories, category, setCategory]);

    const formContent = (
        <form onSubmit={addTransaction} className="flex flex-col gap-6">
            <div className="flex p-1 bg-slate-100 dark:bg-white/5 rounded-2xl overflow-hidden">
                <button
                    type="button"
                    onClick={() => setType('sale')}
                    className={`flex-1 py-2 text-[9px] sm:text-[10px] font-black rounded-xl transition-all uppercase tracking-tighter
                        ${type === 'sale'
                            ? 'bg-white dark:bg-white/10 text-emerald-600 dark:text-emerald-400 shadow-sm'
                            : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'
                        }`}
                >{t.receipt}</button>
                <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`flex-1 py-2 text-[9px] sm:text-[10px] font-black rounded-xl transition-all uppercase tracking-tighter
                        ${type === 'expense'
                            ? 'bg-white dark:bg-white/10 text-rose-600 dark:text-rose-400 shadow-sm'
                            : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'
                        }`}
                >{t.payment}</button>
                <button
                    type="button"
                    onClick={() => setType('udharo_sale')}
                    className={`flex-1 py-2 text-[9px] sm:text-[10px] font-black rounded-xl transition-all uppercase tracking-tighter
                        ${type === 'udharo_sale'
                            ? 'bg-white dark:bg-white/10 text-amber-600 dark:text-amber-400 shadow-sm'
                            : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'
                        }`}
                >{t.udharo}</button>
                <button
                    type="button"
                    onClick={() => setType('udharo_payment')}
                    className={`flex-1 py-2 text-[9px] sm:text-[10px] font-black rounded-xl transition-all uppercase tracking-tighter
                        ${type === 'udharo_payment'
                            ? 'bg-white dark:bg-white/10 text-cyan-600 dark:text-cyan-400 shadow-sm'
                            : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'
                        }`}
                >{t.settle}</button>
            </div>

            {/* Amount Input */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest ml-1 text-[10px]">{t.amount}</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-gray-500 font-bold">Rs.</span>
                    <input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        min="0"
                        step="0.01"
                        className="w-full h-14 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-4 text-base font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-gray-600 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-sans"
                    />
                </div>
            </div>

            {/* Customer Details for Udharo */}
            {(type === 'udharo_sale' || type === 'udharo_payment') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest ml-1">
                            {type === 'udharo_payment' ? t.selectDebtor : t.customerName}
                        </label>
                        {type === 'udharo_payment' && debtors.length > 0 ? (
                            <div className="relative">
                                <select
                                    value={customerName || ''}
                                    onChange={(e) => {
                                        const name = e.target.value;
                                        setCustomerName(name);
                                        const debtor = debtors.find(d => d.name === name);
                                        if (debtor) {
                                            setAmount(debtor.balance.toString());
                                            setCustomerPhone(debtor.phone || '');
                                        }
                                    }}
                                    required
                                    className="w-full h-12 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer pr-10"
                                >
                                    <option value="" disabled className="text-slate-400">{t.chooseCustomer}</option>
                                    {debtors.map((d, idx) => (
                                        <option key={idx} value={d.name} className="text-slate-900 bg-white dark:bg-[#0a0a0a]">{d.name} (Bal: Rs. {d.balance})</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                                </div>
                            </div>
                        ) : (
                            <input
                                type="text"
                                placeholder={t.fullName}
                                value={customerName || ''}
                                onChange={(e) => setCustomerName(e.target.value)}
                                required
                                className="w-full h-12 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-gray-600 outline-none focus:border-indigo-500 transition-all shadow-sm focus:ring-4 focus:ring-indigo-500/10"
                            />
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest ml-1">{t.customerPhone}</label>
                        <input
                            type="tel"
                            placeholder={t.phonePlaceholder}
                            value={customerPhone || ''}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="w-full h-12 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-gray-600 outline-none focus:border-indigo-500 transition-all shadow-sm focus:ring-4 focus:ring-indigo-500/10"
                        />
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-5">
                {/* Category Dropdown */}
                <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest ml-1 text-[10px]">{t.category}</label>
                    <div className="relative">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full h-14 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer pr-10"
                        >
                            {categories.map((cat, idx) => (
                                <option key={idx} value={cat} className="text-slate-900 bg-white dark:bg-[#0a0a0a]">{cat}</option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest ml-1 text-[10px]">{t.date}</label>
                    <input
                        type="date"
                        max={today}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full h-14 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-sans cursor-pointer"
                    />
                </div>
            </div>

            {/* Description Input */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest ml-1 text-[10px]">{t.description}</label>
                <div className="relative">
                    <input
                        type="text"
                        placeholder={t.descPlaceholder}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full h-14 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 pr-12 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-600 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-sans"
                    />
                    <button
                        type="button"
                        onClick={startListening}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
                            isListening 
                                ? 'bg-red-500 text-white animate-pulse' 
                                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-700 dark:hover:text-gray-200'
                        }`}
                        title="Use Voice Input"
                    >
                        <Mic className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Recurring Transaction Toggle - Only for Sales and Expenses */}
            {(type === 'sale' || type === 'expense') && (
                <div className="flex flex-col gap-3 p-4 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl mt-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-black text-slate-700 dark:text-white uppercase tracking-wider">{t.recurring}</p>
                            <p className="text-[10px] text-slate-400 dark:text-gray-500 mt-0.5">Auto-repeat this transaction</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setRecurrence && setRecurrence(recurrence === 'none' ? 'monthly' : 'none')}
                            className={`w-12 h-6 rounded-full transition-all relative ${
                                recurrence && recurrence !== 'none' ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-white/10'
                            }`}
                        >
                            <span className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                                recurrence && recurrence !== 'none' ? 'left-6' : 'left-0.5'
                            }`} />
                        </button>
                    </div>
                    {recurrence && recurrence !== 'none' && (
                        <div className="flex gap-2 animate-in fade-in duration-200">
                            {['daily', 'weekly', 'monthly'].map(r => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRecurrence && setRecurrence(r)}
                                    className={`flex-1 py-2 text-[10px] font-black rounded-xl uppercase tracking-wider transition-all ${
                                        recurrence === r
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'bg-white dark:bg-white/5 text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-white/10'
                                    }`}
                                >
                                    {t[r]}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <button
                type="submit"
                disabled={submitting || !amount}
                className="w-full h-14 mt-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-[0_10px_25px_-10px_rgba(79,70,229,0.4)] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 text-sm"
            >
                {submitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        <Plus className="w-5 h-5" strokeWidth={3} />
                        {t.confirm}
                    </>
                )}
            </button>
        </form>
    );

    if (isModal) return formContent;

    return (
        <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-sm border border-slate-200 dark:border-white/[0.05] p-5 sm:p-6 transition-colors">
            <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{t.quickEntry}</h2>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">{t.recordNew}</p>
            </div>
            {formContent}
        </div>
    );
};

export default TransactionForm;
