/*
function doGetme() {
var response = UrlFetchApp.fetch("https://api.telegram.org/bot" + botToken + "/getMe");
Logger.log(response);
}
*/

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


function debug() {
  //Logger.log(setConfig(3,false));
  //Logger.log(getConfig(3));
  //weather(selfid,"/weathernow     Los Angeles    ", "/weathernow", 0,11);
  //Logger.log(quickAR2CN(-4));//4004 202 11 1 0
  //randLetter(0);
  //voc2CN(selfid, "/trans2CN cigarett", 0, 9);
  comic(selfid, "/comic as", 0, 6);
}

//------Support function here------

// function getConfig(e) {
//   var isOn = false;
//   var sheet = SpreadsheetApp.openById(cmdSheetID);
//   var data = sheet.getDataRange().getValues();
//   var config = new Array();
//   for (var i = 0; i < data.length; i++) {
//     config.push(data[i][0]);
//   }
//   Logger.log(config);

//   if (config[e - 1]) {
//     isOn = true;
//   }
//   else {
//     isOn = false;
//   }
//   return isOn;
// }

// function setConfig(e, stat) {
//   var sheet = SpreadsheetApp.openById(cmdSheetID);
//   sheet.getRange('A' + e).setValue(stat);
// }

// function cmdActive() {
//   var isActive = false;
//   var sheet = SpreadsheetApp.openById(cmdSheetID);
//   var data = sheet.getDataRange().getValues();
//   var config = new Array();

//   for (var i = 0; i < data.length; i++) {
//     config.push(data[i][0]);
//     isActive = isActive || data[i][0];
//   }
//   Logger.log(config);
//   Logger.log(isActive);
//   return isActive;
// }

// function allPG(comicCode) {
//   //var orgurl = "https://www.manhuadb.com";
//   var orgurl = orgURL + comicCode; //using orgurl for compatibility with ver20.8.1
//   var page = "_p";
//   var pagenum = 1;
//   var allpgs = [];
//   var url = orgurl.substr(0, orgurl.length - 5) + page + pagenum + orgurl.substr(-5, 5);
//   //Logger.log(url);
//   //allpgs.push(url);

//   for (pagenum1 = 0; UrlFetchApp.fetch(url).getContentText().indexOf('<img class="img-fluid show-pic" src="') != -1; pagenum++) {
//     var url = orgurl.substr(0, orgurl.length - 5) + page + pagenum + orgurl.substr(-5, 5);
//     //Logger.log(url);
//     allpgs.push(url);
//   }
//   allpgs.pop();
//   var picUrl = [];
//   for (var x = 0; x < allpgs.length; x++) {

//     picUrl.push(findPic(allpgs[x]));
//   }
//   return (picUrl);

// }

// function findPic(callback_data) {

//   var urlc = callback_data;
//   var contentc = UrlFetchApp.fetch(urlc).getContentText();
//   //Logger.log(contentc);
//   var page = UrlFetchApp.fetch(urlc);
//   var doc = Xml.parse(page, true);
//   var bodyHtml = doc.html.body.toXmlString();
//   doc = XmlService.parse(bodyHtml);
//   var root = doc.getRootElement();
//   var y = root.getChild("div");
//   //Logger.log(y.getAttribute("class").getValue());
//   var kids = y.getChildren();
//   //Logger.log(kids);
//   var picurl = kids[4];
//   picurl = picurl.getChildren();
//   picurl = picurl[2];
//   picurl = picurl.getChildren();
//   picurl = picurl[1];
//   picurl = picurl.getChildren();
//   picurl = picurl[0];
//   //Logger.log(picurl)
//   picurl = picurl.getAttribute("src").getValue();
//   //Logger.log(picurl); 
//   return picurl
// }

// function search(content, fromText, toText, marginf, marginr) {

//   var index1 = content.indexOf(fromText);
//   //Logger.log(index1);
//   var slice1 = content.substring(index1 + marginf, index1 + marginr);
//   //Logger.log(slice1);
//   var index2 = slice1.indexOf(toText);
//   slice1 = slice1.substring(0, index2);
//   //Logger.log(slice1); 
//   return slice1;
// }

// function getBy(element, name, att, type) {
//   //att = "class" / "id" ...
//   element = element.getChildren(type);
//   var child;
//   var childreturn = null;
//   for (var x = 0; x < element.length; x++) {

//     child = element[x];

//     if (child.getAttribute(att).getValue() == name) {
//       //Logger.log(child + child.getText());
//       childreturn = child;
//     }
//   }

//   return childreturn
// }

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

