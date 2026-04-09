import React from 'react';
import { X } from 'lucide-react';
import TransactionForm from './TransactionForm';

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
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Body */}
            <div className="relative w-full max-w-lg bg-white dark:bg-[#050505] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-2 border-b border-slate-100 dark:border-white/5">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                            {isEditing ? 'Edit Entry' : 'New Entry'}
                        </h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                            {isEditing ? 'Update Transaction' : 'Record Transaction'}
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form Wrapper */}
                <div className="p-6">
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
