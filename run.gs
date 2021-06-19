function doGetme() {
  var response = UrlFetchApp.fetch("https://api.telegram.org/bot" + botToken + "/getMe");
  Logger.log(response);
}

function setWebhook() {
  var response = UrlFetchApp.fetch("https://api.telegram.org/bot" + botToken + "/setWebhook?url=" + webAppURL);
  Logger.log(response);
}

function deleteWebhook() {
  var response = UrlFetchApp.fetch("https://api.telegram.org/bot" + botToken + "/deleteWebhook?url=" + webAppURL);
  Logger.log(response);
}

function getUpdate() {
  var response = UrlFetchApp.fetch("https://api.telegram.org/bot" + botToken + "/getUpdates");
  Logger.log(response);
}

//------Support function here------


//------Basic Command function here------
function echo(id, text) {
  var response = UrlFetchApp.fetch("https://api.telegram.org/bot" + botToken
    + "/sendMessage?chat_id=" + id + "&text=" + text);
  Logger.log(id);
}


//-------Main function here-------
function doGet(e) {
  return ContentService.createTextOutput("Fuck Google? " + JSON.stringify(e));
}

function doPost(e) {
  var rawData = JSON.parse(e.postData.contents);//Response example in Notebook--Webhook response.
  var isGroup = false;
  var mute = false;
  var senderId;

  if (rawData.message) {

    if (rawData.message.chat.id != rawData.message.from.id) {
      //group chat!
      isGroup = true;
      senderId = rawData.message.chat.id;
    } else {
      //private chat
      senderId = rawData.message.from.id;
    }


    var text = rawData.message.text;//what he or she actually said
    var entity = rawData.message.entities[0];

    if (isGroup) {
      var targetBot = text.substring(text.lastIndexOf("@"), text.length);
      if (targetBot == "@BoruisBot") {
        text = text.substring(0, text.lastIndexOf("@"));
      } else {
        mute = true;
      }
    }

    if (!mute && JSON.stringify(entity.type) == '"bot_command"') {

      if (rawData.message.entities.length > 1) {
        echo(senderId, "You send several commands, I will only accept the first one.");
      }

      var cmdlen = entity.length;
      var cmdstat = entity.offset;
      var cmd = text.substring(cmdstat, cmdstat + cmdlen);

      if (cmd == "/weathernow") {
        weather(senderId, text, cmd, cmdstat, cmdlen);
      }
      else if (cmd == "/translate") {
        voc2CN(senderId, text, cmdstat, cmdlen);
      }
      else if (cmd == "/yiyan") {
        yiYan(senderId);
      }
      else if (cmd == "/comic") {
        comic(senderId, text, cmdstat, cmdlen);
      }

      else {
        echo(senderId, "Not a valid command.");
      }
      //echo(senderId, "cmd");
    }
  }
  //
  if (rawData.callback_query) {
    senderId = rawData.callback_query.message.chat.id;

    if (rawData.callback_query.data.indexOf("#") != -1) {
      comicPage(senderId, rawData.callback_query.data)
    }

    if (rawData.callback_query.data.indexOf("/manhua") != -1 && rawData.callback_query.data.indexOf("_") == -1
      && rawData.callback_query.data.indexOf("$") == -1) {
      //点击了一个漫画，发初始漫画集
      comicVol(senderId, rawData.callback_query.data);
    }


    if (rawData.callback_query.data.indexOf("$") != -1) {
      //更新漫画集显示
      updateVol(senderId, rawData.callback_query.data);

    }

    if (rawData.callback_query.data.indexOf("/manhua") != -1 && rawData.callback_query.data.indexOf("_") != -1
      && rawData.callback_query.data.indexOf("isend") != -1) {
      //点击了漫画的一集，准备发漫画
      sendContent(senderId, rawData.callback_query.data);
    }

  }
}