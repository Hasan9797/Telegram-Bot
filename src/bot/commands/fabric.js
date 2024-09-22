import ProductCommand from "./product/getProductsCommand.js";
import StartCommand from "./start/start.js";
import ProductCountCommand from "./product/productCount.js";
import OrderCommand from "./order/addOrder.js";
import GetOrderCommand from "./order/getOrder.js";

class Fabric {
  constructor(bot) {
    this.bot = bot;
    this.messageCommands = [new StartCommand(bot), new GetOrderCommand(bot)];
    this.callbackCommands = [
      new ProductCommand(bot),
      new ProductCountCommand(bot),
      new OrderCommand(bot),
    ];
  }

  processUpdateMessage(message) {
    const chatId = message.chat.id;
    const text = message.text;

    console.log(message);

    for (const command of this.messageCommands) {
      if (command.handle(text)) {
        command.execute(message, chatId);
        return;
      }
    }

    this.bot.sendMessage(chatId, "Bunday komanda mavjud emas.");
  }

  async processUpdateCallback(callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const text = callbackQuery.data;

    console.log("Received callbackQuery:", callbackQuery);

    for (const command of this.callbackCommands) {
      console.log("Checking callback command:", command.constructor.name);
      if (await command.handle(text)) {
        console.log("Callback Command matched:", command.constructor.name);
        command.execute(callbackQuery, chatId);
        return;
      }
    }

    this.bot.sendMessage(chatId, "Bunday komanda mavjud emas.");
  }
}

export default Fabric;
