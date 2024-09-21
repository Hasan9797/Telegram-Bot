export const sendDeleteMessage = (chatId, messageId, bot) => {
  bot
    .deleteMessage(chatId, messageId)
    .then(() => {
      console.log("Xabar o'chirildi");
    })
    .catch((err) => {
      console.error("Xabarni o'chirishda xatolik:", err);
    });
};
