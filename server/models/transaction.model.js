const mongoose = require("mongoose");
const TRANSACTION_TYES = require("../constants/transactionTypes")

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        require: true
    },
    type: {
        type: String,
        enum: Object.values(TRANSACTION_TYES),
        require: true
    },
    note: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});


module.exports = mongoose.model("Transaction", transactionSchema)