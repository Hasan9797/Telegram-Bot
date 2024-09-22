import { getOrderByChatId } from "../../../services/orders.js";

class GetOrderCommand {
  constructor(bot) {
    this.bot = bot;
  }

  handle(text) {
    return text === "🛒 Karzinka" || text === "/order";
  }

  async execute(message, chatId) {
    const messageId = message.message_id;
    this.sendDeleteMessage(chatId, messageId);
    this.getClientOrders(chatId);
    return true;
  }

  async getClientOrders(chatId) {
    const order = await getOrderByChatId(chatId);

    if (order) {
      await this.sendOrderList(chatId, order.products);
      return true;
    }

    this.bot.sendMessage(chatId, `Sizda hechqanday Korzinka topilmadi!`, {
      reply_markup: {
        keyboard: [
          [" 🏠 Bosh sahifa "], // Birinchi qator
        ],
        resize_keyboard: true, // Kichikroq klaviatura yaratish uchun
        one_time_keyboard: true, // Klaviaturani faqat bir marta ko'rsatish
      },
    });
  }

  async sendOrderList(chatId, products) {
    products.forEach((obj) => {
      const inlineKeyboard = [
        [
          {
            text: "O'chirish",
            callback_data: `delete_order_${obj._id}`,
          },
          {
            text: "O'zgartirish",
            callback_data: `update_order_${obj._id}`,
          },
        ],
        [
          {
            text: "Harid qilish",
            callback_data: `pay_order_${obj.product._id}`,
          },
        ],
      ];

      this.bot.sendPhoto(chatId, obj.product.img, {
        caption: `Nomi: ${obj.product.title}\nNarxi: ${obj.product.price}\nSoni: ${obj.count}`,
        remove_keyboard: true,
        reply_markup: {
          inline_keyboard: inlineKeyboard,
          resize_keyboard: true,
        },
      });
    });
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
export default GetOrderCommand;
