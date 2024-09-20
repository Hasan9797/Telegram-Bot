import ProductCommand from "./product/getProductsCommand.js";
import StartCommand from "./start/start.js";
import ProductCoundCommand from "./product/productCount.js";
import OrderCommand from "./order/addOrder.js";

class Fabric {
  constructor(bot) {
    this.bot = bot;
    this.messageCommands = [new StartCommand(bot)];
    this.callbackCommands = [
      new ProductCommand(bot),
      new ProductCoundCommand(bot),
      new OrderCommand(bot),
    ];
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
  async processUpdateCallback(callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const text = callbackQuery.data;

    console.log("Received callbackQuery:", callbackQuery);

    for (const command of this.callbackCommands) {
      console.log("Checking callback command:", command.constructor.name);
      if (await command.handle(text)) {
        console.log("Callback Command matched:", command.constructor.name);
        command.execute(callbackQuery, chatId);
        return; // Komanda bajarilgandan keyin sikldan chiqish
      }
    }

    this.bot.sendMessage(chatId, "Bunday komanda mavjud emas.");
  }

  saveMessage(chatId, messageId) {
    const key = `chat:${chatId}`;
    client.rpush(key, messageId);
  }

  async deleteAllMessages(chatId) {
    const key = `chat:${chatId}`;

    // Redisdan barcha message_id larni olish
    client.lrange(key, 0, -1, (err, messageIds) => {
      if (err) {
        console.error(err);
        return;
      }

      messageIds.forEach((messageId) => {
        bot.deleteMessage(chatId, messageId);
      });

      // O'chirilgandan so'ng, Redisdan ham xabarlarni o'chirish
      client.del(key);
    });
  }
}

export default Fabric;
