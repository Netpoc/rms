require('dotenv').config();
const connectDB = require('./config/db');
const express = require('express');
const session = require('express-session');
const axios = require('axios');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser')
const User = require('./models/userModel')

const app = express();

connectDB();

const authRoutes = require('./routes/auth');
const superAdminRoutes = require('./routes/superAdmin');
const clientAdminRoutes = require('./routes/clientAdmin');
const adminRoutes = require('./routes/admin');

app.use(helmet());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
    // Set custom name for the session cookie
    name: 'siteSessionId',
    // a secure key for session encrption
    secret: process.env.SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
    // Additional session configuration
}));
app.use(cors());
const port = process.env.PORT || 3000;

// Use environment variables
const apiEndpoint = process.env.URL_FLESPI;
const authorizationKey = process.env.AUTH;
const durationApi = 'https://flespi.io/gw/calcs/1704940/devices/5848395/intervals/10';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/clientadmin', clientAdminRoutes);
app.use('/api/admin', adminRoutes);


app.get('/api/data', async (req, res) => {
    try {
        const response = await axios.get(apiEndpoint, {
            headers: {
                'Authorization': authorizationKey
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data from API:', error);
        res.status(500).send('Error fetching data from API');
    }
});

app.post('/create-super-admin', async (req, res) => {
    const { username, password, name, surname, phone } = req.body;

    try {
        const superAdminExists = await User.findOne({ role: 'Super_Admin' });
        if (superAdminExists) {
            return res.status(400).json({ message: 'Super_Admin already exists' });
        }

        const user = new User({ username, password, role: 'Super_Admin', name, surname, phone });
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/duration', async (req, res)=> {
    try {
        const duration = await axios.get(durationApi, {
            header: {
                'Authorization': authorizationKey
            }
        });
        res.json(duration.data);
    } catch (error) {
        console.error('Error fetching data from API:', error);
        res.status(500).send('Error fetching data from API');
    }
})


app.get('/', (req, res) => {
    res.send('RMS Backend is Live!');
})

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
