const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { 
    createTransaction, 
    getTransactions, 
    getSummary, 
    deleteTransaction, 
    getDayBookSummary 
} = require("../controllers/transactionController");

const transactionRoute = express.Router();

transactionRoute.post("/", protect, createTransaction);
transactionRoute.get("/", protect, getTransactions);
transactionRoute.get("/summary", protect, getSummary);
transactionRoute.get("/daybook", protect, getDayBookSummary);
transactionRoute.delete("/:id", protect, deleteTransaction);

module.exports = transactionRoute;