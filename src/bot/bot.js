import TelegramBot from "node-telegram-bot-api";
import { config } from "dotenv";
import Fabric from "./commands/fabric.js";

config();
// Botni yaratish
const bot = new TelegramBot(process.env.TG_BOT_TOKEN, { polling: true });
const fabric = new Fabric(bot);

// Xabarlarni qayta ishlash
bot.on("message", (msg) => {
  fabric.processUpdateMessage(msg, bot);
});

// Xabarlar bo'yicha qo'shimcha ishlov berish
bot.on("callback_query", (query) => {
  fabric.processUpdateCallback(query, bot);
});
