const Transaction = require("../models/transaction.model");
const TRANSACTION_TYPES = require("../constants/transactionTypes");

const createTransaction = async (req, res) => {
    try {
        const { amount, type, category, note, createdAt, customerName, customerPhone } = req.body;
        // Destructure the required fields from the request body

        const transactionData = {
            user: req.user.id,
            amount,
            type,
            category: category || "General",
            note,
            customerName,
            customerPhone
        };
        // Insert custom date for testing/seeding if provided
        if (createdAt) transactionData.createdAt = createdAt;

        const transaction = await Transaction.create(transactionData);

        // Create a new transaction using the Transaction model

        res.status(201).json(transaction);
        // Send a response with the created transaction and a 201 status code

    } catch (error) {
        console.error("[CREATE ERROR]", error); // Log full error on server
        res.status(400).json({ error: error.message });
    }
}

const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });
        // Retrieve all transactions from the database using the Transaction model and sort them in descending order based on the createdAt field

        res.status(200).json(transactions);
        // Send a response with the retrieved transactions and a 200 status code
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getSummary = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id });

        let totalSales = 0;
        let totalExpenses = 0;
        let totalUdharo = 0;

        transactions.forEach((tx) => {
            if (tx.status === 'void') return;
            
            if (tx.type === TRANSACTION_TYPES.SALE) {
                totalSales += tx.amount;
            } else if (tx.type === TRANSACTION_TYPES.EXPENSE) {
                totalExpenses += tx.amount;
            } else if (tx.type === TRANSACTION_TYPES.UDHARO_SALE) {
                totalUdharo += tx.amount;
            } else if (tx.type === TRANSACTION_TYPES.UDHARO_PAYMENT) {
                totalUdharo -= tx.amount;
                totalSales += tx.amount; // When they pay back, it's actual income
            }
        });

        const profit = totalSales - totalExpenses;

        res.status(200).json({
            totalSales,
            totalExpenses,
            totalUdharo,
            profit
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, type, category, note, createdAt, customerName, customerPhone, status } = req.body;
        
        console.log(`[UPDATE] ID: ${id}, User: ${req.user?._id}`);
        
        const updatedData = { 
            amount: Number(amount), 
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

        const transactions = await Transaction.find({
            user: req.user.id,
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        let totalSales = 0;
        let totalExpenses = 0;

        transactions.forEach((tx) => {
            if (tx.type === TRANSACTION_TYPES.SALE) totalSales += tx.amount;
            else if (tx.type === TRANSACTION_TYPES.EXPENSE) totalExpenses += tx.amount;
        });

        res.status(200).json({
            totalSales,
            totalExpenses,
            profit: totalSales - totalExpenses,
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createTransaction, getTransactions, getSummary, deleteTransaction, updateTransaction, getDayBookSummary };
// Export the createTransaction, getTransaction, and getSummary functions to be used in other parts of the application