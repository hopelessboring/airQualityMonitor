//use NPM RUN DEV to run the server

import { getLatestAirQualityData, getAirQualityDataByTimeRange } from './firebase.js';

// Example async function to fetch and display data
async function displayAirQualityData() {
    try {
        // Get latest 10 readings
        const latestData = await getLatestAirQualityData(1);

        // Do something with the data
        console.log('Latest readings:', latestData);

        // You could update your UI here
        latestData.forEach(reading => {
            console.log(`
                TVOC: ${reading.TVOC}, 
                eCO2: ${reading.eCO2},
                PM10: ${reading.pm10},
                PM1.0: ${reading.pm1_0},
                PM2.5: ${reading.pm2_5},
                timestamp: ${reading.timestamp}`);
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

// Call the function
displayAirQualityData();