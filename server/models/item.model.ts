import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: [true, 'Item name is required'],
        trim: true
    },
    sku: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    sellingPrice: {
        type: Number,
        required: [true, 'Selling price is required'],
        min: [0, 'Price cannot be negative']
    },
    costPrice: {
        type: Number,
        default: 0,
        min: [0, 'Cost cannot be negative']
    },
    stockQuantity: {
        type: Number,
        default: 0,
        min: [0, 'Stock cannot be negative']
    },
    lowStockThreshold: {
        type: Number,
        default: 5
    },
    unit: {
        type: String,
        default: 'pcs'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Item", itemSchema);
