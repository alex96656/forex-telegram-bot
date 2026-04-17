const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const { analyzeMarket } = require("./forex");

const app = express();

const TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

const bot = new TelegramBot(TOKEN, { polling: true });

// ✅ START COMMAND (THIS IS WHAT YOU WERE MISSING)
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, "🤖 Bot is now active and connected!");
});

// Web server (Render keeps it alive)
app.get("/", (req, res) => {
    res.send("Forex Bot Running ✅");
});

// Disclaimer
const disclaimer = `
⚠️ DISCLAIMER:
This bot is for educational purposes only.
It does NOT guarantee profit.
Trade at your own risk.
`;

// Main trading function
async function runBot() {
    try {
        const result = await analyzeMarket();

        if (!result) return;

        const message = `
📊 ${result.pair}

${result.signal}

${disclaimer}
        `;

        console.log(message);

        bot.sendMessage(CHAT_ID, message);
    } catch (error) {
        console.log("Error running bot:", error.message);
    }
}

// Run every 2 minutes
setInterval(runBot, 120000);

// Start server
app.listen(3000, () => {
    console.log("Server started...");
});