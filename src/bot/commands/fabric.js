import ProductCommand from "./product/getProductsCommand.js";
import StartCommand from "./start/start.js";

class Fabric {
  constructor(bot) {
    this.bot = bot;
    this.messageCommands = [new StartCommand(bot)];
    this.qallbackCommands = [new ProductCommand(bot)];
  }

  processUpdateMessage(message) {
    const chatId = message.chat.id;
    const text = message.text;
    console.log(message);

    for (const command of this.messageCommands) {
      if (command.handle(text)) {
        command.execute(chatId);
        return; // Komanda bajarilgandan keyin sikldan chiqish
      }
    }

    this.bot.sendMessage(chatId, "Bunday komanda mavjud emas.");
  }

  // Agar callback qo'llash kerak bo'lsa
  processUpdateCallback(callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const text = callbackQuery.data;
    console.log(callbackQuery);

    // Callback uchun komandalarni tekshiramiz
    for (const command of this.qallbackCommands) {
      if (command.handle(text)) {
        command.execute(callbackQuery, chatId);
        return;
      }
    }

    // Agar komandani topa olmasak
    this.bot.sendMessage(chatId, "Bunday komanda mavjud emas.");
  }
}

export default Fabric;

// export const processCategory = (query, bot) => {
//   const chatId = query.message.chat.id;
//   const command = new ProductCommand(bot);
//   command.execute(query, chatId);
// };
