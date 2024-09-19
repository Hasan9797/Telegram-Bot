import { products } from "../../../services/products.js";
class AddCound {
  constructor(bot) {
    this.bot = bot; // Bot ob'ektini umumiy qilib olamiz
    this.count = 0;
  }
  handle(text) {
    return (
      text.includes("product_count_") ||
      text.includes("p_increase_") ||
      text.includes("p_decrease_")
    );
  }

  execute(callback, chatId) {
    if (callback.data.includes("product_count_")) {
      this.sendProductSelection(callback, chatId);
    } else if (
      callback.data.includes("p_increase_") ||
      callback.data.includes("p_decrease_")
    ) {
      this.handleCallbackQuery(callback);
    }
  }

  // Mahsulot sonini yangilash
  sendProductSelection(callback, chatId) {
    const productId = parseInt(callback.data.split("_")[2]);

    const productName = products.find(
      (product) => product.id === productId
    ).name;

    const inlineKeyboard = [
      [
        { text: "➖", callback_data: `p_decrease_${productId}` },
        { text: `${this.count}`, callback_data: "p_noop" }, // Tanlangan son
        { text: "➕", callback_data: `p_increase_${productId}` },
      ],
      [
        {
          text: "Soxranit v korzinku",
          callback_data: `p_order_count_${productId}`,
        },
      ],
    ];

    this.bot.sendMessage(chatId, `Tanlangan Mahsulot: ${productName}`, {
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    });
  }

  // Callback querylarni boshqarish
  handleCallbackQuery(callbackQuery) {
    const message = callbackQuery.message;
    const chatId = message.chat.id;
    const data = callbackQuery.data;
    const action = data.split("_")[1];
    const productId = parseInt(data.split("_")[2]);

    if (action === "increase") {
      // Mahsulot sonini oshirish (faqat lokal xotirada)
      this.count += 1;
      this.updateProductSelection(chatId, productId, message.message_id);
    } else if (action === "decrease") {
      // Mahsulot sonini kamaytirish (faqat lokal xotirada)
      this.count = Math.max(this.count - 1, 0);
      this.updateProductSelection(chatId, productId, message.message_id);
    }
  }

  // Mahsulot sonini yangilash
  updateProductSelection(chatId, productId, messageId) {
    const quantity = this.count;
    const inlineKeyboard = [
      [
        { text: "➖", callback_data: `p_decrease_${productId}` },
        { text: `${quantity}`, callback_data: "p_noop" }, // Tanlangan son
        { text: "➕", callback_data: `p_increase_${productId}` },
      ],
      [
        {
          text: "Soxranit v korzinku",
          callback_data: `p_order_count_${productId}_${this.count}`,
        },
      ],
    ];

    // Inline keyboardni yangilash uchun yangi xabar yuborish
    this.bot.editMessageReplyMarkup(
      { inline_keyboard: inlineKeyboard },
      { chat_id: chatId, message_id: messageId }
    );
  }
}

export default AddCound;
