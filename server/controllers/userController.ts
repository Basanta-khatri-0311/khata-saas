const User = require("../models/user.model");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password").sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, role } = req.body;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (status) user.status = status;
        if (role) user.role = role;

        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Don't let admins delete themselves
        if (id === req.user.id) return res.status(400).json({ error: "You cannot delete yourself" });
        
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllUsers, updateUserStatus, deleteUser };
