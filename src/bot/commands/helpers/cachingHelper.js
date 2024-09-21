import redisClient from "../../../config/redis.js";

export const saveMessage = async (chatId, messageId) => {
  const key = `chat:${chatId}`;

  // messageId ni string formatida saqlash
  if (typeof messageId !== "string") {
    messageId = String(messageId);
  }

  await redisClient
    .rPush(key, messageId)
    .catch((error) => console.log("error saving message:", error));
};

export const deleteAllMessages = async (chatId, bot) => {
  const key = `chat:${chatId}`;

  try {
    // Redisdan barcha message_id larni olish
    const messageIds = await redisClient.lRange(key, 0, -1);

    if (messageIds.length === 0) {
      console.log("O'chiriladigan xabarlar yo'q.");
      return;
    }

    await Promise.all(
      messageIds.map((messageId) => {
        return bot
          .deleteMessage(chatId, parseInt(messageId))
          .then(() => {
            console.log("Xabar o'chirildi:", messageId);
          })
          .catch((err) => {
            console.error("Xabarni o'chirishda xatolik:", err);
          });
      })
    );

    // O'chirilgandan so'ng, Redisdan ham xabarlarni o'chirish
    await redisClient.del(key);
  } catch (err) {
    console.error("Redisdan xabarlarni olishda xatolik:", err);
  }
};