//main
function doPostBAK(e) {
  var rawData = JSON.parse(e.postData.contents);//Response example in Notebook--Webhook response.
  //var rawData =   rawData.postData.contents;

  //var isCmd = false;
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
    //echo(selfid, "Self: " + rawData.message.from.id + " Self: " + rawData.message.chat.id);
    // if (rawData.message.entities == null) {
    //   if (!cmdActive()) {
    //     echo(senderId, "可以通过命令唤醒我哦");
    //   }
    //   isCmd = false;
    // }
    // else {

      // var senderNameF = rawData.message.chat.first_name;
      // var senderNameL = rawData.message.chat.last_name;
      var text = rawData.message.text;//what he or she actually said
      var entity = rawData.message.entities[0];
      //isCmd = false;
      if (isGroup){
        var targetBot = text.substring(text.lastIndexOf("@"), text.length);
        if (targetBot == "@BoruisBot") {
          text = text.substring(0, text.lastIndexOf("@"));
        } else {
          mute = true;
        }
      }
      //echo(senderId, text);

    if(!mute) {
      if (JSON.stringify(entity.type) == '"bot_command"') {
        //isCmd = true;

        if (rawData.message.entities.length > 1) {
          echo(senderId, "You send several commands, I will only accept the first one.");
        }

        var cmdlen = entity.length;
        var cmdstat = entity.offset;
        var cmd = text.substring(cmdstat, cmdstat + cmdlen);
        //echo(senderId, cmdlen + " | " + cmdstat + " | " + cmd);

        /**
         * Write command initiation here
         * WeatherNow
         * trans2CN
         * yiYan
         * comic
         **/

        /*
        if(cmd == "/echostart"){
          if (getConfig(1)){
            echo(senderId, "Are you 憨批? Echo already started.");
          }
          else{
            setConfig(1,true);
            echo(senderId, "Echo started.");
          }
        }
        else if(cmd == "/echostop"){
          if (!getConfig(1)){
            echo(senderId, "You are 铁龙鸣. Echo already stopped.");
          }
          else{
            setConfig(1,false);
            echo(senderId, "Echo stopped.");
          }
        }*/

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
    //}
  }

  if (rawData.callback_query) {
    //echo(selfid, "CP1");
    senderId = rawData.callback_query.chat.id;
    //echo(senderId, "test4");
    //echo(senderId, rawData.callback_query.data);
    echo(selfid, senderId);
    //echo(selfid, rawData.callback_query.data.indexOf("$"));
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
      //updateVol(senderId, callback_data)

    }

    if (rawData.callback_query.data.indexOf("/manhua") != -1 && rawData.callback_query.data.indexOf("_") != -1
      && rawData.callback_query.data.indexOf("isend") != -1) {
      //点击了漫画的一集，准备发漫画

      //echo(senderId, "entered if");
      //echo(senderId, rawData.callback_query.data);
      sendContent(senderId, rawData.callback_query.data);
    }

  };
  //GmailApp.sendEmail("Xperia.782980292@gmail.com", "TG_command", JSON.stringify(entity.type) + "\n" + JSON.stringify(e));
  //Link the functions here;
  /*
  if (getConfig(1) && !isCmd){
    echo(senderId, text);
  }//echo
  */
}


function doPost(e) {
  var rawData = JSON.parse(e.postData.contents);//Response example in Notebook--Webhook response.
  //var rawData =   rawData.postData.contents;
  //echo(senderId, text);
  /*
  GmailApp.sendEmail("Xperia.782980292@gmail.com", "TG", "hi");
  var body = DocumentApp.openById("1xrgoIPnxTvtOyoqvN-VIrjL6KzfdAD-fvj9HcG9nFA0").getBody();
  var bodytext = body.editAsText();
  */
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

      if (isGroup){
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
        //bodytext.appendText(cmd);
        //GmailApp.sendEmail("Xperia.782980292@gmail.com", "TG_commandx", cmd);

        //Write command initiation here
        //Echo DELETED
        //WeatherNow
        //trans2CN
        //yiYan

        /*
        if(cmd == "/echostart"){
          if (getConfig(1)){
            echo(senderId, "Are you 憨批? Echo already started.");
          }
          else{
            setConfig(1,true);
            echo(senderId, "Echo started.");
          }
        }
        else if(cmd == "/echostop"){
          if (!getConfig(1)){
            echo(senderId, "You are 铁龙鸣. Echo already stopped.");
          }
          else{
            setConfig(1,false);
            echo(senderId, "Echo stopped.");
          }
        }*/

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
    //echo(selfid, "CP1");
    senderId= rawData.callback_query.message.chat.id;
    //echo(senderId, "test4");
    // echo(senderId, rawData.callback_query.data);
    //echo(selfid, rawData.callback_query.data.indexOf("$"));
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
      //updateVol(senderId, callback_data)

    }

    if (rawData.callback_query.data.indexOf("/manhua") != -1 && rawData.callback_query.data.indexOf("_") != -1 
        && rawData.callback_query.data.indexOf("isend") != -1) {
      //点击了漫画的一集，准备发漫画

      //echo(senderId, "entered if");
      //echo(senderId, rawData.callback_query.data);
      sendContent(senderId, rawData.callback_query.data);
    }

  };
  //GmailApp.sendEmail("Xperia.782980292@gmail.com", "TG_command", JSON.stringify(entity.type) + "\n" + JSON.stringify(e));
  //Link the functions here;
  /*
  if (getConfig(1) && !isCmd){
    echo(senderId, text);
  }//echo
  */


}