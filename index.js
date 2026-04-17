const TelegramBot = require("node-telegram-bot-api");
const { analyzeMarket } = require("./forex"); // your analysis file

// 🔑 Token from Render environment variables
const TOKEN = process.env.BOT_TOKEN;

// 🚀 Start bot with polling (VERY IMPORTANT)
const bot = new TelegramBot(TOKEN, { polling: true });

console.log("🤖 Bot is starting...");

// ===============================
// 📩 TEXT MESSAGE HANDLER
// ===============================
bot.on("message", async (msg) => {
    const chatId = msg.chat.id;

    console.log("Message received:", msg.text);

    if (!msg.text) return;

    bot.sendMessage(chatId, "Send me a chart image 📊 for analysis.");
});


// ===============================
// 🖼️ PHOTO / CHART HANDLER
// ===============================
bot.on("photo", async (msg) => {
    const chatId = msg.chat.id;

    console.log("Chart image received");

    try {
        // Get highest quality image
        const fileId = msg.photo[msg.photo.length - 1].file_id;

        bot.sendMessage(chatId, "Analyzing chart... 📊");

        // OPTIONAL: download file URL (if needed later)
        const fileLink = await bot.getFileLink(fileId);

        console.log("Image URL:", fileLink);

        // 🔥 CALL YOUR ANALYSIS FUNCTION HERE
        const result = await analyzeMarket(fileLink);

        bot.sendMessage(chatId, result);

    } catch (error) {
        console.error("Analysis error:", error);
        bot.sendMessage(chatId, "❌ Error analyzing chart. Try again.");
    }
});


// ===============================
// ✅ START MESSAGE
// ===============================
console.log("🤖 Bot is now active and connected!");