const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const { protect, authorize } = require('../middleware/auth');

router.post('/create', protect, authorize('Client_Admin'), async (req, res) => {
    const { username, password, role, company } = req.body;

    if (role !== 'App_User') {
        return res.status(403).json({ message: 'Client_Admin can only create App_Users' });
    }

    try {
        const user = new User({ username, password, role, company });
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', protect, authorize('Client_Admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user.role !== 'App_User') {
            return res.status(403).json({ message: 'Client_Admin can only delete App_Users' });
        }
        await user.remove();
        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', protect, authorize('Client_Admin'), async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
