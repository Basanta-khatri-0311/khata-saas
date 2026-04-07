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

const { activeOnly } = require("../middleware/statusMiddleware");

const transactionRoute = express.Router();

transactionRoute.post("/", protect, activeOnly, createTransaction);
transactionRoute.get("/", protect, activeOnly, getTransactions);
transactionRoute.get("/summary", protect, activeOnly, getSummary);
transactionRoute.get("/daybook", protect, activeOnly, getDayBookSummary);
transactionRoute.put("/:id", protect, activeOnly, updateTransaction);
transactionRoute.delete("/:id", protect, activeOnly, deleteTransaction);

module.exports = transactionRoute;