const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
    businessName: { type: String, default: "Khata" },
    businessSubtitle: { type: String, default: "खाता प्रणाली" },
    incomeCategories: { type: [String], default: ["General Income", "Sales", "Services"] },
    expenseCategories: { type: [String], default: ["General Expense", "Rent", "Khaja", "Salary", "Internet"] }
}, { timestamps: true });

module.exports = mongoose.model("Settings", settingsSchema);
