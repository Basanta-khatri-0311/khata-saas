import express from "express";
import { protect } from "../middleware/authMiddleware";
import { 
    createTransaction, 
    getTransactions, 
    getSummary, 
    deleteTransaction, 
    updateTransaction,
    getDayBookSummary,
    verifyTransaction,
    scanReceipt
} from "../controllers/transactionController";
import { activeOnly } from "../middleware/statusMiddleware";
import multer from "multer";

const transactionRoute = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

transactionRoute.post("/", protect, activeOnly, createTransaction);
transactionRoute.post("/scan", protect, upload.single('receipt'), scanReceipt);
transactionRoute.get("/", protect, activeOnly, getTransactions);
transactionRoute.get("/summary", protect, activeOnly, getSummary);
transactionRoute.get("/daybook", protect, activeOnly, getDayBookSummary);
transactionRoute.put("/:id", protect, activeOnly, updateTransaction);
transactionRoute.put("/:id/verify", protect, verifyTransaction);
transactionRoute.delete("/:id", protect, activeOnly, deleteTransaction);

export default transactionRoute;