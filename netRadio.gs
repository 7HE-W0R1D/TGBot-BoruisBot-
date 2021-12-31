var netRadioTag = "#NRadio";
var netRadioPageTag = "$NRadio";
var radioPerPage = 5;
var itemPerPage = 5;
var radioMaxPage = 10;

var keyWordStr = "keyword";

function netMusicTest() {
  // netRadio(selfid, "贝拉", 0, 0);
  // Logger.log(search("HHH", 1009));
  // var test = search("贝拉", 1009);
  // updateRadio(selfid, netRadioTag + netRadioPageTag + "?page=1&keyWord=乃琳&maxPage=1");
  // updateRadio(selfid, "#NRadio$NRadio?page=0&keyWord=午后&maxPage=1");
  // showVolKB(959453342, 0);
}


function netRadio(senderId, text, cmdstat, cmdlen) {
  var textlen = text.length;
  var inputkeyWord = text.substring(cmdstat + cmdlen, textlen);

  var response = search(inputkeyWord, 1009);
  if (JSON.stringify(response.result) === JSON.stringify({})) {
    echo(senderId,
      encodeURIComponent("Your search did not match any radio playlists.\nTry changing your keyword."));
    return;
  }

  for (var i = 0; i < Math.min(radioPerPage, response.result.djRadios.length); i++) {
    var listObj = response.result.djRadios[i]; //one radio show
    var djName = stringJustify(listObj.dj.nickname); //show author name
    var listName = stringJustify(listObj.name); //show name
    var listCover = listObj.picUrl;
    var listId = listObj.id; //show id

    Logger.log(djName);
    Logger.log(listName);
    keyBoard = {
      "inline_keyboard": [
        [{
          "text": "Find out more⬆",
          'callback_data': netRadioTag + "list" + listId
        }]
      ]
    };

    if (response.result.djRadios.length > radioPerPage && i == radioPerPage - 1) {
      //need buttons

      var dataLoad = "?page=" + "1" +
        "&keyWord=" + inputkeyWord + 
        "&maxPage=" + (Math.ceil(response.result.djRadios.length / radioPerPage) - 1).toString();

      keyBoard.inline_keyboard.push([
        {
          "text": "Next",
          'callback_data': netRadioTag + netRadioPageTag + dataLoad,
        }
      ])
    }

    sendPhotoKB(senderId, listCover, listName + " by " + djName, keyBoard);
  }
}

function updateRadio(senderId, data) {
  var radioKeyword = data.substring(data.indexOf("keyWord") + 8, data.indexOf("maxPage") - 1);
  var currPg = parseInt(data.substring(data.indexOf("page") + 5, data.indexOf("keyWord") - 1));
  var maxPg = parseInt(data.substring(data.indexOf("maxPage") + 8, data.length));
  Logger.log(radioKeyword);
  Logger.log(currPg);
  Logger.log(maxPg);
  // echo(selfid, currPg);
  // echo(selfid, radioKeyword);
  // echo(selfid, maxPg);

  var response = search(radioKeyword, 1009);
  Logger.log(response.result.djRadios.length);

  for (var i = 0; i < Math.min(radioPerPage, response.result.djRadios.length); i++) {
    Logger.log(currPg * radioPerPage + i);
    var listObj = response.result.djRadios[currPg * radioPerPage + i]; //one radio show
    var djName = stringJustify(listObj.dj.nickname); //show author name
    var listName = stringJustify(listObj.name); //show name
    var listCover = listObj.picUrl;
    var listId = listObj.id; //show id
    Logger.log(data.toString());
    Logger.log(djName);
    Logger.log(listName);
    keyBoard = {
      "inline_keyboard": [
        [{
          "text": "Find out more⬆",
          'callback_data': netRadioTag + "list" + listId
        }]
      ]
    };
    Logger.log(response.result.djRadios.length - maxPg * radioPerPage);
    if (response.result.djRadios.length > radioPerPage &&
        i == Math.min(radioPerPage, response.result.djRadios.length - currPg * radioPerPage) - 1) {
      //need buttons
      keyBoard.inline_keyboard.push([]);

      if (currPg > 0) {
        //prev btn
        var dataLoadPrev = "?page="+ (currPg - 1).toString() +
          "&keyWord=" + radioKeyword +
          "&maxPage=" + maxPg.toString();
        // echo(selfid, "dataLoadPrev");
        // echo(selfid, encodeURIComponent(dataLoadPrev));
        Logger.log(dataLoadPrev);
        keyBoard.inline_keyboard[1].push(
          {
            "text": "Prev",
            'callback_data': netRadioTag + netRadioPageTag + dataLoadPrev,
          }
        )
      }
      if (currPg < maxPg) {
        //next btn
        // echo(selfid, "Next");
        var dataLoadNxt = "?page="+ (currPg + 1).toString() +
          "&keyWord=" + radioKeyword +
          "&maxPage=" + maxPg.toString();

        // echo(selfid, "dataLoadNxt");
        // echo(selfid, encodeURIComponent(dataLoadNxt));
        keyBoard.inline_keyboard[1].push(
          {
            "text": "Next",
            'callback_data': netRadioTag + netRadioPageTag + dataLoadNxt,
          }
        )
      }
    }
  sendPhotoKB(senderId, listCover, listName + " by " + djName, keyBoard);
  }
}

