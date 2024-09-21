import { getOrderByChatId } from "../../../services/orders.js";

class AddOrderCommand {
  constructor(bot) {
    this.bot = bot;
  }

  handle(text) {
    return text.includes("🛒 Karzinka");
  }

  async execute(callbackQuery, chatId) {
    const messageId = callbackQuery.message.message_id;
    this.sendDeleteMessage(chatId, messageId);
    this.getClientOrders(chatId);
    return true;
  }
  getClientOrders(chatId) {
    const orders = getOrderByChatId(chatId);
    if (orders.length === 0) {
      this.sendEmptyCartMessage(chatId);
    } else {
      this.sendOrderList(chatId, orders);
      }
      
      
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
