const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    businessName: { type: String, default: "Khata" },
    businessPhone: { type: String, default: "" },
    businessSubtitle: { type: String, default: "खाता प्रणाली" },
    incomeCategories: { type: [String], default: ["General Income", "Sales", "Services"] },
    expenseCategories: { type: [String], default: ["General Expense", "Rent", "Khaja", "Salary", "Internet"] }
}, { timestamps: true });

module.exports = mongoose.model("Settings", settingsSchema);
