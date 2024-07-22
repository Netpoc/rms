const Device = require('../services/deviceData');
const express = require('express');

const router = express.Router();

router.get('/device', Device.getData)

module.exports = router;