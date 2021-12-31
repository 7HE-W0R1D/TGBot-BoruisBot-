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


//------Basic Command function here------
function echo(id, text) {
  var response = UrlFetchApp.fetch("https://api.telegram.org/bot" + botToken
    + "/sendMessage?chat_id=" + id + "&text=" + text);
  Logger.log(id);
}


//-------Main function here-------
function doGet(e) {
  return ContentService.createTextOutput("Fuck Google " + JSON.stringify(e));
}

function doPost(e) {
  var rawData = JSON.parse(e.postData.contents);//Response example in Notebook--Webhook response.
  var mute = false;
  var senderId;

  if (rawData.message) {

    var text = rawData.message.text;//what he or she actually said
    var entity = rawData.message.entities[0];
    var commandNum = 0;
    for (var x = 0; x < rawData.message.entities.length; x++) {
      var entityType = JSON.stringify(rawData.message.entities[x].type);

      if (rawData.message.chat.id != rawData.message.from.id 
        && rawData.message.text.indexOf("@BoruisBot") == -1) {
        //for cases like /command@XxxBot in groupChat
        mute = true;
      }

      if (entityType == '"bot_command"') {
        commandNum++;
      } else if (entityType == '"mention"') {
        //group chat!
        var mentionLen = rawData.message.entities[x].length;
        var mentionStat = rawData.message.entities[x].offset;
        var targetBot = rawData.message.text.substring(mentionStat, mentionStat + mentionLen);
        if (targetBot == "@BoruisBot") {
          //update text for groupchat
          text = rawData.message.text.substring(rawData.message.entities[0].offset, rawData.message.entities[1].offset);
        } else {
          //calling others bots, be quiet!
          mute = true;
        }
      }

    }
    senderId = rawData.message.chat.id;

    if (!mute && commandNum > 0) {

      if (commandNum > 1) {
        echo(senderId, "You send several commands, I will only accept the first one.");
        //update text for multiple commands
        text = rawData.message.text.substring(rawData.message.entities[0].offset, rawData.message.entities[1].offset);
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
      else if (cmd == "/radio") {
        netRadio(senderId, text, cmdstat, cmdlen);
      }

      else {
        echo(senderId, "Not a valid command.");
      }
    }
  }
  
  if (rawData.callback_query) {
    senderId = rawData.callback_query.message.chat.id;
    if (rawData.callback_query.data == "doNothing") {
      //do nothing here
    }
    else if (rawData.callback_query.data.indexOf(netRadioTag) != -1) {
      //netease radio command!
      if (rawData.callback_query.data.indexOf(netRadioPageTag) != -1) {
        //new page
        updateRadio(senderId, rawData.callback_query.data);
      }

      if (rawData.callback_query.data.indexOf("list") != -1 && rawData.callback_query.data.indexOf("offset") == -1 && rawData.callback_query.data.indexOf("audio") == -1) {
        //send list
        chooseShowVol(senderId, rawData.callback_query.data);
      }
      else if (rawData.callback_query.data.indexOf("list") != -1 && rawData.callback_query.data.indexOf("offset") != -1) {
        //update list
        updateShowVol(senderId, rawData);
      }
      else if (rawData.callback_query.data.indexOf("audio") != -1) {
        //send radio mp3 file(or link)
        getAudio(senderId, rawData);
      }
    }
    else {

      if (rawData.callback_query.data.indexOf(comicPrefix) != -1) {
        comicPage(senderId, rawData.callback_query.data)
      }

      if (rawData.callback_query.data.indexOf("/manhua") != -1 && rawData.callback_query.data.indexOf("_") == -1
        && rawData.callback_query.data.indexOf(comicPagePrefix) == -1) {
        //点击了一个漫画，发初始漫画集
        comicVol(senderId, rawData.callback_query.data);
      }


      if (rawData.callback_query.data.indexOf(comicPagePrefix) != -1) {
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
}