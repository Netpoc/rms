require('dotenv').config();
const connectDB = require('./config/db');
const express = require('express');
const session = require('express-session');
const axios = require('axios');
const helmet = require('helmet');
const cors = require('cors');
const userRouter = require('./services/userManagement')
const bodyParser = require('body-parser')
const faker = require('faker')
const app = express();

const deviceRoute = require('./routes/deviceRoutes');

connectDB();

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
const authorizationKey = process.env.AUTH

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

app.use('/api', userRouter)
app.use('/api', deviceRoute)

app.get('/', (req, res) => {
    res.send('RMS Backend is Live!');
})

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
