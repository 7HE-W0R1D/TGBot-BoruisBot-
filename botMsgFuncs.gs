function botMsgFuncTest() {
  // sendAudioCN(selfid, "http://m7.music.126.net/20211231140902/d88540f4e6928ec019418c8cba4d4d03/ymusic/obj/w5zDlMODwrDDiGjCn8Ky/12341342326/a8e6/3ff3/678f/4489679e074ddf76c01e2ef48197dc14.mp3", "任意門 Dokodemo Door（RE:LIVE 現場就是起點版)");
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

function sendAudio(chatId, audioFile, caption, title) {
  if (title == null) {
    title = "Unknown Title";
  }
  var data = {
    method: "post",
    payload: {
      method: "sendAudio",
      chat_id: String(chatId),
      audio: audioFile,
      caption: caption,
      title: title
      //parse_mode: "MarkdownV2",
      //reply_markup: JSON.stringify(keyBoard)
    }
  };
  Logger.log('https://api.telegram.org/bot' + botToken + '/', data);
  UrlFetchApp.fetch('https://api.telegram.org/bot' + botToken + '/', data);
}

function sendAudioCN(chatId, audioFileLink, title) {
  if (title == null) {
    title = "Unknown Title";
  }
  
  var response = UrlFetchApp.fetch(audioFileLink);
  var blob = response.getBlob();
  var name = blob.getName();
  var audiosuffix = name.substring(name.lastIndexOf("."), name.length);
  blob.setName(title + audiosuffix);
  var filename = title + audiosuffix;

  var metadata = {
      "method": "sendAudio",
      "chat_id": String(chatId),
  };

  var boundary = "-----zHW0BJecQWMezOLfDmhujjAovfkaD22DJyepDlfCrqSw3aqPZH";
  var data = "";

  for (var i in metadata) {
    data += "--" + boundary + "\r\n";
    data += "Content-Disposition: form-data; name=\"" + i + "\"; \r\n\r\n" + metadata[i] + "\r\n";
  }

  data += "--" + boundary + "\r\n";
  data += "Content-Disposition: form-data; name=\"audio\";filename=\"" + filename + "\"\r\n";
  data += "Content-Type:" + "application/octet-stream" + "\r\n\r\n";

  var payload = Utilities.newBlob(data).getBytes()
      .concat(blob.getBytes())
      .concat(Utilities.newBlob("\r\n--" + boundary + "--\r\n").getBytes());

  var options = {
      method : "post",
      contentType : "multipart/form-data; boundary=" + boundary,
      payload : payload,
      muteHttpExceptions: false,
  };

  UrlFetchApp.fetch('https://api.telegram.org/bot' + botToken + '/', options);
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