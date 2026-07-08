import React, { useState } from 'react';
import { Package, X, Check, SkipForward } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AddInventoryPromptModal = ({ isOpen, onClose, items = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    // Initial state for the currently displayed item
    const currentItem = items[currentIndex];
    
    const [form, setForm] = useState({
        sellingPrice: currentItem?.unitPrice || '',
        costPrice: '',
        stockQuantity: 0,
        unit: 'pcs',
        lowStockThreshold: 5
    });

    // Reset form when moving to next item
    React.useEffect(() => {
        if (currentItem) {
            setForm({
                sellingPrice: currentItem.unitPrice || '',
                costPrice: '',
                stockQuantity: 0,
                unit: 'pcs',
                lowStockThreshold: 5
            });
        }
    }, [currentItem]);

    if (!isOpen || !currentItem) return null;

    const handleNext = () => {
        if (currentIndex < items.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onClose();
        }
    };

    const handleSave = async () => {
        setSubmitting(true);
        try {
            await api.post('/inventory', {
                name: currentItem.itemName,
                sellingPrice: Number(form.sellingPrice),
                costPrice: Number(form.costPrice) || 0,
                stockQuantity: Number(form.stockQuantity) || 0,
                lowStockThreshold: Number(form.lowStockThreshold) || 5,
                unit: form.unit
            });
            toast.success(`${currentItem.itemName} added to Inventory!`);
            handleNext();
        } catch (err) {
            toast.error(err?.response?.data?.error || 'Failed to save item to inventory');
        } finally {
            setSubmitting(false);
        }
    };

    const field = (label, key, type = 'text', extra = {}) => (
        <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest">{label}</label>
            <input
                type={type}
                value={form[key]}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                className="h-11 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-all"
                {...extra}
            />
        </div>
    );

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 font-sans">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-sm bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 animate-in fade-in zoom-in duration-300 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-white/5 flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                            Save to Inventory?
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                            "{currentItem.itemName}" was used in your transaction but isn't in your inventory list.
                        </p>
                    </div>
                </div>

                <div className="p-6 flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        {field('Selling Price', 'sellingPrice', 'number', { required: true, min: 0, step: 0.01 })}
                        {field('Cost Price', 'costPrice', 'number', { min: 0, step: 0.01 })}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {field('Initial Stock', 'stockQuantity', 'number', { min: 0 })}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest">Unit</label>
                            <select
                                value={form.unit}
                                onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}
                                className="h-11 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-all"
                            >
                                {['pcs', 'kg', 'g', 'litre', 'ml', 'box', 'packet', 'dozen'].map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                        <button
                            onClick={handleNext}
                            disabled={submitting}
                            className="flex-1 h-11 flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 font-bold text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/10 transition-all disabled:opacity-50"
                        >
                            <SkipForward className="w-3.5 h-3.5" /> Skip
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={submitting}
                            className="flex-1 h-11 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                        >
                            <Check className="w-4 h-4" strokeWidth={3} /> Save Item
                        </button>
                    </div>

                    <div className="text-center mt-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Item {currentIndex + 1} of {items.length}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddInventoryPromptModal;
