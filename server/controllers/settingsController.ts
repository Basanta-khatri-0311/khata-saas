import Settings from "../models/settings.model";
import { Request, Response } from "express";

export const getSettings = async (req: any, res: any) => {
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

export const updateSettings = async (req: any, res: any) => {
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


