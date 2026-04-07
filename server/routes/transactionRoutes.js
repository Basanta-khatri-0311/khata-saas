const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { 
    createTransaction, 
    getTransactions, 
    getSummary, 
    deleteTransaction, 
    updateTransaction,
    getDayBookSummary 
} = require("../controllers/transactionController");

const transactionRoute = express.Router();

transactionRoute.post("/", protect, createTransaction);
transactionRoute.get("/", protect, getTransactions);
transactionRoute.get("/summary", protect, getSummary);
transactionRoute.get("/daybook", protect, getDayBookSummary);
transactionRoute.put("/:id", protect, updateTransaction);
transactionRoute.delete("/:id", protect, deleteTransaction);

module.exports = transactionRoute;