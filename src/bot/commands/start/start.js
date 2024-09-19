import { categories } from "../../../services/categories.js";

class StartCommands {
  constructor(bot) {
    this.bot = bot;
  }

  handle(text) {
    return text === "/start" || text === "🏠 Bosh sahifa"; // Bu misol faqat '/start' komandasini tekshiradi
  }

  // 1. sendMessage - oddiy xabar yuborish
  execute(chatId) {
    this.bot.sendMessage(
      chatId,
      "Assalomu alaykum! Anvar Jiggani botiga xush kelibsiz ))\nKategoriyalardan birini tanlang: ",
      {
        reply_markup: {
          remove_keyboard: true,
          inline_keyboard: [
            [
              { text: "💫 Uzuk", callback_data: "cate_uzuk_1" },
              { text: "⛓ Zirak", callback_data: "cate_zirak_2" },
            ],
            [
              { text: "💫 Bo'yin Tumor", callback_data: "cate_tumor_3" },
              { text: "⛓ Braslit", callback_data: "cate_braslit_4" },
            ],
          ],
        },
      }
    );
  }
}

export default StartCommands;
