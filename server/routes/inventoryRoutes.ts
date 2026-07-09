const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    getItems,
    createItem,
    updateItem,
    deleteItem,
    adjustStock,
    getInventorySummary
} = require('../controllers/inventoryController');

const inventoryRoute = express.Router();

inventoryRoute.get('/', protect, getItems);
inventoryRoute.get('/summary', protect, getInventorySummary);
inventoryRoute.post('/', protect, createItem);
inventoryRoute.put('/:id', protect, updateItem);
inventoryRoute.put('/:id/adjust', protect, adjustStock);
inventoryRoute.delete('/:id', protect, deleteItem);

module.exports = inventoryRoute;
