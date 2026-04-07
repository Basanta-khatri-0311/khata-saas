const express = require("express");

const transactionRoute = express.Router(); // Create a new router instance for handling transaction-related routes

const { createTransaction, getTransaction, getSummary, deleteTransaction } = require("../controllers/transactionController");



transactionRoute.post("/",  createTransaction); 
// POST route for creating a transaction, which calls the createTransaction controller function

transactionRoute.get("/", getTransaction); 
// GET route for retrieving transactions, which calls the getTransaction controller function

transactionRoute.get("/summary", getSummary); // GET route for retrieving the transaction summary, which calls the getSummary controller function

transactionRoute.delete("/:id", deleteTransaction) 
module.exports = transactionRoute; 
// Export the transactionRoute to be used in other parts of the application