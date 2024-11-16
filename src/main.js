//use NPM RUN DEV to run the server

import { getLatestAirQualityData, getAirQualityDataByTimeRange } from './firebase.js';

window.tvoc = null;
window.eco2 = null;
window.pm10 = null;
window.pm1_0 = null;
window.pm2_5 = null;
window.timestamp = null;

// Example async function to fetch and display data
async function displayAirQualityData() {
    try {
        // Get latest 10 readings
        const latestData = await getLatestAirQualityData(1);
        latestData.forEach(reading => {
            tvoc = reading.TVOC;
            eco2 = reading.eCO2;
            pm10 = reading.pm10;
            pm1_0 = reading.pm1_0;
            pm2_5 = reading.pm2_5;
            timestamp = reading.timestamp;
        });

        // Do something with the data
        console.log('Latest readings:', latestData);

        // You could update your UI here
        latestData.forEach(reading => {
            console.log(`
            TVOC: ${tvoc}, 
            eCO2: ${eco2},
            PM10: ${pm10},
            PM1.0: ${pm1_0},
            PM2.5: ${pm2_5},
            timestamp: ${timestamp}`);

            // TVOC: ${reading.TVOC}, 
            // eCO2: ${reading.eCO2},
            // PM10: ${reading.pm10},
            // PM1.0: ${reading.pm1_0},
            // PM2.5: ${reading.pm2_5},
            // timestamp: ${reading.timestamp}`);
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

async function startDataPolling() {
    // Initial call
    await displayAirQualityData();

    // Call every 30 seconds
    setInterval(async () => {
        await displayAirQualityData();
    }, 10000);
}

// Start the polling
startDataPolling();