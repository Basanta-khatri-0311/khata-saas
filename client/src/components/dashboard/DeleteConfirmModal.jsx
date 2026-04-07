import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    submitting, 
    title = "Confirm Deletion", 
    message = "Are you sure you want to permanently remove this transaction from your ledger? This action cannot be reversed.",
    confirmText = "Delete Entry"
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 font-sans">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Body */}
            <div className="relative w-full max-w-md bg-white dark:bg-[#050505] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header/Banner */}
                <div className="h-2 bg-rose-600 w-full" />
                
                <div className="p-8 flex flex-col items-center text-center">
                    {/* Icon Circle */}
                    <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center mb-6">
                        <AlertTriangle className="w-10 h-10 text-rose-600 dark:text-rose-500" strokeWidth={2.5} />
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{title}</h2>
                    <p className="text-sm font-medium text-slate-500 dark:text-gray-400 mt-3 px-4">
                        {message}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-10">
                        <button
                            onClick={onConfirm}
                            disabled={submitting}
                            className="w-full h-14 bg-rose-600 hover:bg-rose-700 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_10px_25px_-10px_rgba(225,29,72,0.4)] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {submitting ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                confirmText
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full h-14 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all active:scale-95"
                        >
                            Nevermind
                        </button>
                    </div>
                </div>

                {/* Close X */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
