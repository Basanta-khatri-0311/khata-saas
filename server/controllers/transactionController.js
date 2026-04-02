const Transaction = require("../models/transaction.model");
const TRANSACTION_TYPES = require("../constants/transactionTypes");


const createTransaction = async (req, res) => {
    try {
        const { amount, type, note } = req.body;
        // Destructure the required fields from the request body

        const transaction = await Transaction.create({
            amount,
            type,
            note,
        });

        // Create a new transaction using the Transaction model

        res.status(201).json(transaction);
        // Send a response with the created transaction and a 201 status code

    } catch (error) {
        res.status(500).json({ error: error.message });
        // Handle any errors that occur during the transaction creation process and send a 500 status code with the error message
    }
}


const getTransaction = async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ createdAt: -1 });
        // Retrieve all transactions from the database using the Transaction model and sort them in descending order based on the createdAt field

        res.status(200).json(transactions);
        // Send a response with the retrieved transactions and a 200 status code
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const getSummary = async (req, res) => {
    try {
        const summary = await Transaction.aggregate([
            {
                $group: {
                    _id: "$type",
                    total: { $sum: "$amount" }
                }
            }
        ]);

        let totalSales = 0;
        let totalExpenses = 0;

        summary.forEach((item) => {
            if (item._id === TRANSACTION_TYPES.SALE) {
                totalSales = item.total;
            }

            if (item._id === TRANSACTION_TYPES.EXPENSE) {
                totalExpenses = item.total;
            }
        })

        const profit = totalSales - totalExpenses;

        res.status(200).json({
            totalSales,
            totalExpenses,
            profit
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { createTransaction, getTransaction, getSummary };
// Export the createTransaction, getTransaction, and getSummary functions to be used in other parts of the application