function search(keyWord, type) {
  var response = UrlFetchApp.fetch(cloudMusicUrl + "/cloudsearch?keywords=" + keyWord
    + "&type=" + type);

  response = JSON.parse(response);
  return response;
}

function chooseShowVol(senderId, callback_data) {
  //first time, we send a new keyboard and update it
  var listId = callback_data.substring(netRadioTag.length + 4, callback_data.length);
  Logger.log(listId);

  var kbNull = { "inline_keyboard": [] };
  var res = sendKB(senderId, "Please select volume⬇", kbNull); //send an empty keyboard first
  res = JSON.parse(res.getContentText());
  var messageId = res.result.message_id;
  var chatId = res.result.chat.id;

  updateKB(chatId, messageId, showVolKB(listId, 0));
}

function updateShowVol(senderId, callback_data) {
  //update the existing keyboard, note that this callback data is different from the above one
  //this callback_data.callback_query.data = the above callback_data
  var response = callback_data.callback_query.data;
  var listId = response.substring(netRadioTag.length + 4, response.indexOf("&offset"));
  Logger.log(listId);
  var offSet = parseInt(response.substring(response.indexOf("&offset") + 7, response.length));
  Logger.log(offSet);
  var messageId = callback_data.callback_query.message.message_id;
  updateKB(senderId, messageId, showVolKB(listId, offSet));
}

function showVolKB(listId, offSet) {
  //helper method of chooseShowVol and updateShowVol, constructs the required keyboard
  var response = UrlFetchApp.fetch(cloudMusicUrl + "/dj/program?rid=" + listId + "&limit=" + "1000");
  response = JSON.parse(response);
  var keyBoard = [];

  for (var i = 0; i < itemPerPage && i < response.count; i++) {
    var currIndex = itemPerPage * offSet + i;
    var showObj = response.programs[currIndex];
    var showTitle = (showObj.mainSong.name);
    var showId = showObj.mainSong.id;
    var showDuration = showObj.mainSong.duration;
    var miniKB = [];
    var showKey = {
      "text": showTitle + " " + Math.round(showDuration / 60000) + "min",
      'callback_data': netRadioTag + "audio" + showId.toString() + "&list" + listId.toString()
    }
    miniKB.push(showKey);
    Logger.log(showTitle + " " + Math.round(showDuration / 60000) + "min");
    keyBoard.push(miniKB);
  }
  //pushing nav buttons
  var navKeys = [];
  currIndex = offSet * itemPerPage + i;
  if (offSet >= 1) {
    if (currIndex == response.count) {
      //last one
      //have previous page
      var navKey = {
        "text": "Prev⬅️",
        'callback_data': netRadioTag + "list" + listId + "&offset" + (offSet - 1)
      }
      navKeys.push(navKey);
    }
    else {
      //not last
      //have pervious
      var prevKey = {
        "text": "Prev⬅️",
        'callback_data': netRadioTag + "list" + listId + "&offset" + (offSet - 1)
      }
      navKeys.push(prevKey);
      var nextKey = {
        "text": "Next➡️",
        'callback_data': netRadioTag + "list" + listId + "&offset" + (offSet + 1)
      }
      navKeys.push(nextKey);
    }
  }
  else {
    //no previous
    if (currIndex != response.count) {
      //has next
      var nextKey = {
        "text": "Next➡️",
        'callback_data': netRadioTag + "list" + listId + "&offset" + (offSet + 1)
      }
      navKeys.push(nextKey);
    }
  }
  keyBoard.push(navKeys);
  var kbFinal =
  {
    "inline_keyboard": keyBoard
  }

  return kbFinal;
}

