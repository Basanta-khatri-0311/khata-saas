const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "30d" });
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }
        
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        // Logic for first admin only
        let finalRole = "user";
        let finalStatus = "pending";
        
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount === 0 && req.body.role === 'admin') {
            finalRole = 'admin';
            finalStatus = req.body.status || 'active'; // Allow passing status too if they want
        }

        const user = await User.create({ name, email, password, role: finalRole, status: finalStatus });
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || "Registration failed" });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            if (user.status === 'suspended') {
                return res.status(403).json({ message: "Your account has been suspended. Please contact admin." });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

module.exports = { registerUser, loginUser, getMe };
