class AddOrderCommand {
  constructor(bot) {
    this.bot = bot;
  }

  handle(text) {
    return text.includes("p_order_count_");
  }

  async execute(callbackQuery, chatId) {
    const messageId = callbackQuery.message.message_id;
    this.sendDeleteMessage(chatId, messageId);
    this.handleCallbackQuery(callbackQuery.data, chatId);
    return true;
  }

  handleCallbackQuery(data, chatId) {
    const array = data.split("_");
    const text = array[1];
    const productId = array[3];
    const count = array[4];

    if (text === "order") {
      const quantity = parseInt(count);

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
export default AddOrderCommand;
