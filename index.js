const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const OpenAI = require("openai");

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// عندما المستخدم يرسل صورة
bot.on("photo", async (msg) => {
  const chatId = msg.chat.id;

  // Tell user it's working
  bot.sendMessage(chatId, "Analyzing chart... 📊");

  try {
    const fileId = msg.photo[msg.photo.length - 1].file_id;

    // Get file link from Telegram
    const fileUrl = await bot.getFileLink(fileId);

    // Send image to OpenAI
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Analyze this forex chart and give a simple trading idea (buy/sell, trend, entry, TP, SL).",
            },
            {
              type: "input_image",
              image_url: fileUrl,
            },
          ],
        },
      ],
    });

    const result = response.output_text;

    // Send result back to user
    bot.sendMessage(chatId, result);

  } catch (error) {
    console.log(error);
    bot.sendMessage(chatId, "❌ Error analyzing chart. Try again.");
  }
});