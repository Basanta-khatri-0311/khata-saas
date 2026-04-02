import { useState, useEffect } from 'react'
import api from '../services/api'

const Dashboard = () => {
    const [summary, setSummary] = useState({ totalSales: 0, totalExpenses: 0, profit: 0 })
    const [transactions, setTransactions] = useState([])
    const [amount, setAmount] = useState('')
    const [type, setType] = useState('sale')
    const [note, setNote] = useState('')
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        Promise.all([fetchSummary(), fetchTransactions()]).finally(() => setLoading(false))
    }, [])

    const fetchSummary = async () => {
        try {
            const res = await api.get('/transactions/summary')
            setSummary(res.data)
        } catch (err) { console.error(err) }
    }

    const fetchTransactions = async () => {
        try {
            const res = await api.get('/transactions')
            setTransactions(res.data)
        } catch (err) { console.error(err) }
    }

    const addTransaction = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            await api.post('/transactions', { amount, type, note })
            setAmount('')
            setNote('')
            await Promise.all([fetchSummary(), fetchTransactions()])
        } catch (err) { console.error(err) }
        finally { setSubmitting(false) }
    }

    const deleteTransaction = async (id) => {
        try {
            await api.delete(`/transactions/${id}`)
            await Promise.all([fetchTransactions(), fetchSummary()])
        } catch (err) { console.error(err) }
    }

    const formatNPR = (val) =>
        'Rs. ' + Number(val || 0).toLocaleString('en-NP', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    const profitPositive = (summary.profit || 0) >= 0

    return (
        <div className="flex h-screen bg-[#0f0f10] text-[#ececed] overflow-hidden">

            {/* Sidebar */}
            <aside className="hidden md:flex w-56 flex-col border-r border-white/[0.07] bg-[#0f0f10] px-3 py-5 gap-6 shrink-0">
                <div className="flex items-center gap-2.5 px-2 py-1">
                    <span className="w-6 h-6 rounded-md bg-blue-500 shrink-0 block" />
                    <span className="text-base font-semibold tracking-tight">Ledger</span>
                </div>
                <nav className="flex flex-col gap-0.5">
                    {[
                        { label: 'Dashboard', active: true },
                        { label: 'Transactions', active: false },
                        { label: 'Reports', active: false },
                    ].map(({ label, active }) => (
                        <a
                            key={label}
                            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm cursor-pointer transition-colors
                                ${active
                                    ? 'bg-white/[0.07] text-[#ececed] font-medium'
                                    : 'text-[#9191a0] hover:bg-white/5 hover:text-[#ececed]'
                                }`}
                        >
                            {label}
                        </a>
                    ))}
                </nav>
            </aside>

            {/* Main */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

                {/* Topbar */}
                <header className="h-14 flex items-center justify-between border-b border-white/[0.07] px-8 shrink-0">
                    <span className="text-[15px] font-medium">Dashboard</span>
                    <button
                        onClick={() => document.getElementById('amount-input').focus()}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 transition-colors text-white text-[13px] font-medium px-4 py-2 rounded-md"
                    >
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                            <path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                        New Transaction
                    </button>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-8 py-9 flex flex-col gap-8">

                    {/* Stats */}
                    <div className="flex divide-x divide-white/[0.07] border border-white/[0.07] rounded-xl bg-[#161618] overflow-hidden max-sm:flex-col max-sm:divide-x-0 max-sm:divide-y">
                        {[
                            { label: 'Total Sales', value: formatNPR(summary.totalSales), color: 'text-emerald-400' },
                            { label: 'Total Expenses', value: formatNPR(summary.totalExpenses), color: 'text-red-400' },
                            { label: 'Net Profit', value: formatNPR(summary.profit), color: profitPositive ? 'text-[#ececed]' : 'text-red-400' },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="flex-1 px-8 py-7 flex flex-col gap-2.5">
                                <span className="text-[11px] font-medium uppercase tracking-widest text-[#56565f]">{label}</span>
                                <span className={`font-mono text-3xl font-medium tracking-tight ${color}`}>{value}</span>
                            </div>
                        ))}
                    </div>

                    {/* New Transaction */}
                    <div className="border border-white/[0.07] rounded-xl bg-[#161618] overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-white/[0.07]">
                            <span className="text-[13px] font-medium text-[#9191a0]">New Transaction</span>
                        </div>
                        <form onSubmit={addTransaction} className="flex items-center gap-2.5 px-5 py-4 flex-wrap">
                            <input
                                id="amount-input"
                                type="number"
                                placeholder="Amount (Rs.)"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                                min="0"
                                step="0.01"
                                className="h-10 w-44 bg-[#1c1c1f] border border-white/[0.07] rounded-md px-3 text-[14px] text-[#ececed] placeholder-[#56565f] outline-none focus:border-white/20 transition-colors"
                            />

                            {/* Type toggle */}
                            <div className="flex h-10 border border-white/[0.07] rounded-md overflow-hidden shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setType('sale')}
                                    className={`px-4 text-[13px] font-medium transition-colors
                                        ${type === 'sale'
                                            ? 'bg-emerald-400/10 text-emerald-400'
                                            : 'bg-[#1c1c1f] text-[#56565f] hover:text-[#ececed]'
                                        }`}
                                >Sale</button>
                                <div className="w-px bg-white/[0.07]" />
                                <button
                                    type="button"
                                    onClick={() => setType('expense')}
                                    className={`px-4 text-[13px] font-medium transition-colors
                                        ${type === 'expense'
                                            ? 'bg-red-400/10 text-red-400'
                                            : 'bg-[#1c1c1f] text-[#56565f] hover:text-[#ececed]'
                                        }`}
                                >Expense</button>
                            </div>

                            <input
                                type="text"
                                placeholder="Add a note..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="h-10 flex-1 min-w-45 bg-[#1c1c1f] border border-white/[0.07] rounded-md px-3 text-[14px] text-[#ececed] placeholder-[#56565f] outline-none focus:border-white/20 transition-colors"
                            />

                            <button
                                type="submit"
                                disabled={submitting || !amount}
                                className="h-10 px-5 bg-[#1c1c1f] border border-white/[0.07] hover:bg-white/[0.07] hover:border-white/12 text-[#ececed] text-[13px] font-medium rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                                {submitting ? 'Saving...' : 'Save'}
                            </button>
                        </form>
                    </div>

                    {/* Transactions Table */}
                    <div className="border border-white/[0.07] rounded-xl bg-[#161618] overflow-hidden">
                        <div className="px-5 py-3.5 border-b border-white/[0.07] flex items-center gap-2.5">
                            <span className="text-[13px] font-medium text-[#9191a0]">Transactions</span>
                            <span className="inline-flex items-center justify-center h-5 min-w-5.5 px-1.5 bg-[#1c1c1f] border border-white/[0.07] rounded text-[11px] font-mono text-[#56565f]">
                                {transactions.length}
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        {['Type', 'Note', 'Amount', ''].map((h, i) => (
                                            <th
                                                key={i}
                                                className={`px-5 py-3 text-left text-[11px] font-medium uppercase tracking-widest text-[#56565f] border-b border-white/[0.07] whitespace-nowrap
                                                    ${h === 'Amount' ? 'text-right' : ''}
                                                    ${h === '' ? 'w-px' : ''}`}
                                            >{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="py-14 text-center text-[#56565f]">
                                                <span className="inline-flex gap-1.5 items-center">
                                                    {[0, 200, 400].map(d => (
                                                        <span key={d} className="w-1.5 h-1.5 rounded-full bg-[#56565f] animate-pulse" style={{ animationDelay: `${d}ms` }} />
                                                    ))}
                                                </span>
                                            </td>
                                        </tr>
                                    ) : transactions.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="py-14 text-center text-[13px] text-[#56565f] italic">
                                                No transactions recorded yet
                                            </td>
                                        </tr>
                                    ) : transactions.map((tx) => (
                                        <tr key={tx._id} className="border-b border-white/4 last:border-0 hover:bg-white/3 transition-colors group">
                                            <td className="px-5 py-3.5 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded text-[12px] font-medium capitalize
                                                    ${tx.type === 'sale'
                                                        ? 'bg-emerald-400/10 text-emerald-400'
                                                        : 'bg-red-400/10 text-red-400'
                                                    }`}>
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-[14px] text-[#9191a0] max-w-xs truncate">
                                                {tx.note || <span className="text-[#56565f]">—</span>}
                                            </td>
                                            <td className={`px-5 py-3.5 text-right font-mono text-[13px] whitespace-nowrap
                                                ${tx.type === 'sale' ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {tx.type === 'sale' ? '+' : '-'}{formatNPR(tx.amount)}
                                            </td>
                                            <td className="px-5 py-3.5 w-px">
                                                <button
                                                    onClick={() => deleteTransaction(tx._id)}
                                                    aria-label="Delete"
                                                    className="w-7 h-7 flex items-center justify-center rounded border border-transparent text-[#56565f] opacity-0 group-hover:opacity-100 hover:bg-red-400/10 hover:text-red-400 hover:border-red-400/20 transition-all"
                                                >
                                                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                                                        <path d="M1.5 1.5l8 8M9.5 1.5l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Dashboard