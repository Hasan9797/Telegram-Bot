class AddOrderCommand {
  constructor(bot) {
    this.bot = bot;
  }

  handle(text) {
    return text.includes("p_order_count_");
  }

  execute(callbackQuery, chatId) {
    // if (callbackQuery.data.includes("p_order_count_")) {
    // }
    this.handleCallbackQuery(callbackQuery.data, chatId);
    return true;
  }

  handleCallbackQuery(data, chatId) {
    const text = data.split("_")[1];
    const [all, product_id, count] = data.match(/p_order_count_(\d+)_(\d+)/);

    if (text === "order") {
      const quantity = parseInt(count);
      const productId = parseInt(product_id);

      this.bot.sendMessage(
        chatId,
        `${quantity} ta mahsulot korzinkaga qo'shildi.\nHaridnii davom ettirish uchun, Bosh sahifaga o'ting!`,
        {
          reply_markup: {
            keyboard: [
              ["🛒 Karzinka"],
              [" 🏠 Bosh sahifa "], // Birinchi qator
            ],
            resize_keyboard: true, // Kichikroq klaviatura yaratish uchun
            one_time_keyboard: true, // Klaviaturani faqat bir marta ko'rsatish
          },
        }
      );
    }
  }
}
export default AddOrderCommand;
