const Transaction = require("../models/transaction.model");
const TRANSACTION_TYPES = require("../constants/transactionTypes");

const createTransaction = async (req, res) => {
    try {
        const { amount, type, category, note, createdAt, customerName, customerPhone } = req.body;

        // --- Validation ---
        const parsedAmount = Number(amount);
        if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ error: 'Amount must be a positive number greater than 0.' });
        }
        if (!type) {
            return res.status(400).json({ error: 'Transaction type is required.' });
        }
        const udharoTypes = [TRANSACTION_TYPES.UDHARO_SALE, TRANSACTION_TYPES.UDHARO_PAYMENT];
        if (udharoTypes.includes(type) && (!customerName || !customerName.trim())) {
            return res.status(400).json({ error: 'Customer name is required for Udharo transactions.' });
        }
        // --- End Validation ---

        const transactionData = {
            user: req.user.id,
            amount: parsedAmount,
            type,
            category: category || "General",
            note,
            customerName,
            customerPhone
        };
        if (createdAt) transactionData.createdAt = createdAt;

        const transaction = await Transaction.create(transactionData);
        res.status(201).json(transaction);

    } catch (error) {
        console.error("[CREATE ERROR]", error);
        res.status(400).json({ error: error.message });
    }
}

const getTransactions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100; // Increased limit to not break things too much
        const skip = (page - 1) * limit;

        const transactions = await Transaction.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Transaction.countDocuments({ user: req.user.id });

        res.status(200).json({
            data: transactions,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalTransactions: total
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getSummary = async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const summary = await Transaction.aggregate([
            { 
                $match: { 
                    user: new mongoose.Types.ObjectId(req.user.id),
                    status: { $ne: 'void' }
                } 
            },
            {
                $group: {
                    _id: null,
                    totalSales: {
                        $sum: {
                            $cond: [
                                { $in: ["$type", [TRANSACTION_TYPES.SALE, TRANSACTION_TYPES.UDHARO_PAYMENT]] },
                                "$amount",
                                0
                            ]
                        }
                    },
                    totalExpenses: {
                        $sum: {
                            $cond: [
                                { $eq: ["$type", TRANSACTION_TYPES.EXPENSE] },
                                "$amount",
                                0
                            ]
                        }
                    },
                    totalUdharoSale: {
                        $sum: {
                            $cond: [
                                { $eq: ["$type", TRANSACTION_TYPES.UDHARO_SALE] },
                                "$amount",
                                0
                            ]
                        }
                    },
                    totalUdharoPayment: {
                        $sum: {
                            $cond: [
                                { $eq: ["$type", TRANSACTION_TYPES.UDHARO_PAYMENT] },
                                "$amount",
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        const data = summary[0] || { totalSales: 0, totalExpenses: 0, totalUdharoSale: 0, totalUdharoPayment: 0 };
        const totalUdharo = data.totalUdharoSale - data.totalUdharoPayment;
        const profit = data.totalSales - data.totalExpenses;

        res.status(200).json({
            totalSales: data.totalSales,
            totalExpenses: data.totalExpenses,
            totalUdharo: totalUdharo,
            profit: profit
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, type, category, note, createdAt, customerName, customerPhone, status } = req.body;
        
        // --- Validation ---
        const parsedAmount = Number(amount);
        if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ error: 'Amount must be a positive number greater than 0.' });
        }
        const udharoTypes = [TRANSACTION_TYPES.UDHARO_SALE, TRANSACTION_TYPES.UDHARO_PAYMENT];
        if (udharoTypes.includes(type) && (!customerName || !customerName.trim())) {
            return res.status(400).json({ error: 'Customer name is required for Udharo transactions.' });
        }
        // --- End Validation ---
        
        console.log(`[UPDATE] ID: ${id}, User: ${req.user?._id}`);
        
        const updatedData = { 
            amount: parsedAmount, 
            type, 
            category: category || "General", 
            note,
            customerName,
            customerPhone,
            status: status || "active"
        };
        
        if (createdAt) {
            updatedData.createdAt = new Date(createdAt);
        }

        const transaction = await Transaction.findOneAndUpdate(
            { _id: id, user: req.user._id },
            updatedData,
            { new: true, runValidators: true }
        );

        if (!transaction) {
            console.log(`[UPDATE] Failed: Transaction ${id} not found for User ${req.user._id}`);
            return res.status(404).json({ error: "Transaction not found or you don't have permission to edit it." });
        }

        console.log(`[UPDATE] Success: ${id}`);
        res.status(200).json(transaction);
    } catch (error) {
        console.error(`[UPDATE] Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
}

const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params
        const transaction = await Transaction.findOneAndDelete({ _id: id, user: req.user.id }); 

        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" })
        }

        res.status(200).json({ message: "Transaction deleted successfully" })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getDayBookSummary = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const mongoose = require('mongoose');
        const summary = await Transaction.aggregate([
            { 
                $match: { 
                    user: new mongoose.Types.ObjectId(req.user.id),
                    createdAt: { $gte: startOfDay, $lte: endOfDay },
                    status: { $ne: 'void' }
                } 
            },
            {
                $group: {
                    _id: null,
                    totalSales: {
                        $sum: {
                            $cond: [
                                { $eq: ["$type", TRANSACTION_TYPES.SALE] },
                                "$amount",
                                0
                            ]
                        }
                    },
                    totalExpenses: {
                        $sum: {
                            $cond: [
                                { $eq: ["$type", TRANSACTION_TYPES.EXPENSE] },
                                "$amount",
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        const data = summary[0] || { totalSales: 0, totalExpenses: 0 };
        const profit = data.totalSales - data.totalExpenses;

        res.status(200).json({
            totalSales: data.totalSales,
            totalExpenses: data.totalExpenses,
            profit: profit,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const verifyTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findOneAndUpdate(
            { _id: id, user: req.user.id },
            { status: 'active' },
            { new: true }
        );

        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { 
    createTransaction, 
    getTransactions, 
    getSummary,
    deleteTransaction,
    updateTransaction,
    getDayBookSummary,
    verifyTransaction
};
// Export the createTransaction, getTransaction, and getSummary functions to be used in other parts of the application