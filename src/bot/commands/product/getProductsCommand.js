import { products } from "../../../services/products.js";

class ProductCommands {
  constructor(bot) {
    this.bot = bot;
  }

  handle(text) {
    const filterText = text.split("_")[0];
    if (filterText === "cate") return true;
    return false;
  }

  execute(query, chatId) {
    const categoryId = Number(query.data.split("_")[2]);

    const productsFilter = products.filter(
      (product) => product.category_id === categoryId
    );
    console.log(productsFilter.length);

    if (productsFilter.length <= 0) {
      this.bot.sendMessage(chatId, "Bu kategoriyada mahsulot hozircha yo'q :)");
      return true;
    }

    productsFilter.forEach((product) => {
      this.bot.sendPhoto(chatId, product.img, {
        caption: `Mahsulot: ${product.name}`,
        remove_keyboard: true,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Buyurtma berish",
                callback_data: `product_count_${product.id}`,
              },
            ],
          ],
          resize_keyboard: true,
        },
      });
    });
  }
}
export default ProductCommands;
