import React from 'react';
import { X } from 'lucide-react';
import TransactionForm from './TransactionForm';
import { useSettings } from '../../context/SettingsContext';

const translations = {
    en: {
        newEntry: 'New Entry',
        editEntry: 'Edit Entry',
        record: 'Record Transaction',
        update: 'Update Transaction'
    },
    ne: {
        newEntry: 'नयाँ प्रविष्टि',
        editEntry: 'सम्पादन गर्नुहोस्',
        record: 'कारोबार राख्नुहोस्',
        update: 'कारोबार सम्पादन गर्नुहोस्'
    }
};

const TransactionModal = ({ 
    isOpen, 
    onClose, 
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
    isEditing = false
}) => {
    const { settings } = useSettings();
    const lang = settings?.language || 'ne';
    const t = translations[lang];

    // Lock body scroll when modal is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => document.body.classList.remove('modal-open');
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6 font-sans">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Body */}
            <div className="relative w-full max-w-lg h-full sm:h-auto max-h-screen sm:max-h-[90vh] bg-white dark:bg-[#050505] sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 flex flex-col animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-5 sm:p-6 pb-2 border-b border-slate-100 dark:border-white/5 shrink-0">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                            {isEditing ? t.editEntry : t.newEntry}
                        </h2>
                        <p className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">
                            {isEditing ? t.update : t.record}
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"
                    >
                        <X className="w-6 h-6" strokeWidth={2.5} />
                    </button>
                </div>

                {/* Form Wrapper - Scrollable */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar pb-10">
                    <TransactionForm 
                        addTransaction={addTransaction}
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
                        isModal={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default TransactionModal;
