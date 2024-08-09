const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const { protect, authorize } = require('../middleware/auth');

router.post('/create', protect, authorize('Admin'), async (req, res) => {
    const { username, password, role, company, name, surname, phone } = req.body;

    if (role === 'Super_Admin' || role === 'Client_Admin') {
        return res.status(403).json({ message: 'Admin cannot create Super_Admin or Client_Admin' });
    }

    try {
        const user = new User({ username, password, role, company, name, surname, phone });
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', protect, authorize('Admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user.role === 'Super_Admin' || user.role === 'Client_Admin') {
            return res.status(403).json({ message: 'Admin cannot delete Super_Admin or Client_Admin' });
        }
        await user.remove();
        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/:id', protect, authorize('Admin'), async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
