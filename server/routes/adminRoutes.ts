import express from "express";
import { getAllUsers, updateUserStatus, deleteUser } from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";
import { admin } from "../middleware/adminMiddleware";

const adminRoute = express.Router();

adminRoute.get("/users", protect, admin, getAllUsers);
adminRoute.put("/users/:id", protect, admin, updateUserStatus);
adminRoute.delete("/users/:id", protect, admin, deleteUser);

export default adminRoute;
