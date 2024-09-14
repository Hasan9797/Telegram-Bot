class TgCommands {
  constructor(bot) {
    this.bot = bot; // Bot ob'ektini umumiy qilib olamiz
  }

  // 1. sendMessage - oddiy xabar yuborish
  start(msg) {
    const chatId = msg.chat.id;
    this.bot.sendMessage(
      chatId,
      "Assalomu alaykum! Anvar Jiggani botiga xush kelibsiz ))"
    );
  }

  // 2. sendInlineKeyBoard - inline keyboard bilan xabar yuborish
  sendInlineKeyBoard(msg) {
    const chatId = msg.chat.id;
    this.bot.sendMessage(chatId, "Kategoriyalardan birini tanlang: ", {
      reply_markup: {
        remove_keyboard: true,
        inline_keyboard: [
          [
            { text: "💫 Uzuk", callback_data: "uzuk" },
            { text: "⛓ Zirak", callback_data: "zirak" },
          ],
          [
            { text: "💫 Bo'yin Tumor", callback_data: "tumor" },
            { text: "⛓ Braslit", callback_data: "braslit" },
          ],
        ],
      },
    });
  }

  // 3. sendPhoto - rasm yuborish
  sendPhoto(msg) {
    const chatId = msg.chat.id;
    const imagePath = "path/to/your/image.jpg"; // Rasmingizning manzili
    this.bot.sendPhoto(chatId, imagePath, { caption: "Mana bu rasm!" });
  }

  // 4. sendDocument - hujjat yuborish
  sendDocument(msg) {
    const chatId = msg.chat.id;
    const documentPath = "path/to/your/document.pdf"; // Hujjat manzili
    this.bot.sendDocument(chatId, documentPath);
  }

  // 5. sendAudio - audio yuborish
  sendAudio(msg) {
    const chatId = msg.chat.id;
    const audioPath = "path/to/your/audio.mp3"; // Audio fayl manzili
    this.bot.sendAudio(chatId, audioPath);
  }

  // 6. sendVideo - video yuborish
  sendVideo(msg) {
    const chatId = msg.chat.id;
    const videoPath = "path/to/your/video.mp4"; // Video fayl manzili
    this.bot.sendVideo(chatId, videoPath);
  }

  // 7. sendSticker - stiker yuborish
  sendSticker(msg) {
    const chatId = msg.chat.id;
    const stickerId = "CAADAgADQAADyIsGAAE7MpzFPFQXRAI"; // Stiker ID-si
    this.bot.sendSticker(chatId, stickerId);
  }

  // 8. sendLocation - joylashuv yuborish
  sendLocation(msg) {
    const chatId = msg.chat.id;
    const latitude = 41.2995; // Latitude (kenglik)
    const longitude = 69.2401; // Longitude (uzunlik)
    this.bot.sendLocation(chatId, latitude, longitude);
  }

  // 9. sendPoll - so'rovnoma yuborish
  sendPoll(msg) {
    const chatId = msg.chat.id;
    this.bot.sendPoll(chatId, "Sizga qaysi meva yoqadi?", [
      "Olma",
      "Banan",
      "Apelsin",
    ]);
  }

  // 10. sendAnimation - animatsiya yuborish
  sendAnimation(msg) {
    const chatId = msg.chat.id;
    const animationPath = "path/to/your/animation.gif"; // Animatsiya manzili
    this.bot.sendAnimation(chatId, animationPath);
  }

  // 11. Callback query ishlatish - Tugmalar bosilganda javob berish
  handleCallbackQuery(callbackQuery) {
    const message = callbackQuery.message;
    const data = callbackQuery.data;

    if (data === "1") {
      this.bot.sendMessage(message.chat.id, "Siz Tugma 1 ni bosdingiz.");
    } else if (data === "2") {
      this.bot.sendMessage(message.chat.id, "Siz Tugma 2 ni bosdingiz.");
    }
  }
}

export default TgCommands;
