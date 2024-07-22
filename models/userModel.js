const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, trim: true, unique: true},
    password: {type: String, required: true},
    role: {
        type: String,
        enum: ['Super_Admin', 'Technician', 'Admin', 'Client_Admin', 'App_User'],
        required: true,
        default: 'App_User'
    },
    company: {
        name: String,
        address: String,
        phone: String,
        email: String,
        
    },
    bio: {
        firstName: String,
        lastName: String,
        phoneNumber: String,
        address: String
    }
},{
    timestamps: true
});

//Hash Password before saving
userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model('User', userSchema)

module.exports = User;