import productService from "../../../services/products.js";
import { deleteAllMessages, saveMessage } from "../helpers/cachingHelper.js";
import { sendDeleteMessage } from "../helpers/tgBotHelper.js";
class ProductCommands {
  constructor(bot) {
    this.bot = bot;
    this.page = 1;
    this.limit = 2;
    this.productCount = 0;
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

  async execute(query, chatId) {
    const messageId = query.message.message_id;

    if (query.data.startsWith("cate_")) {
      this.page = 1;
      const categoryId = query.data.split("_")[1];
      sendDeleteMessage(chatId, messageId, this.bot);
      await this.showProducts(chatId, categoryId);
    } else if (
      query.data.startsWith("back_page_") ||
      query.data.startsWith("next_page_")
    ) {
      await this.processUpdatePage(query);
    }
  }

  // Sahifa bo'yicha mahsulotlarni ko'rsatish
  async showProducts(chatId, categoryId) {
    const productsFilter = await productService.getAllProductsByCategoryId(
      this.page,
      this.limit,
      categoryId
    );

    const products = productsFilter.data ?? [];
    this.productCount = productsFilter.totalPages ?? 0;

    if (products.length <= 0) {
      this.bot.sendMessage(chatId, "Bu kategoriyada mahsulot hozircha yo'q :)");
      return true;
    }

    for (const [index, product] of products.entries()) {
      let inlineKeyboard = [
        [
          {
            text: "Buyurtma berish",
            callback_data: `product_count_${product.id}`,
          },
        ],
      ];

      // Agar oxirgi mahsulot bo'lsa, sahifa tugmalarini qo'shamiz
      if (index === products.length - 1) {
        inlineKeyboard.push([
          {
            text: "⬅️ Ortga",
            callback_data: `back_page_${categoryId}_${this.page - 1}`,
          },
          {
            text: `Sahifa ${this.page}`,
            callback_data: `page`,
          },
          {
            text: "➡️ Kiyingi",
            callback_data: `next_page_${categoryId}_${this.page + 1}`,
          },
        ]);
      }

      // Mahsulot suratini jo'natamiz
      const sentMessage = await this.bot.sendPhoto(chatId, product.img, {
        caption: `Nomi: ${product.title}\nNarxi: ${product.price}\nMa'lumot: ${product.description}`,
        remove_keyboard: true,
        reply_markup: {
          inline_keyboard: inlineKeyboard,
          resize_keyboard: true,
        },
      });

      // Xabarni Redisga saqlash
      const messageId = sentMessage.message_id;
      await saveMessage(chatId, messageId);
    }
  }

  // Sahifa tugmalarini qo'shish

  async processUpdatePage(callbackQuery) {
    const action = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;
    const categoryId = action.split("_")[2];
    const page = parseInt(action.split("_")[3]);

    if (action.startsWith("back_page_")) {
      if (page >= 1) {
        this.page = page;
      } else {
        return this.bot.sendMessage(chatId, "Siz birinchi sahifadasiz!");
      }
    } else if (action.startsWith("next_page_")) {
      if (page <= this.productCount) {
        this.page = page;
      } else {
        return this.bot.sendMessage(chatId, "Siz oxirgi sahifadasiz!");
      }
    }
    await deleteAllMessages(chatId, this.bot);
    await this.showProducts(chatId, categoryId);
  }
}

export default ProductCommands;
