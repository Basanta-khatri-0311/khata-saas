const Settings = require("../models/settings.model");

const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne({ user: req.user.id });
        if (!settings) {
            settings = await Settings.create({ user: req.user.id });
        }
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateSettings = async (req, res) => {
    try {
        const { businessName, businessSubtitle, businessPhone, incomeCategories, expenseCategories, language } = req.body;
        let settings = await Settings.findOne({ user: req.user.id });
        if (!settings) {
            settings = new Settings({ user: req.user.id });
        }
        
        if (businessName !== undefined) settings.businessName = businessName;
        if (businessSubtitle !== undefined) settings.businessSubtitle = businessSubtitle;
        if (businessPhone !== undefined) settings.businessPhone = businessPhone;
        if (incomeCategories !== undefined) settings.incomeCategories = incomeCategories;
        if (expenseCategories !== undefined) settings.expenseCategories = expenseCategories;
        if (language !== undefined) settings.language = language;
        
        await settings.save();
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getSettings, updateSettings };
