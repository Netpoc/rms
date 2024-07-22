/**
 * Super User Application Logic
 */
const express = require('express');
const jwt = require ('jsonwebtoken');
const bcrypt = require('bcrypt');
const User =  require('../models/userModel');
const { auth, authorize} = require('../middleware/auth');

const router = express.Router();

//User Registration
router.post('/users/register', auth, authorize('Super_Admin','Client_Admin','Admin'), async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = jwt.sign({_id: user._id.toString() }, process.env.JWT_SECRET);
        res.status(201).send({ user, token});
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports = router;