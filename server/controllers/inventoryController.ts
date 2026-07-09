import Item from "../models/item.model";
import { Request, Response } from "express";

// Get all items for the user
export const getItems = async (req: any, res: any) => {
    try {
        const items = await Item.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create a new item
export const createItem = async (req: any, res: any) => {
    try {
        const { name, sku, description, sellingPrice, costPrice, stockQuantity, lowStockThreshold, unit } = req.body;

        if (!name || sellingPrice === undefined || sellingPrice === null || sellingPrice === '') {
            return res.status(400).json({ error: 'Name and selling price are required.' });
        }

        const item = await Item.create({
            user: req.user.id,
            name,
            sku,
            description,
            sellingPrice,
            costPrice: costPrice || 0,
            stockQuantity: stockQuantity || 0,
            lowStockThreshold: lowStockThreshold || 5,
            unit: unit || 'pcs'
        });

        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update an item
export const updateItem = async (req: any, res: any) => {
    try {
        const item = await Item.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete an item
export const deleteItem = async (req: any, res: any) => {
    try {
        const item = await Item.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.status(200).json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Adjust stock (add or remove units)
export const adjustStock = async (req: any, res: any) => {
    try {
        const { adjustment, reason } = req.body; // adjustment can be positive or negative
        if (adjustment === undefined || adjustment === null || adjustment === '') {
            return res.status(400).json({ error: 'Adjustment quantity is required.' });
        }

        const adjNum = Number(adjustment);
        if (isNaN(adjNum) || adjNum === 0) {
            return res.status(400).json({ error: 'Adjustment must be a non-zero number.' });
        }

        const item = await Item.findOne({ _id: req.params.id, user: req.user.id });
        if (!item) return res.status(404).json({ error: 'Item not found' });

        const newQty = item.stockQuantity + adjNum;
        if (newQty < 0) {
            return res.status(400).json({ error: `Cannot reduce stock below 0. Current stock: ${item.stockQuantity}` });
        }

        item.stockQuantity = newQty;
        await item.save();
        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get inventory summary (low stock alerts etc.)
export const getInventorySummary = async (req: any, res: any) => {
    try {
        const items = await Item.find({ user: req.user.id });
        const totalItems = items.length;
        const totalStockValue = items.reduce((sum, item) => sum + (item.stockQuantity * item.costPrice), 0);
        const totalRetailValue = items.reduce((sum, item) => sum + (item.stockQuantity * item.sellingPrice), 0);
        const lowStockItems = items.filter(item => item.stockQuantity > 0 && item.stockQuantity <= item.lowStockThreshold);
        const outOfStockItems = items.filter(item => item.stockQuantity === 0);

        res.status(200).json({
            totalItems,
            totalStockValue,
            totalRetailValue,
            lowStockCount: lowStockItems.length,
            outOfStockCount: outOfStockItems.length,
            lowStockItems
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


