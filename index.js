const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
