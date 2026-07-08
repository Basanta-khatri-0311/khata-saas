import React from 'react';
import { useSettings } from '../../context/SettingsContext';

const translations = {
    en: {
        invoice: 'TRANSACTION RECEIPT',
        company: 'Khata SaaS',
        date: 'Date',
        txnId: 'Txn ID',
        customer: 'Customer Details',
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
        company: 'खाता SaaS',
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
        <div ref={ref} className="print-only fixed inset-0 bg-white z-[9999] p-10 font-sans text-black">
            <div className="max-w-3xl mx-auto border border-gray-300 p-8 rounded-lg shadow-sm">
                
                {/* Header */}
                <div className="flex justify-between items-start border-b border-gray-300 pb-6 mb-6">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-wider">{t.company}</h1>
                        <p className="text-gray-500 mt-1 text-sm font-medium">{t.invoice}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-sm">
                            <span className="text-gray-500 uppercase text-xs mr-2">{t.date}:</span> 
                            {displayDate}
                        </p>
                        <p className="font-bold text-sm mt-1">
                            <span className="text-gray-500 uppercase text-xs mr-2">{t.txnId}:</span> 
                            {transaction._id.substring(0, 8).toUpperCase()}
                        </p>
                    </div>
                </div>

                {/* Body */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    {/* Customer Info */}
                    <div>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">{t.customer}</h3>
                        {transaction.customerName ? (
                            <div className="space-y-1">
                                <p className="font-bold">{transaction.customerName}</p>
                                {transaction.customerPhone && <p className="text-gray-600">{transaction.customerPhone}</p>}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">N/A</p>
                        )}
                    </div>

                    {/* Transaction Info */}
                    <div>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">{t.details}</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between border-b border-gray-100 pb-1">
                                <span className="text-gray-500">{t.type}:</span>
                                <span className="font-bold">{displayType}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-1">
                                <span className="text-gray-500">{t.category}:</span>
                                <span className="font-bold">{transaction.category || 'General'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-1">
                                <span className="text-gray-500">{t.note}:</span>
                                <span className="font-bold">{transaction.note || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Amount Row */}
                <div className="flex justify-end border-t border-b border-gray-300 py-4 mb-16">
                    <div className="flex items-center gap-6">
                        <span className="text-sm font-black text-gray-400 uppercase tracking-widest">{t.amount}</span>
                        <span className="text-3xl font-black">{formatNPR(transaction.amount)}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-end mt-20">
                    <p className="text-sm font-bold text-gray-400 italic">{t.thankYou}</p>
                    <div className="text-center w-48">
                        <div className="border-b-2 border-black mb-2 h-10"></div>
                        <p className="text-xs font-bold uppercase tracking-widest">{t.signature}</p>
                    </div>
                </div>

            </div>
        </div>
    );
});

export default InvoicePrinter;
