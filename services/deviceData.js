const faker = require('faker');
const moment = require('moment');

// Function to generate fake Flespi data
const generateFakeFlespiData = () => {
    return {
        "ident": faker.datatype.uuid(),
        "timestamp": faker.date.recent().getTime(),
        "priority": faker.datatype.number({ min: 0, max: 3 }),
        "protocol_id": faker.datatype.number(),
        "device_id": faker.datatype.uuid(),
        "channel_id": faker.datatype.uuid(),
        "project_id": faker.datatype.uuid(),
        "device_name": faker.vehicle.vin(),
        "position": {
            "latitude": faker.address.latitude(),
            "longitude": faker.address.longitude(),
            "altitude": faker.datatype.number({ min: 0, max: 10000 }),
            "direction": faker.datatype.number({ min: 0, max: 360 }),
            "satellites": faker.datatype.number({ min: 0, max: 12 }),
            "speed": faker.datatype.number({ min: 0, max: 200 })
        },
        "fuel": {
            "level": faker.datatype.number({ min: 0, max: 100 }),
            "consumption": faker.datatype.number({ min: 0, max: 100 })
        },
        "battery": {
            "level": faker.datatype.number({ min: 0, max: 100 }),
            "voltage": faker.datatype.number({ min: 0, max: 24, precision: 0.1 })
        },
        "ignition": faker.datatype.boolean(),
        "temperature": faker.datatype.number({ min: -40, max: 85, precision: 0.1 }),
        "custom": {
            "param1": faker.datatype.number(),
            "param2": faker.datatype.uuid()
        }
    };
};

exports.getData = [ async (req, res) =>{
    try {
        const data = await generateFakeFlespiData();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({err: error.message})
    }
}]


// Initialize variables
let tankLevel = 10; // initial tank level in liters
let din1TotalTime = 0;
let din1RemainingTime = 9 * 60; // 9 hours in minutes
let din2Duration = 0;
let startTime = moment();
const din1Periods = [];
const INTERVAL = 1; // 5 minutes

// Function to generate random intervals for Din 1
function generateDin1Intervals() {
    while (din1RemainingTime > 0) {
        const duration = Math.min(din1RemainingTime, Math.floor(Math.random() * 60) + 1); // 1 to 60 minutes
        din1Periods.push({
            start: moment().startOf('day').add(Math.floor(Math.random() * 24), 'hours').add(Math.floor(Math.random() * 60), 'minutes'),
            duration
        });
        din1RemainingTime -= duration;
    }
}

// Check if Din 1 should be true
function isDin1Active(currentTime) {
    return din1Periods.some(period => {
        const end = period.start.clone().add(period.duration, 'minutes');
        return currentTime.isBetween(period.start, end);
    });
}

// Reset function to run every 24 hours
function reset() {
    tankLevel = 10000;
    din1TotalTime = 0;
    din1RemainingTime = 9 * 60;
    din1Periods.length = 0;
    generateDin1Intervals();
    startTime = moment();
}

// Generate Din 1 intervals initially
generateDin1Intervals();

// Function to simulate data every 5 minutes
function simulateData() {
    const currentTime = moment();
    if (currentTime.diff(startTime, 'hours') >= 24) {
        reset();
    }

    const din1 = isDin1Active(currentTime);
    const din2 = Math.random() < 0.5 && din2Duration < 20 * 60; // Din 2 true for at most 20 minutes in total

    if (din2) {
        din2Duration += INTERVAL;
        tankLevel -= (108 / 60) * INTERVAL; // Reduce tank level at a rate of 108 liters/hour
    }

    // Ensure tank level doesn't go below 0
    if (tankLevel < 0) tankLevel = 0;

    const data = {
        timestamp: currentTime.format(),
        tankLevel,
        din1,
        din2,
        din2Duration,
        din1TotalTime,

    };

    console.log(data);
}

// Run simulation every 5 minutes
setInterval(simulateData, INTERVAL * 60 * 1000);

// Initial run
simulateData();
