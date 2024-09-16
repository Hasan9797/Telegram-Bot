import Tgcommand from "../commands/botcommands.js";

class ProductCommand {
  constructor(bot) {
    this.bot = bot;
  }

  add(chatId, products) {
    products.forEach((product) => {
      this.bot.sendPhoto(chatId, product.img, {
        caption: `Mahsulot: ${product.name}`,
        remove_keyboard: true,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Buyurtma berish",
                callback_data: `product_${product.id}`,
              },
            ],
          ],
          resize_keyboard: true,
        },
      });
    });
  }

  handleCallbackQuery(callbackQuery) {
    const message = callbackQuery.message;
    const data = callbackQuery.data;
  }
}
export default ProductCommand;
