import { Request, Response, NextFunction } from "express";

export const activeOnly = (req: any, res: any, next: NextFunction) => {
    if (req.user && req.user.status === 'active') {
        next();
    } else {
        res.status(403).json({ 
            message: "Account not active. Please wait for administrator approval.",
            status: req.user?.status 
        });
    }
};


