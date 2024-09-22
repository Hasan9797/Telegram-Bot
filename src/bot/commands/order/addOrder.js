import {
  addOrder,
  getOrderByChatId,
  updateOrder,
} from "../../../services/orders.js";

import productService from "../../../services/products.js";

class AddOrderCommand {
  constructor(bot) {
    this.bot = bot;
    this.categoryId = null;
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
    const productId = array[3].toString();
    const count = array[4];

    const currentProduct = await productService.getProductById(productId);
    const currentOrder = await getOrderByChatId(chatId);

    if (text === "order") {
      const quantity = parseInt(count);

      if (currentOrder && currentOrder.products.length > 0) {
        const updateProducts = [];

        currentOrder.products.forEach((obj) => {
          if (obj.product._id.toString() === productId) {
            obj.count += quantity;
          }
          updateProducts.push(obj);
        });

        if (updateProducts.length > 0) {
          await updateOrder(currentOrder._id, {
            products: updateProducts,
            ...currentOrder,
          });
          this.sendOrderMessage(chatId, currentOrder.products);
          return;
        }

        currentOrder.products.push({
          product: currentProduct,
          count: quantity,
        });
        await updateOrder(currentOrder._id, currentOrder);
        this.sendOrderMessage(chatId, currentOrder.products);
        return;
      }

      const order = {
        products: [{ product: currentProduct, count: quantity }],
        user_name: callbackQuery.from.username,
        first_name: callbackQuery.from.first_name,
        chat_id: chatId,
      };

      const newOrder = await addOrder(order);

      if (newOrder) {
        this.sendOrderMessage(chatId, newOrder.products);
      } else {
        this.bot.sendMessage(chatId, "Mahsulot qo'shishda xatolik yuz berdi!");
        console.error("Mahsulot qo'shishda xatolik yuz berdi:", err);
      }
    }
  }

  sendOrderMessage(chatId, orders) {
    let message = "Savatda:\n\n";
    let totalAmount = 0;

    // Har bir mahsulotni ko'rib chiqish
    orders.forEach((item) => {
      const productName = item.product.title;
      const productPrice = item.product.price;

      if (!this.categoryId) {
        this.categoryId = item.product.category_id;
      }

      const productCount = item.count;

      // Mahsulot bo'yicha hisob
      const productTotal = productPrice * productCount;
      totalAmount += productTotal;

      // Xabarni mahsulot ma'lumotlari bilan to'ldirish
      message += `Nomi: ${productName}\nNarxi: ${productPrice}\nSoni: ${productCount}\n\n`;
    });

    // Xabarning oxiriga umumiy summani qo'shish
    message += `Umumiy summa: ${totalAmount} so'm\n`;

    // Xabarni yuborish
    this.bot.sendMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "⬅️ Ortga",
              callback_data: `cate_${this.categoryId}`,
            },
            {
              text: "❌ O'chirish",
              callback_data: `delete_order_product`,
            },
          ],
          [
            {
              text: "🗑 Savadni bo'shatish",
              callback_data: "delete_order",
            },
          ],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
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
export default AddOrderCommand;
