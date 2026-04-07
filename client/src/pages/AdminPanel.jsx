import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import api from '../services/api';
import { ShieldCheck, User as UserIcon, CheckCircle, XCircle, Trash2, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import DeleteConfirmModal from '../components/dashboard/DeleteConfirmModal';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ show: false, userId: null, userName: '' });
    const { searchQuery } = useOutletContext();

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        const loadingToast = toast.loading('Syncing status...');
        try {
            await api.put(`/admin/users/${id}`, { status });
            toast.success(`Access level set to ${status.toUpperCase()} ✨`, { id: loadingToast });
            fetchUsers();
        } catch (err) {
            toast.error('Failed to update status', { id: loadingToast });
        }
    };

    const handleDeleteClick = (user) => {
        setDeleteModal({ show: true, userId: user._id, userName: user.name });
    };

    const confirmDelete = async () => {
        const loadingToast = toast.loading('Permanently removing operative...');
        try {
            await api.delete(`/admin/users/${deleteModal.userId}`);
            toast.success('User purged from system 🗑️', { id: loadingToast });
            setDeleteModal({ show: false, userId: null, userName: '' });
            fetchUsers();
        } catch (err) {
            toast.error('Failed to delete user', { id: loadingToast });
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
            <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-indigo-500" strokeWidth={2.5} />
                    Command Center
                </h2>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1 font-medium italic font-sans italic opacity-80">Oversee global operability and user authorizations.</p>
            </div>

            <div className="bg-white dark:bg-[#0a0a0a] rounded-[32px] shadow-sm border border-slate-200 dark:border-white/[0.05] overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                    <h3 className="text-[10px] font-black text-slate-400 dark:text-gray-600 uppercase tracking-[0.2em]">User Registry — Activity Monitor ({users.length})</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans">
                        <thead>
                            <tr className="bg-slate-50/30 dark:bg-transparent">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-600">Operative Identity</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-600">Access Level</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-600 text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-600 text-right">Clearance Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {filteredUsers.map(u => (
                                <tr key={u._id} className="group hover:bg-slate-50 dark:hover:bg-white/[0.01] transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110">
                                                <UserIcon className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{u.name}</span>
                                                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 opacity-70">
                                                    <Mail className="w-3 h-3" /> {u.email}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${u.role === 'admin' ? 'bg-indigo-50/50 dark:bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:border-indigo-500/20' : 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-gray-500 border-slate-200 dark:border-white/10'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em]
                                            ${u.status === 'active' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 
                                              u.status === 'pending' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600' : 
                                              'bg-rose-50 dark:bg-rose-500/10 text-rose-600'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${u.status === 'active' ? 'bg-emerald-500' : u.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {u.status === 'pending' && (
                                                <button 
                                                    onClick={() => handleStatusUpdate(u._id, 'active')}
                                                    className="p-2.5 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all hover:scale-110 active:scale-95"
                                                    title="Authorize User"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                            )}
                                            {u.status === 'active' && u.role !== 'admin' && (
                                                <button 
                                                    onClick={() => handleStatusUpdate(u._id, 'suspended')}
                                                    className="p-2.5 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-xl transition-all hover:scale-110 active:scale-95"
                                                    title="Suspend Access"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            )}
                                            {u.status === 'suspended' && (
                                                <button 
                                                    onClick={() => handleStatusUpdate(u._id, 'active')}
                                                    className="p-2.5 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all hover:scale-110 active:scale-95"
                                                    title="Restore Access"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                            )}
                                            {u.role !== 'admin' && (
                                                <button 
                                                    onClick={() => handleDeleteClick(u)}
                                                    className="p-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all hover:scale-110 active:scale-95"
                                                    title="Terminate Account"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Premium Confirmation Modal */}
            <DeleteConfirmModal
                isOpen={deleteModal.show}
                onClose={() => setDeleteModal({ show: false, userId: null, userName: '' })}
                onConfirm={confirmDelete}
                title="Terminate Operative"
                message={`Are you sure you want to permanently revoke all access for ${deleteModal.userName}? This action will erase their registry entry and cannot be reversed.`}
                confirmText="Terminate Account"
            />
        </div>
    );
};

export default AdminPanel;
