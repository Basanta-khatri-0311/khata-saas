const express = require("express");
const { getAllUsers, updateUserStatus, deleteUser } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

const adminRoute = express.Router();

adminRoute.get("/users", protect, admin, getAllUsers);
adminRoute.put("/users/:id", protect, admin, updateUserStatus);
adminRoute.delete("/users/:id", protect, admin, deleteUser);

module.exports = adminRoute;
