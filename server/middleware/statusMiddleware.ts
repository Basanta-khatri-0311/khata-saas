const activeOnly = (req, res, next) => {
    if (req.user && req.user.status === 'active') {
        next();
    } else {
        res.status(403).json({ 
            message: "Account not active. Please wait for administrator approval.",
            status: req.user?.status 
        });
    }
};

module.exports = { activeOnly };
