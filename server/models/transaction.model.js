const mongoose = require("mongoose");
const TRANSACTION_TYPES = require("../constants/transactionTypes")

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: true,
        min: [0.01, 'Amount must be greater than 0.']
    },
    type: {
        type: String,
        enum: ["sale", "expense", "udharo_sale", "udharo_payment"],
        required: true
    },
    category: {
        type: String,
        default: "General"
    },
    note: {
        type: String,
        default: ""
    },
    customerName: {
        type: String,
        default: ""
    },
    customerPhone: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["active", "void", "pending"],
        default: "active"
    },
    recurrence: {
        type: String,
        enum: ["none", "daily", "weekly", "monthly"],
        default: "none"
    },
    nextDueDate: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Transaction", transactionSchema)