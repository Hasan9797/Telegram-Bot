import TelegramBot from "node-telegram-bot-api";
import { config } from "dotenv";
import TgCommands from "./commands/botcommands.js";

config();
// Botni yaratish
const bot = new TelegramBot(process.env.TG_BOT_TOKEN, { polling: true });
const tgCommands = new TgCommands(bot);

bot.on("message", (msg) => {
  if (msg.text === "/start") {
    tgCommands.start(msg);
    tgCommands.sendInlineKeyBoard(msg);
  }

  if (msg.text === "uzuk") {
    tgCommands(msg);
  }
});

bot.on("callback_query", (callbackQuery) => {
  const message = callbackQuery.message;
  const data = callbackQuery.data;
  console.log(callbackQuery);
  if (data === "uzuk") {
    bot.sendMessage(message.chat.id, "Siz Tugma Uzuklar ni bosdingiz.");
  } else if (data === "zirak") {
    bot.sendMessage(message.chat.id, "Siz Tugma Zirak ni bosdingiz.");
  }
});
