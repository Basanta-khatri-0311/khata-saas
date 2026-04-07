const Settings = require("../models/settings.model");

const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateSettings = async (req, res) => {
    try {
        const { businessName, businessSubtitle, incomeCategories, expenseCategories } = req.body;
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
        }
        
        if (businessName !== undefined) settings.businessName = businessName;
        if (businessSubtitle !== undefined) settings.businessSubtitle = businessSubtitle;
        if (incomeCategories !== undefined) settings.incomeCategories = incomeCategories;
        if (expenseCategories !== undefined) settings.expenseCategories = expenseCategories;
        
        await settings.save();
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getSettings, updateSettings };
