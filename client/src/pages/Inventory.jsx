import React, { useState, useEffect, useCallback } from 'react';
import { Package, Plus, Search, AlertTriangle, TrendingUp, BarChart3, Edit2, Trash2, X, ChevronDown, ChevronUp, Layers } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useSettings } from '../context/SettingsContext';

const formatNPR = (val) =>
    'Rs. ' + Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const UNITS = ['pcs', 'kg', 'g', 'litre', 'ml', 'box', 'packet', 'dozen', 'pair', 'set', 'roll', 'bag'];

const emptyForm = {
    name: '', sku: '', description: '',
    sellingPrice: '', costPrice: '', stockQuantity: '',
    lowStockThreshold: '5', unit: 'pcs'
};

// ─── Item Form Modal ───────────────────────────────────────────────────────────
const ItemFormModal = ({ isOpen, onClose, onSave, editingItem }) => {
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editingItem) {
            setForm({ ...editingItem, sellingPrice: editingItem.sellingPrice, costPrice: editingItem.costPrice, stockQuantity: editingItem.stockQuantity, lowStockThreshold: editingItem.lowStockThreshold });
        } else {
            setForm(emptyForm);
        }
    }, [editingItem, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(form);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const field = (label, key, type = 'text', extra = {}) => (
        <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest">{label}</label>
            <input
                type={type}
                value={form[key]}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                className="h-11 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                {...extra}
            />
        </div>
    );

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 font-sans">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-lg bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 animate-in fade-in zoom-in duration-300 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5">
                    <div>
                        <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">
                            {editingItem ? 'Edit Item' : 'Add New Item'}
                        </h2>
                        <p className="text-[10px] text-slate-400 dark:text-gray-500 mt-0.5 uppercase tracking-widest font-bold">Inventory Management</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-4">
                        {field('Item Name *', 'name', 'text', { required: true, placeholder: 'e.g. Rice 5kg' })}
                        {field('SKU / Code', 'sku', 'text', { placeholder: 'e.g. RIC-001' })}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {field('Selling Price (Rs.) *', 'sellingPrice', 'number', { required: true, min: 0, step: 0.01, placeholder: '0.00' })}
                        {field('Cost Price (Rs.)', 'costPrice', 'number', { min: 0, step: 0.01, placeholder: '0.00' })}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {field('Stock Qty', 'stockQuantity', 'number', { min: 0, placeholder: '0' })}
                        {field('Low Stock Alert', 'lowStockThreshold', 'number', { min: 0, placeholder: '5' })}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest">Unit</label>
                            <select
                                value={form.unit}
                                onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}
                                className="h-11 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-all"
                            >
                                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>
                    </div>
                    {field('Description', 'description', 'text', { placeholder: 'Optional notes...' })}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-sm rounded-2xl transition-all active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : editingItem ? 'Update Item' : 'Add Item'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// ─── Stock Adjust Modal ────────────────────────────────────────────────────────
