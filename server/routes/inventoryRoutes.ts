import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
    getItems,
    createItem,
    updateItem,
    deleteItem,
    adjustStock,
    getInventorySummary
} from '../controllers/inventoryController';


const inventoryRoute = express.Router();


inventoryRoute.get('/', protect, getItems);
inventoryRoute.get('/summary', protect, getInventorySummary);
inventoryRoute.post('/', protect, createItem);
inventoryRoute.put('/:id', protect, updateItem);
inventoryRoute.put('/:id/adjust', protect, adjustStock);
inventoryRoute.delete('/:id', protect, deleteItem);


export default inventoryRoute;
