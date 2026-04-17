const axios = require("axios");

const API_KEY = process.env.API_KEY;

async function getForexData() {
    const url = `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=EUR&to_symbol=USD&apikey=${API_KEY}`;

    const res = await axios.get(url);
    const data = res.data["Time Series FX (Daily)"];

    if (!data) return null;

    const prices = Object.values(data).map(d => parseFloat(d["4. close"]));

    return prices.slice(0, 50);
}

function movingAverage(data, period) {
    return data.slice(0, period).reduce((a, b) => a + b, 0) / period;
}

async function analyzeMarket() {
    const prices = await getForexData();

    if (!prices) return null;

    const shortMA = movingAverage(prices, 5);
    const longMA = movingAverage(prices, 20);

    return {
        pair: "EUR/USD",
        signal: shortMA > longMA ? "BUY 📈" : "SELL 📉"
    };
}

module.exports = { analyzeMarket };