const StockAdjustModal = ({ item, onClose, onAdjust }) => {
    const [adjustment, setAdjustment] = useState('');
    const [loading, setLoading] = useState(false);

    if (!item) return null;

    const handleSubmit = async (val) => {
        const num = parseInt(val);
        if (isNaN(num) || num === 0) return toast.error('Enter a valid non-zero quantity');
        setLoading(true);
        try {
            await onAdjust(item._id, num);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 font-sans">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-sm bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 animate-in fade-in zoom-in duration-300 p-6">
                <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">Adjust Stock</h2>
                <p className="text-sm text-slate-500 dark:text-gray-400 mb-5">{item.name} — Current: <span className="font-black text-slate-900 dark:text-white">{item.stockQuantity} {item.unit}</span></p>
                <div className="flex gap-3 mb-5">
                    <button onClick={() => setAdjustment(a => {
                        const n = parseInt(a);
                        return isNaN(n) ? '' : String(Math.abs(n));
                    })} className="h-10 px-4 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-black text-sm transition-all hover:bg-emerald-200">+ Add</button>
                    <button onClick={() => setAdjustment(a => {
                        const n = parseInt(a);
                        return isNaN(n) ? '' : String(-Math.abs(n));
                    })} className="h-10 px-4 rounded-xl bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 font-black text-sm transition-all hover:bg-rose-200">− Remove</button>
                </div>
                <input
                    type="number"
                    value={adjustment}
                    onChange={e => setAdjustment(e.target.value)}
                    placeholder="e.g. 10 or -5"
                    className="w-full h-12 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 text-base font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-all mb-4"
                />
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 h-11 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 font-bold text-sm transition-all hover:bg-slate-50 dark:hover:bg-white/5">Cancel</button>
                    <button onClick={() => handleSubmit(adjustment)} disabled={loading} className="flex-1 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm transition-all active:scale-95 disabled:opacity-50">
                        {loading ? 'Saving...' : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main Inventory Page ───────────────────────────────────────────────────────
const Inventory = () => {
    const { settings } = useSettings();
    const lang = settings?.language || 'ne';
    const [items, setItems] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all'); // all | low | out
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [adjustingItem, setAdjustingItem] = useState(null);

    const fetchInventory = useCallback(async () => {
        setLoading(true);
        try {
            const [itemsRes, summaryRes] = await Promise.all([
                api.get('/inventory'),
                api.get('/inventory/summary')
            ]);
            setItems(itemsRes.data);
            setSummary(summaryRes.data);
        } catch (err) {
            toast.error('Failed to load inventory');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchInventory(); }, [fetchInventory]);

    const handleSave = async (form) => {
        try {
            if (editingItem) {
                await api.put(`/inventory/${editingItem._id}`, form);
                toast.success('Item updated ✨');
            } else {
                await api.post('/inventory', form);
                toast.success('Item added 🚀');
            }
            setEditingItem(null);
            fetchInventory();
        } catch (err) {
            toast.error(err?.response?.data?.error || 'Failed to save item');
            throw err;
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this item?')) return;
        try {
            await api.delete(`/inventory/${id}`);
            toast.success('Item deleted');
            fetchInventory();
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    const handleAdjust = async (id, adjustment) => {
        try {
            await api.put(`/inventory/${id}/adjust`, { adjustment });
            toast.success('Stock updated ✅');
            fetchInventory();
        } catch (err) {
            toast.error(err?.response?.data?.error || 'Failed to adjust stock');
            throw err;
        }
    };

    const filtered = items.filter(item => {
        const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'all' || (filter === 'low' && item.stockQuantity <= item.lowStockThreshold && item.stockQuantity > 0) || (filter === 'out' && item.stockQuantity === 0);
        return matchSearch && matchFilter;
    });

    const getStockColor = (item) => {
        if (item.stockQuantity === 0) return 'text-rose-600 dark:text-rose-400';
        if (item.stockQuantity <= item.lowStockThreshold) return 'text-amber-600 dark:text-amber-400';
        return 'text-emerald-600 dark:text-emerald-400';
    };

    const getStockBadge = (item) => {
        if (item.stockQuantity === 0) return <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400">Out of Stock</span>;
        if (item.stockQuantity <= item.lowStockThreshold) return <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">Low Stock</span>;
        return null;
    };

    const statCards = summary ? [
        { label: 'Total Items', value: summary.totalItems, icon: Package, color: 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400' },
        { label: 'Stock Value (Cost)', value: formatNPR(summary.totalStockValue), icon: BarChart3, color: 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white' },
        { label: 'Retail Value', value: formatNPR(summary.totalRetailValue), icon: TrendingUp, color: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400' },
        { label: 'Low Stock Alerts', value: summary.lowStockCount + summary.outOfStockCount, icon: AlertTriangle, color: `${(summary.lowStockCount + summary.outOfStockCount) > 0 ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400'}` },
    ] : [];

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                        {lang === 'ne' ? 'स्टक व्यवस्थापन' : 'Inventory'}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mt-1 font-medium italic">
                        {lang === 'ne' ? 'वस्तु र स्टकको व्यवस्थापन गर्नुहोस्' : 'Manage your products and stock levels'}
                    </p>
                </div>
                <button
                    onClick={() => { setEditingItem(null); setIsFormOpen(true); }}
                    className="flex items-center gap-2 h-12 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm shadow-indigo-600/30 active:scale-95"
                >
                    <Plus className="w-4 h-4" /> Add Item
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {statCards.map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className={`flex flex-col gap-3 p-5 rounded-2xl border ${color}`}>
                        <Icon className="w-5 h-5 opacity-80" />
                        <div>
                            <p className="text-2xl font-black">{value}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mt-0.5">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name or SKU..."
                        className="w-full h-11 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-600 outline-none focus:border-indigo-500 transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    {[['all', 'All'], ['low', 'Low Stock'], ['out', 'Out of Stock']].map(([val, label]) => (
                        <button
                            key={val}
                            onClick={() => setFilter(val)}
                            className={`h-11 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${filter === val ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Items Table */}
            <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-slate-200 dark:border-white/[0.05] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm min-w-[700px]">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-white/[0.05]">
                                {['Item', 'SKU', 'Stock', 'Selling Price', 'Cost Price', 'Margin', 'Actions'].map(h => (
                                    <th key={h} className={`px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500 bg-white dark:bg-[#0a0a0a] ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr><td colSpan={7} className="py-20 text-center text-slate-400 dark:text-gray-600">
                                    <div className="inline-flex gap-2 items-center text-xs font-bold uppercase tracking-widest">
                                        <div className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                                        Loading...
                                    </div>
                                </td></tr>
                            )}
                            {!loading && filtered.length === 0 && (
                                <tr><td colSpan={7} className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                                            <Package className="w-8 h-8 text-slate-300 dark:text-gray-700" />
                                        </div>
                                        <p className="text-sm font-bold text-slate-400 dark:text-gray-600">No items found</p>
                                        <button onClick={() => { setEditingItem(null); setIsFormOpen(true); }} className="text-xs font-black text-indigo-600 hover:underline uppercase tracking-wider">Add your first item →</button>
                                    </div>
                                </td></tr>
                            )}
                            {!loading && filtered.map(item => {
                                const margin = item.sellingPrice > 0 ? ((item.sellingPrice - item.costPrice) / item.sellingPrice * 100).toFixed(0) : 0;
                                return (
                                    <tr key={item._id} className="group border-b border-slate-50 dark:border-white/[0.03] last:border-0 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 dark:text-white">{item.name}</span>
                                                {item.description && <span className="text-[11px] text-slate-400 dark:text-gray-500 mt-0.5">{item.description}</span>}
                                                <div className="mt-1">{getStockBadge(item)}</div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-xs font-mono text-slate-500 dark:text-gray-400">{item.sku || '—'}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-base font-black ${getStockColor(item)}`}>{item.stockQuantity}</span>
                                                <span className="text-xs text-slate-400 dark:text-gray-500">{item.unit}</span>
                                                <button
                                                    onClick={() => setAdjustingItem(item)}
                                                    className="ml-1 p-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 opacity-0 group-hover:opacity-100 transition-all"
                                                    title="Adjust Stock"
                                                >
                                                    <Layers className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 font-bold text-slate-900 dark:text-white">{formatNPR(item.sellingPrice)}</td>
                                        <td className="px-4 py-4 text-slate-500 dark:text-gray-400">{formatNPR(item.costPrice)}</td>
                                        <td className="px-4 py-4">
                                            <span className={`text-xs font-black px-2 py-1 rounded-lg ${Number(margin) >= 30 ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : Number(margin) >= 10 ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400'}`}>
                                                {margin}%
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => { setEditingItem(item); setIsFormOpen(true); }}
                                                    className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-all active:scale-95"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <ItemFormModal
                isOpen={isFormOpen}
                onClose={() => { setIsFormOpen(false); setEditingItem(null); }}
                onSave={handleSave}
                editingItem={editingItem}
            />
            <StockAdjustModal
                item={adjustingItem}
                onClose={() => setAdjustingItem(null)}
                onAdjust={handleAdjust}
            />
        </div>
    );
};

export default Inventory;
