import categoryService from "../../../services/categories.js";

class StartCommands {
  constructor(bot) {
    this.bot = bot;
  }

  handle(text) {
    return text === "/start" || text === "🏠 Bosh sahifa";
  }

  async execute(chatId) {
    try {
      const categories = await categoryService.getCategory(); // Kategoriyalarni olish
      const inlineKeyboard = [];

      // Har bir ikkita kategoriya uchun yangi qator qo'shish
      for (let i = 0; i < categories.length; i += 2) {
        const row = [];
        row.push({
          text: `${categories[i].img} ${categories[i].name}`, // Kategoriyaning nomini qo'shish
          callback_data: `cate_${categories[i].id}`,
        });

        if (i + 1 < categories.length) {
          // Agar ikkinchi kategoriya mavjud bo'lsa
          row.push({
            text: `${categories[i + 1].img} ${categories[i + 1].name}`,
            callback_data: `cate_${categories[i + 1].id}`,
          });
        }

        inlineKeyboard.push(row); // Qatorni inline keyboard ga qo'shish
      }

      this.bot.sendMessage(
        chatId,
        "Assalomu alaykum! Anvar Jiggani botiga xush kelibsiz ))\nKategoriyalardan birini tanlang: ",
        {
          reply_markup: {
            remove_keyboard: true,
            inline_keyboard: inlineKeyboard,
          },
        }
      );
    } catch (error) {
      console.error("Kategoriyalarni olishda xato:", error);
      this.bot.sendMessage(chatId, "Kategoriyalarni olishda xato yuz berdi.");
    }
  }
}
export default StartCommands;
