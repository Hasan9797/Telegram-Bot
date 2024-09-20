import productService from "../../../services/products.js";

class AddCound {
  constructor(bot) {
    this.bot = bot; // Bot ob'ektini umumiy qilib olamiz
    this.count = 0;
    this.messageId = null;
    this.initialMessageSent = true;
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
      this.sendDeleteMessage(chatId, callback.message.message_id);
      await this.sendProductSelection(callback, chatId);
    } else if (
      callback.data.includes("p_increase_") ||
      callback.data.includes("p_decrease_")
    ) {
      await this.handleCallbackQuery(callback);
    }
  }

  // Mahsulot sonini yangilash
  async sendProductSelection(callback, chatId) {
    const productId = callback.data.split("_")[2];
    const product = await productService.getProductById(productId);

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

    this.bot.sendPhoto(chatId, product.img, {
      caption: `Tanlangan Mahsulot: ${product.title}`,
      reply_markup: {
        inline_keyboard: inlineKeyboard,
      },
    });
  }

  // Callback querylarni boshqarish
  async handleCallbackQuery(callbackQuery) {
    const message = callbackQuery.message;
    const chatId = message.chat.id;
    const data = callbackQuery.data;

    const action = data.split("_")[1];
    const productId = data.split("_")[2];
    const product = await productService.getProductById(productId);

    if (action === "increase") {
      // Mahsulot sonini oshirish (faqat lokal xotirada)
      this.count += 1;
      this.page += 1;
      this.updateProductSelection(
        chatId,
        productId,
        message.message_id,
        product.img,
        this.page
      );
    } else if (action === "decrease") {
      if (this.count > 0) {
        this.count = Math.max(this.count - 1, 0);
        this.page -= 1;
        this.updateProductSelection(
          chatId,
          productId,
          message.message_id,
          product.img,
          this.page
        );
      }
    }
  }

  // Mahsulot sonini yangilash
  updateProductSelection(chatId, productId, messageId, productImg, page) {
    const quantity = this.count;
    const inlineKeyboard = [
      [
        { text: "➖", callback_data: `p_decrease_${productId}` },
        { text: `${quantity}`, callback_data: "p_noop" }, // Tanlangan son
        { text: "➕", callback_data: `p_increase_${productId}` },
      ],
      [
        {
          text: `Soxranit v korzinku`, // productId ni ko'rsatish
          callback_data: `p_order_count_${productId}_${this.count}`,
        },
      ],
    ];

    // Rasmni birinchi marta yuborish
    if (!this.initialMessageSent) {
      this.bot
        .sendPhoto(chatId, productImg, {
          caption: `Mahsulot ID: ${productId}`,
          reply_markup: { inline_keyboard: inlineKeyboard },
        })
        .then((message) => {
          this.initialMessageSent = true;
          this.messageId = message.message_id;
        });
    } else {
      // Inline keyboardni yangilash
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

  sendDeleteMessage(chatId, messageId) {
    this.bot
      .deleteMessage(chatId, messageId)
      .then(() => {
        console.log("Xabar o'chirildi");
      })
      .catch((err) => {
        console.error("Xabarni o'chirishda xatolik:", err);
      });
  }
}

export default AddCound;
