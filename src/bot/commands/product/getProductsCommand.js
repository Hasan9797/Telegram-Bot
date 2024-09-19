import { products } from "../../../services/products.js";

class ProductCommands {
  constructor(bot) {
    this.bot = bot;
    this.page = 0;
    this.itemsPerPage = 5; // Har bir sahifada 5 ta mahsulot
  }

  handle(text) {
    if (
      text.startsWith("cate_") ||
      text.startsWith("back_") ||
      text.startsWith("next_")
    ) {
      return true;
    }
    return false;
  }

  execute(query, chatId) {
    if (query.data.startsWith("cate_")) {
      const categoryId = parseInt(query.data.split("_")[2]);

      this.showProducts(chatId, categoryId);
    }
    if (query.data.startsWith("back_") || query.data.startsWith("next_")) {
      this.processUpdatePage(query);
    }
  }

  // Sahifa bo'yicha mahsulotlarni ko'rsatish
  showProducts(chatId, categoryId) {
    // Mahsulotlarni kategoriya bo'yicha filtrlash
    const productsFilter = products.filter(
      (product) => product.category_id === parseInt(categoryId)
    );

    if (productsFilter.length <= 0) {
      this.bot.sendMessage(chatId, "Bu kategoriyada mahsulot hozircha yo'q :)");
      return true;
    }

    const startIndex = this.page * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const paginatedProducts = productsFilter.slice(startIndex, endIndex);

    paginatedProducts.forEach((product, index) => {
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

      if (index === paginatedProducts.length - 1) {
        this.bot.sendMessage(chatId, `Sahifalar`, {
          remove_keyboard: true,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "⬅️ Ortga",
                  callback_data: `back_${categoryId}`,
                  disabled: this.page === 0, // Agar birinchi sahifada bo'lsa, "Ortga" ni o'chirib qo'yamiz
                },
                {
                  text: "➡️ Kiyingi",
                  callback_data: `next_${categoryId}`,
                  disabled: endIndex >= productsFilter.length, // Agar oxirgi sahifada bo'lsa, "Kiyingi" ni o'chirib qo'yamiz
                },
              ],
            ],
            resize_keyboard: true,
          },
        });
      }
    });
  }
  // Sahifa tugmalarini qo'shish

  processUpdatePage(callbackQuery) {
    const action = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;
    const categoryId = action.split("_")[1];

    if (action.startsWith("back_")) {
      if (this.page > 0) {
        this.page -= 1;
      }
    } else if (action.startsWith("next_")) {
      const maxPage = Math.ceil(products.length / this.itemsPerPage) - 1;
      if (this.page < maxPage) {
        this.page += 1;
      }
    }
    this.showProducts(chatId, categoryId);
  }
}

export default ProductCommands;
