/**
 * Authentication middleware
 */
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const auth = async(req, res, next) => {
    try {        
       const token = req.header('Authorization').replace('Bearer ','');
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token });
        if(!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        console.log(req.body)
        res.status(401).send({ error: 'Please authenticate.'});
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.roles)) {
            return res.status(403).send({error: 'Forbidden'});
        }
        next();
    };
};

module.exports = { auth, authorize };