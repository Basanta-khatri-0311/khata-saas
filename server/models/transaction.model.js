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
        required: true
    },
    type: {
        type: String,
        enum: Object.values(TRANSACTION_TYPES),
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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Transaction", transactionSchema)