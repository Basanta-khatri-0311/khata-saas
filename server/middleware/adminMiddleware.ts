import { Request, Response, NextFunction } from "express";

export const admin = (req: any, res: any, next: NextFunction) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Admin access required" });
    }
    next();
};



