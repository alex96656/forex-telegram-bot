const axios = require("axios");

const API_KEY = process.env.API_KEY;

// ==========================
// 📊 GET MARKET DATA
// ==========================
async function getForexData() {
    try {
        const url = `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=EUR&to_symbol=USD&apikey=${API_KEY}`;

        const res = await axios.get(url);

        const data = res.data["Time Series FX (Daily)"];

        if (!data) {
            console.log("No data from API");
            return null;
        }

        const prices = Object.values(data)
            .map(d => parseFloat(d["4. close"]))
            .filter(Boolean);

        return prices.slice(0, 50);

    } catch (error) {
        console.error("API ERROR:", error.message);
        return null;
    }
}

// ==========================
// 📉 MOVING AVERAGE
// ==========================
function movingAverage(data, period) {
    if (!data || data.length < period) return null;

    const slice = data.slice(0, period);
    return slice.reduce((a, b) => a + b, 0) / period;
}

// ==========================
// 📊 MAIN ANALYSIS FUNCTION
// ==========================
async function analyzeMarket() {
    try {
        const prices = await getForexData();

        if (!prices || prices.length < 20) {
            return "❌ Market data not available (API missing or low data)";
        }

        const shortMA = movingAverage(prices, 5);
        const longMA = movingAverage(prices, 20);

        if (!shortMA || !longMA) {
            return "❌ Not enough data for analysis";
        }

        return {
            pair: "EUR/USD",
            signal: shortMA > longMA ? "BUY 📈" : "SELL 📉",
            shortMA: shortMA.toFixed(5),
            longMA: longMA.toFixed(5)
        };

    } catch (error) {
        console.error("ANALYSIS ERROR:", error);
        return "❌ Error analyzing market";
    }
}

// ==========================
// 📤 EXPORT
// ==========================
module.exports = { analyzeMarket };