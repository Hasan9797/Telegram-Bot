import productService from "../../../services/products.js";
import { deleteAllMessages } from "../helpers/cachingHelper.js";

class AddCound {
  constructor(bot) {
    this.bot = bot; // Bot ob'ektini umumiy qilib olamiz
    this.count = 0;
    this.initialMessageSent = false;
  }
  handle(text) {
    return (
      text.includes("product_count_") ||
      text.includes("p_increase_") ||
      text.includes("p_decrease_")
    );
  }

  async execute(callback, chatId) {
    if (callback.data.includes("product_count_")) {
      this.count = 1;
      this.initialMessageSent = false;

      await deleteAllMessages(chatId, this.bot);
      await this.sendProductSelection(callback);
    } else if (
      callback.data.includes("p_increase_") ||
      callback.data.includes("p_decrease_")
    ) {
      this.initialMessageSent = true;
      await this.handleCallbackQuery(callback);
    }
  }

  // Mahsulot sonini yangilash
  async sendProductSelection(callback) {
    const message = callback.message;
    const messageId = message.message_id;
    const chatId = message.chat.id;
    const data = callback.data;

    const productId = data.split("_")[2];
    const product = await productService.getProductById(productId);

    const inlineKeyboard = [
      [
        { text: "➖", callback_data: `p_decrease_${product._id}` },
        { text: `${this.count}`, callback_data: "p_noop" }, // Tanlangan son
        { text: "➕", callback_data: `p_increase_${product._id}` },
      ],
      [
        {
          text: "🛒 karzinkaga qo'shish",
          callback_data: `p_order_count_${product._id}_${this.count}`,
        },
      ],
      [
        {
          text: "⬅️ Ortga qaytish",
          callback_data: `cate_${product.category_id}`,
        },
      ],
    ];

    if (!this.initialMessageSent) {
      this.bot
        .sendPhoto(chatId, product.img, {
          caption: `Nomi: ${product.title}\nNarxi: ${product.price}\nMa'lumot: ${product.description}`,
          reply_markup: { inline_keyboard: inlineKeyboard },
        })
        .then((message) => {
          this.initialMessageSent = true;
        });
    } else {
      this.bot
        .editMessageReplyMarkup(
          { inline_keyboard: inlineKeyboard },
          { chat_id: chatId, message_id: messageId }
        )
        .catch((error) => {
          console.error("Xato:", error);
        });
    }
  }

  // Callback querylarni boshqarish
  async handleCallbackQuery(callbackQuery) {
    const data = callbackQuery.data;
    const action = data.split("_")[1];

    if (action === "increase") {
      this.count += 1;
    } else if (action === "decrease") {
      if (this.count > 0) {
        this.count = Math.max(this.count - 1, 0);
      }
    }
    await this.sendProductSelection(callbackQuery);
  }
}

export default AddCound;
