import mongoose from "mongoose";
import TRANSACTION_TYPES from "../constants/transactionTypes";

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
    items: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
            itemName: { type: String },
            quantity: { type: Number, default: 1 },
            unitPrice: { type: Number, default: 0 }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Transaction", transactionSchema);