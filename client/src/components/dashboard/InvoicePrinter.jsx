import React from 'react';
import { useSettings } from '../../context/SettingsContext';

const translations = {
    en: {
        invoice: 'TRANSACTION RECEIPT',
        date: 'Date',
        txnId: 'Txn ID',
        customer: 'Billed To',
        name: 'Name',
        phone: 'Phone',
        details: 'Transaction Details',
        type: 'Type',
        category: 'Category',
        note: 'Description',
        amount: 'Total Amount',
        signature: 'Authorized Signature',
        thankYou: 'Thank you for your business!'
    },
    ne: {
        invoice: 'कारोबार रसिद',
        date: 'मिति',
        txnId: 'कारोबार आईडी',
        customer: 'ग्राहकको विवरण',
        name: 'नाम',
        phone: 'फोन',
        details: 'कारोबार विवरण',
        type: 'प्रकार',
        category: 'वर्ग',
        note: 'विवरण',
        amount: 'जम्मा रकम',
        signature: 'आधिकारिक हस्ताक्षर',
        thankYou: 'तपाईंको कारोबारको लागि धन्यवाद!'
    }
};

const formatNPR = (val) =>
    'Rs. ' + Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const InvoicePrinter = React.forwardRef(({ transaction }, ref) => {
    const { settings } = useSettings();
    const lang = settings?.language || 'ne';
    const t = translations[lang];

    if (!transaction) return null;

    const displayDate = transaction.createdAt
        ? new Date(transaction.createdAt).toLocaleDateString()
        : new Date().toLocaleDateString();

    const isSale = transaction.type === 'sale';
    const isUdharoSale = transaction.type === 'udharo_sale';
    const isUdharoPayment = transaction.type === 'udharo_payment';

    let displayType = t.type;
    if (lang === 'en') {
        displayType = isSale ? 'Receipt' : isUdharoSale ? 'Udharo (Owed)' : isUdharoPayment ? 'Udharo Settlement' : 'Payment';
    } else {
        displayType = isSale ? 'रसिद (आम्दानी)' : isUdharoSale ? 'उधारो' : isUdharoPayment ? 'हिसाब मिलान' : 'भुक्तानी (खर्च)';
    }

    return (
        <div ref={ref} className="print-only fixed inset-0 bg-white z-[9999] p-4 sm:p-10 font-sans text-black overflow-visible">
            <div className="max-w-4xl mx-auto p-4 sm:p-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-gray-800 pb-6 mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-gray-900">
                            {settings?.businessName || 'Khata SaaS'}
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm font-semibold tracking-wide">
                            {settings?.businessSubtitle || 'Digital Ledger System'}
                        </p>
                    </div>
                    <div className="text-left sm:text-right">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 uppercase tracking-widest mb-2">{t.invoice}</h2>
                        <p className="font-semibold text-sm text-gray-600">
                            <span className="uppercase text-xs mr-2">{t.date}:</span>
                            {displayDate}
                        </p>
                        <p className="font-semibold text-sm text-gray-600 mt-1">
                            <span className="uppercase text-xs mr-2">{t.txnId}:</span>
                            {transaction._id.substring(0, 8).toUpperCase()}
                        </p>
                    </div>
                </div>

                {/* Body */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                    {/* Customer Info */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">{t.customer}</h3>
                        {transaction.customerName ? (
                            <div className="space-y-2">
                                <p className="font-bold text-lg text-gray-900">{transaction.customerName}</p>
                                {transaction.customerPhone && <p className="text-gray-600 font-medium">{transaction.customerPhone}</p>}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">N/A</p>
                        )}
                    </div>

                    {/* Transaction Info */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-200 pb-2">{t.details}</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 font-medium">{t.type}:</span>
                                <span className="font-bold text-gray-900 px-2 py-1 bg-white rounded border border-gray-200">{displayType}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 font-medium">{t.category}:</span>
                                <span className="font-bold text-gray-900">{transaction.category || 'General'}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                <span className="text-gray-500 font-medium">{t.note}:</span>
                                <span className="font-bold text-gray-900 text-right max-w-[200px] break-words">{transaction.note || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Amount Row */}
                <div className="flex justify-end items-center bg-gray-900 text-white p-6 rounded-lg mb-16 shadow-inner">
                    <div className="flex items-center gap-8">
                        <span className="text-sm font-bold uppercase tracking-widest text-gray-300">{t.amount}</span>
                        <span className="text-4xl font-black tracking-tight">{formatNPR(transaction.amount)}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-end pt-10 border-t-2 border-gray-100">
                    <p className="text-sm font-bold text-gray-400 italic">{t.thankYou}</p>
                    <div className="text-center w-56">
                        <div className="border-b-2 border-gray-800 mb-3 h-12"></div>
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">{t.signature}</p>
                    </div>
                </div>

            </div>
        </div>
    );
});

export default InvoicePrinter;
