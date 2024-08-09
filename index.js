require('dotenv').config();
const connectDB = require('./config/db');
const express = require('express');
const session = require('express-session');
const axios = require('axios');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');

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
        res.status(500).send('Error fetching data from API');
    }
});

app.get('/', (req, res) => {
    res.send('RMS Backend is Live!');
})

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
