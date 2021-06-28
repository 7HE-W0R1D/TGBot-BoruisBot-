function botMsgFuncTest() {

}

function sendAlbum(chatId, photourls) {
  var data = {
    method: "post",
    payload: {
      method: "sendMediaGroup",
      chat_id: String(chatId),
      media: JSON.stringify(photourls)
      //caption: caption,
      //parse_mode: "MarkdownV2",
      //reply_markup: JSON.stringify(keyBoard)
    }
  };
  UrlFetchApp.fetch('https://api.telegram.org/bot' + botToken + '/', data);
}

function sendKB(chatId, text, keyBoard) {
  var data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(chatId),
      text: text,
      //parse_mode: "MarkdownV2",
      reply_markup: JSON.stringify(keyBoard)
    }
  };
  return UrlFetchApp.fetch('https://api.telegram.org/bot' + botToken + '/', data);
}

function sendPhotoKB(chatId, photourl, caption, keyBoard) {
  var data = {
    method: "post",
    payload: {
      method: "sendPhoto",
      chat_id: String(chatId),
      photo: photourl,
      caption: caption,
      parse_mode: "MarkdownV2",
      reply_markup: JSON.stringify(keyBoard)
    }
  };
  UrlFetchApp.fetch('https://api.telegram.org/bot' + botToken + '/', data);
}

function updateKB(chatId, messageId, keyBoard) {

  var data = {
    method: "post",
    payload: {
      method: "editMessageReplyMarkup",
      chat_id: String(chatId),
      message_id: messageId,
      reply_markup: JSON.stringify(keyBoard)
    }
  };
  return UrlFetchApp.fetch('https://api.telegram.org/bot' + botToken + '/', data);
}

function sendAudio(chatId, audioFile, caption) {
  var data = {
    method: "post",
    payload: {
      method: "sendAudio",
      chat_id: String(chatId),
      audio: audioFile,
      caption: caption,
      //parse_mode: "MarkdownV2",
      //reply_markup: JSON.stringify(keyBoard)
    }
  };
  UrlFetchApp.fetch('https://api.telegram.org/bot' + botToken + '/', data);
}

function sendAudioLink(chatId, audioLink, caption) {
  var data = {
    method: "post",
    payload: {
      method: "sendAudio",
      chat_id: String(chatId),
      audio: String(audioLink),
      caption: caption,
      //parse_mode: "MarkdownV2",
      //reply_markup: JSON.stringify(keyBoard)
    }
  };
  UrlFetchApp.fetch('https://api.telegram.org/bot' + botToken + '/', data);
}