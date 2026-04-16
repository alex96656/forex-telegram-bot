const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { analyzeMarket } = require("./forex");

const app = express();

// Get from Render
const TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

const bot = new TelegramBot(TOKEN);

// Keep server alive
app.get("/", (req, res) => {
    res.send("Bot is running ✅");
});

// Disclaimer
const disclaimer = `
⚠️ DISCLAIMER:
This bot is for educational purposes only.
It does NOT guarantee profit.
Trade at your own risk.
`;

// Main function
async function runBot() {
    const result = await analyzeMarket();

    if (!result) return;

    const message = `
📊 ${result.pair}

${result.signal}

${disclaimer}
    `;

    console.log(message);

    bot.sendMessage(CHAT_ID, message);
}

// Run every 2 minutes
setInterval(runBot, 120000);

// Start server
app.listen(3000, () => {
    console.log("Server started...");
});
