// Import necessary functions
import { getLatestAirQualityData, getAirQualityDataByTimeRange } from './firebase.js';

// Global variables
window.tvoc = null;
window.eco2 = null;
window.pm10 = null;
window.pm1_0 = null;
window.pm2_5 = null;
window.timestamp = null;

// Breakpoints for pollutants
const breakpoints = {
    pm25: [
        { concentration: 0.0, index: 0 },
        { concentration: 12.0, index: 50 },
        { concentration: 35.4, index: 100 },
        { concentration: 55.4, index: 150 },
        { concentration: 150.4, index: 200 },
        { concentration: 250.4, index: 300 },
        { concentration: 500.4, index: 500 },
    ],
    pm10: [
        { concentration: 0, index: 0 },
        { concentration: 54, index: 50 },
        { concentration: 154, index: 100 },
        { concentration: 254, index: 150 },
        { concentration: 354, index: 200 },
        { concentration: 424, index: 300 },
        { concentration: 604, index: 500 },
    ],
    tvoc: [
        { concentration: 0, index: 0 },
        { concentration: 220, index: 50 },
        { concentration: 660, index: 100 },
        { concentration: 2200, index: 150 },
        { concentration: 5500, index: 200 },
        { concentration: 11000, index: 300 },
        { concentration: 30000, index: 500 },
    ],
    eco2: [
        { concentration: 400, index: 0 },
        { concentration: 600, index: 50 },
        { concentration: 1000, index: 100 },
        { concentration: 1500, index: 150 },
        { concentration: 2000, index: 200 },
        { concentration: 5000, index: 300 },
        { concentration: 10000, index: 500 },
    ],
    pm1_0: [
        { concentration: 0.0, index: 0 },
        { concentration: 12.0, index: 50 },
        { concentration: 35.4, index: 100 },
        { concentration: 55.4, index: 150 },
        { concentration: 150.4, index: 200 },
        { concentration: 250.4, index: 300 },
        { concentration: 500.4, index: 500 },
    ],
};

// Function to calculate sub-index
function calculateSubIndex(concentration, pollutant) {
    const bp = breakpoints[pollutant];
    for (let i = 0; i < bp.length - 1; i++) {
        if (concentration >= bp[i].concentration && concentration <= bp[i + 1].concentration) {
            const I_hi = bp[i + 1].index;
            const I_lo = bp[i].index;
            const C_hi = bp[i + 1].concentration;
            const C_lo = bp[i].concentration;
            const C_p = concentration;
            const I_p = ((I_hi - I_lo) / (C_hi - C_lo)) * (C_p - C_lo) + I_lo;
            return Math.round(I_p);
        }
    }
    // If concentration is above highest breakpoint
    return bp[bp.length - 1].index;
}

// Example async function to fetch and display data
async function displayAirQualityData() {
    try {
        // Get latest reading
        const latestData = await getLatestAirQualityData(1);
        latestData.forEach(reading => {
            tvoc = reading.TVOC;
            eco2 = reading.eCO2;
            pm10 = reading.pm10;
            pm1_0 = reading.pm1_0;
            pm2_5 = reading.pm2_5;
            timestamp = reading.timestamp;
        });

        // Calculate sub-indices
        const subIndexPM1_0 = calculateSubIndex(pm1_0, 'pm1_0');
        const subIndexPM2_5 = calculateSubIndex(pm2_5, 'pm25');
        const subIndexPM10 = calculateSubIndex(pm10, 'pm10');
        const subIndexTVOC = calculateSubIndex(tvoc, 'tvoc');
        const subIndexeCO2 = calculateSubIndex(eco2, 'eco2');

        // Calculate maximum sub-index
        const maxSubIndex = Math.max(subIndexPM1_0, subIndexPM2_5, subIndexPM10, subIndexTVOC, subIndexeCO2);

        // Output the results
        console.log('Latest readings:', latestData);

        console.log(`
        TVOC: ${tvoc} ppb, 
        eCO2: ${eco2} ppm,
        PM10: ${pm10} µg/m³,
        PM1.0: ${pm1_0} µg/m³,
        PM2.5: ${pm2_5} µg/m³,
        Timestamp: ${new Date(timestamp)}
        `);

        console.log(`
        Sub-Indices:
        PM1.0 Index: ${subIndexPM1_0}
        PM2.5 Index: ${subIndexPM2_5}
        PM10 Index: ${subIndexPM10}
        TVOC Index: ${subIndexTVOC}
        eCO₂ Index: ${subIndexeCO2}
        `);

        console.log(`Overall AQI (Maximum Sub-Index): ${maxSubIndex}`);

        // Update your UI here with the AQI and pollutant data

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
    }, 30000);
}

// Start the polling
startDataPolling();