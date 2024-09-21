import {
  addOrder,
  getOrderByChatId,
  updateOrder,
} from "../../../services/orders.js";

import productService from "../../../services/products.js";

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
    await this.handleCallbackQuery(callbackQuery, chatId);
    return true;
  }

  async handleCallbackQuery(callbackQuery, chatId) {
    const array = callbackQuery.data.split("_");
    const text = array[1];
    const productId = array[3];
    const count = array[4];

    const product = await productService.getProductById(productId);
    const currentOrder = await getOrderByChatId(chatId);

    if (text === "order") {
      const quantity = parseInt(count);

      if (currentOrder) {
        this.bot.sendMessage(
          chatId,
          `${quantity} ta mahsulot korzinkaga qo'shildi.\nHaridnii davom ettirish uchun, Bosh sahifaga o'ting!`,
          {
            reply_markup: {
              keyboard: [["🛒 Karzinka"], [" 🏠 Bosh sahifa "]],
              resize_keyboard: true,
              one_time_keyboard: true,
            },
          }
        );

        currentOrder.products.push({ product, count: quantity });
        await updateOrder(currentOrder._id, currentOrder);
        return;
      }

      const order = {
        products: [{ product, count: quantity }],
        user_name: callbackQuery.from.username,
        first_name: callbackQuery.from.first_name,
        chat_id: chatId,
      };

      const newOrder = await addOrder(order);

      if (newOrder) {
        this.bot.sendMessage(
          chatId,
          `${quantity} ta mahsulot korzinkaga qo'shildi.\nHaridnii davom ettirish uchun, Bosh sahifaga o'ting!`,
          {
            reply_markup: {
              keyboard: [["🛒 Karzinka"], [" 🏠 Bosh sahifa "]],
              resize_keyboard: true,
              one_time_keyboard: true,
            },
          }
        );
      } else {
        this.bot.sendMessage(chatId, "Mahsulot qo'shishda xatolik yuz berdi!");
        console.error("Mahsulot qo'shishda xatolik yuz berdi:", err);
      }
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