function getAudio(senderId, rawData) {
  var callback_data = rawData.callback_query.data;
  var audioId = callback_data.substring(12, callback_data.indexOf("&list"));
  var listId = callback_data.substring(callback_data.indexOf("&list") + 5, callback_data.length);
  var keyBoard = [];
  var miniKB = [];

  var showKeys = getTarget(listId, audioId);
  keyBoard.push(showKeys);
  var returnKey = {
    "text": "Return to volume choosing↩️",
    'callback_data': netRadioTag + "list" + listId
  }
  miniKB.push(returnKey);
  keyBoard.push(miniKB);
  var kbFinal =
  {
    "inline_keyboard": keyBoard
  }

  var response = UrlFetchApp.fetch(cloudMusicUrl + "/song/url?id=" + audioId);
  response = JSON.parse(response);
  var sizeMB = Math.floor(response.data[0].size / (Math.pow(1024, 2)));
  var audioLink = response.data[0].url;
  if (sizeMB >= 50) {
    //too large
    echo(senderId, "The audio file is over 50MB, by now I can only send you the link: " + audioLink);
  }
  else {
    var audio = UrlFetchApp.fetch(audioLink).getAs("audio/mpeg");
    sendAudio(senderId, audio, "Enjoy!");
  }
  sendKB(senderId, "Choose what to listen next⬇️", kbFinal);
}

function getTarget(listId, findId) {
  var response = UrlFetchApp.fetch(cloudMusicUrl + "/dj/program?rid=" + listId + "&limit=" + "1000");
  response = JSON.parse(response);
  var targetObj;
  var targetTitle;
  var targetId;
  var targetDuration;
  var targetNextKey;
  var targetPrevKey;
  var miniKB = [];
  for (var currIndex = 0; currIndex < response.programs.length; currIndex++) {
    var showObj = response.programs[currIndex];
    var showId = showObj.mainSong.id;
    // echo(selfid, "showid:" + showId);
    // echo(selfid, "findid: " + findId);
    if (showId == findId) {
      // echo(selfid, "found!");
      if (response.programs.length == 1) {
        //only one show,
        targetPrevKey = {
          "text": "Only one song in this radio playlist",
          'callback_data': "doNothing"
        }
        // echo(selfid, "single");
        miniKB.push(targetPrevKey);
        break;

      }
      else if (currIndex == 0) {
        // first item, show a special button
        // echo(selfid, "first item, show a special button");
        targetPrevKey = {
          "text": "No previous songs available",
          'callback_data': "doNothing"
        }
        targetObj = response.programs[currIndex + 1];
        targetTitle = targetObj.mainSong.name;
        targetId = targetObj.mainSong.id;
        targetDuration = targetObj.mainSong.duration;
        targetNextKey = {
          "text": "Next⏭️ " + targetTitle + " " + Math.round(targetDuration / 60000) + "min",
          'callback_data': netRadioTag + "audio" + targetId.toString() + "&list" + listId
        }
        miniKB.push(targetPrevKey);
        miniKB.push(targetNextKey);
        break;

      }
      else if (currIndex == response.programs.length - 1) {
        // last item
        // echo(selfid, "last item");
        targetObj = response.programs[currIndex - 1];
        targetTitle = targetObj.mainSong.name;
        targetId = targetObj.mainSong.id;
        targetDuration = targetObj.mainSong.duration;
        targetPrevKey = {
          "text": "Prev⏮️ " + targetTitle + " " + Math.round(targetDuration / 60000) + "min",
          'callback_data': netRadioTag + "audio" + targetId.toString() + "&list" + listId
        }
        targetNextKey = {
          "text": "No following songs available",
          'callback_data': "doNothing"
        }
        miniKB.push(targetPrevKey);
        miniKB.push(targetNextKey);
        break;

      }
      else {
        // echo(selfid, "normal");
        targetObj = response.programs[currIndex - 1];
        targetTitle = targetObj.mainSong.name;
        targetId = targetObj.mainSong.id;
        targetDuration = targetObj.mainSong.duration;
        targetPrevKey = {
          "text": "Prev⏮️ " + targetTitle + " " + Math.round(targetDuration / 60000) + "min",
          'callback_data': netRadioTag + "audio" + targetId.toString() + "&list" + listId
        }
        // echo(selfid, targetPrevKey.text);
        targetObj = response.programs[currIndex + 1];
        targetTitle = targetObj.mainSong.name;
        targetId = targetObj.mainSong.id;
        targetDuration = targetObj.mainSong.duration;
        targetNextKey = {
          "text": "Next⏭️ " + targetTitle + " " + Math.round(targetDuration / 60000) + "min",
          'callback_data': netRadioTag + "audio" + targetId.toString() + "&list" + listId
        }
        // echo(selfid, targetNextKey.text);
        miniKB.push(targetPrevKey);
        miniKB.push(targetNextKey);
        // echo(selfid, "finished");
        break;

      }
    }
  }
  return miniKB;
}