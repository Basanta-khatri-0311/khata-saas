import React from 'react';
import { useSettings } from '../../context/SettingsContext';

const formatNPR = (val) =>
    'Rs. ' + Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const typeLabel = (type, lang) => {
    const map = {
        sale: lang === 'ne' ? 'रसिद' : 'Receipt',
        expense: lang === 'ne' ? 'खर्च' : 'Expense',
        udharo_sale: lang === 'ne' ? 'उधारो' : 'Udharo',
        udharo_payment: lang === 'ne' ? 'हिसाब मिलान' : 'Settlement',
    };
    return map[type] || type;
};

const LedgerExporter = React.forwardRef(({ transactions, timeFilter }, ref) => {
    const { settings } = useSettings();
    const lang = settings?.language || 'ne';

    const totalSales = transactions
        .filter(tx => tx.type === 'sale' || tx.type === 'udharo_payment')
        .reduce((sum, tx) => sum + (tx.amount || 0), 0);

    const totalExpenses = transactions
        .filter(tx => tx.type === 'expense')
        .reduce((sum, tx) => sum + (tx.amount || 0), 0);

    const totalUdharo = transactions
        .filter(tx => tx.type === 'udharo_sale')
        .reduce((sum, tx) => sum + (tx.amount || 0), 0) -
        transactions
        .filter(tx => tx.type === 'udharo_payment')
        .reduce((sum, tx) => sum + (tx.amount || 0), 0);

    const profit = totalSales - totalExpenses;

    const filterLabel = {
        all: lang === 'ne' ? 'सबै कारोबार' : 'All Transactions',
        week: lang === 'ne' ? 'यस हप्ताको' : 'This Week',
        month: lang === 'ne' ? 'यस महिनाको' : 'This Month',
        year: lang === 'ne' ? 'यस वर्षको' : 'This Year',
    }[timeFilter] || 'All';

    return (
        <div ref={ref} className="print-only fixed inset-0 bg-white z-[9999] p-6 sm:p-10 font-sans text-black overflow-auto">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-gray-800 pb-6 mb-8">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-wider text-gray-900">
                            {settings?.businessName || 'Khata SaaS'}
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm font-semibold tracking-wide">
                            {settings?.businessSubtitle || 'Digital Ledger System'}
                        </p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-widest">
                            {lang === 'ne' ? 'आर्थिक बहिखाता' : 'Financial Ledger'}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1 font-semibold">{filterLabel}</p>
                        <p className="text-xs text-gray-400 mt-1">
                            {lang === 'ne' ? 'प्रिन्ट मिति' : 'Printed'}: {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {[
                        { label: lang === 'ne' ? 'कुल आम्दानी' : 'Total Sales', value: formatNPR(totalSales), color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
                        { label: lang === 'ne' ? 'कुल खर्च' : 'Total Expenses', value: formatNPR(totalExpenses), color: 'bg-rose-50 border-rose-200 text-rose-700' },
                        { label: lang === 'ne' ? 'बाँकी उधारो' : 'Outstanding Udharo', value: formatNPR(Math.max(0, totalUdharo)), color: 'bg-amber-50 border-amber-200 text-amber-700' },
                        { label: lang === 'ne' ? 'नाफा' : 'Net Profit', value: formatNPR(profit), color: profit >= 0 ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-red-50 border-red-200 text-red-700' },
                    ].map(({ label, value, color }) => (
                        <div key={label} className={`border rounded-lg p-4 ${color}`}>
                            <p className="text-xs font-bold uppercase tracking-widest opacity-70">{label}</p>
                            <p className="text-xl font-black mt-1">{value}</p>
                        </div>
                    ))}
                </div>

                {/* Transactions Table */}
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-900 text-white">
                            <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest">{lang === 'ne' ? 'मिति' : 'Date'}</th>
                            <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest">{lang === 'ne' ? 'प्रकार' : 'Type'}</th>
                            <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest">{lang === 'ne' ? 'वर्ग' : 'Category'}</th>
                            <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest">{lang === 'ne' ? 'ग्राहक' : 'Customer'}</th>
                            <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-widest">{lang === 'ne' ? 'विवरण' : 'Description'}</th>
                            <th className="text-right px-4 py-3 text-xs font-bold uppercase tracking-widest">{lang === 'ne' ? 'रकम' : 'Amount'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx, i) => {
                            const isSale = tx.type === 'sale' || tx.type === 'udharo_payment';
                            return (
                                <tr key={tx._id || i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-4 py-2.5 text-gray-600">{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : '-'}</td>
                                    <td className="px-4 py-2.5">
                                        <span className={`font-bold text-xs px-2 py-1 rounded ${isSale ? 'bg-emerald-100 text-emerald-700' : tx.type === 'udharo_sale' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                                            {typeLabel(tx.type, lang)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-gray-700">{tx.category || 'General'}</td>
                                    <td className="px-4 py-2.5 text-gray-700">{tx.customerName || '-'}</td>
                                    <td className="px-4 py-2.5 text-gray-700 max-w-[200px]">{tx.note || '-'}</td>
                                    <td className={`px-4 py-2.5 text-right font-bold ${isSale ? 'text-emerald-600' : 'text-gray-900'}`}>
                                        {isSale ? '+' : '-'}{formatNPR(tx.amount)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-900 text-white">
                            <td colSpan={5} className="px-4 py-3 text-sm font-black uppercase tracking-widest">
                                {lang === 'ne' ? `जम्मा — ${transactions.length} कारोबार` : `Total — ${transactions.length} Transactions`}
                            </td>
                            <td className="px-4 py-3 text-right font-black text-lg">
                                {formatNPR(profit)}
                            </td>
                        </tr>
                    </tfoot>
                </table>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400 mt-10 italic font-semibold">
                    {lang === 'ne' ? 'खाता SaaS द्वारा तयार गरिएको' : 'Generated by Khata SaaS'} — {new Date().toLocaleString()}
                </p>
            </div>
        </div>
    );
});

export default LedgerExporter;
