var netRadioTag = "NRadio:";
var revTag = "#rev";
var itemPerPage = 5;

function netMusicTest() {
  //radioSearch("ASOUL", selfid);
  //chooseShowVol(selfid, "NRadio:list962908523");
  //updateShowVol(selfid, "NRadio:list962908523&offset1");
  // var fetchParameters = {};
  //     fetchParameters.muteHttpExceptions = true;
  // var url = "http://m7.music.126.net/20210628014032/202a734196924c07291b71a3410f95ec/ymusic/obj/w5zDlMODwrDDiGjCn8Ky/9383253787/6b90/33ce/f057/758b749f2bf551e35bf5341a8227a520.mp3";
  // var audio = UrlFetchApp.fetch(url).getAs("audio/mpeg");
  // Logger.log(audio.getName());
  // sendAudio(selfid, audio, "hello");
  // var audioId = 1850338674;
  // var response = UrlFetchApp.fetch(cloudMusicUrl + "/song/url?id=" + audioId);
  // response = JSON.parse(response);
  // var sizeMB = Math.ceil(response.data[0].size / (Math.pow(1024, 2)));
  // Logger.log(sizeMB);
  // sendAudioLink(selfid, url, "Hi");
  // var url1 = "NRadio:audio1855020018";
  // var url2 = "NRadio:audio1852544927";
  // Logger.log(url1 == url2);
  // var keyBoard = [];
  // var miniKB = [];
  // var listId = 963261078;
  // var audioId = 1855767175;
  // getTarget(listId, audioId);
  // var showKeys = getTarget(listId, audioId);
  // keyBoard.push(showKeys);
  // var returnKey = {
  //     "text": "Return to volume choosing↩️",
  //     'callback_data': netRadioTag + "list" + listId
  //   }
  // miniKB.push(returnKey);
  // keyBoard.push(miniKB);
  // var kbFinal =
  // {
  //   "inline_keyboard": keyBoard
  // }
  // sendKB(selfid, "Choose what to listen next⬇️", kbFinal);
  // url = "https://netease-cloud-music-api-olog5c9nw-7he-w0r1d.vercel.app/cloudsearch?keywords=ssssssssssssiiiicjirwf&type=1009&limit=5";
  // var response = UrlFetchApp.fetch(url);
  // response = JSON.parse(response);
  // Logger.log(JSON.stringify(response.result) === JSON.stringify({}));
  // echo(selfid, encodeURIComponent("Your search did not match any radio playlists.\nTry changing your keyword."));
}


function netRadio(senderId, text, cmdstat, cmdlen) {
  var textlen = text.length;
  var keyWord = text.substring(cmdstat + cmdlen, textlen);
  var isRev = false;

  if (keyWord.indexOf(revTag) != -1) {
    // revert order
    keyWord = keyWord.substring(0, keyWord.indexOf(revTag));
    isRev = true;
  }

  var response = search(keyWord, 1009);

  if (JSON.stringify(response.result) === JSON.stringify({})) {
    echo(senderId,
      encodeURIComponent("Your search did not match any radio playlists.\nTry changing your keyword."));
    return;
  }

  for (var i = 0; i < 10 && i < response.result.djRadios.length; i++) {
    var listObj = response.result.djRadios[i]; //one radio show
    var djName = listObj.dj.nickname; //show author name
    var listName = listObj.name; //show name
    var listCover = listObj.picUrl;
    var listId = listObj.id; //show id
    Logger.log(listCover);
    keyBoard = {
      "inline_keyboard": [
        [{
          "text": "Find out more⬆",
          'callback_data': netRadioTag + "list" + listId + "&rev" + isRev
        }]
      ]
    };
    sendPhotoKB(senderId, listCover, listName + " by " + djName, keyBoard);
  }
}

function search(keyWord, type) {
  var response = UrlFetchApp.fetch(cloudMusicUrl + "/cloudsearch?keywords=" + keyWord
    + "&limit=10" + "&type=" + type);

  response = JSON.parse(response);
  return response;
}

function chooseShowVol(senderId, callback_data) {
  //first time, we send a new keyboard and update it
  var listId = callback_data.substring(11, callback_data.indexOf("&rev"));
  var isRev = callback_data.substring(callback_data.indexOf("&rev") + 4); // &rev
  Logger.log(listId);

  var kbNull = { "inline_keyboard": [] };
  var res = sendKB(senderId, "Please select volume⬇", kbNull); //send an empty keyboard first
  res = JSON.parse(res.getContentText());
  var messageId = res.result.message_id;
  var chatId = res.result.chat.id;

  updateKB(chatId, messageId, showVolKB(listId, 0, isRev));
}

function updateShowVol(senderId, callback_data) {
  //update the existing keyboard, note that this callback data is different from the above one
  //this callback_data.callback_query.data = the above callback_data
  var response = callback_data.callback_query.data;
  var listId = response.substring(11, response.indexOf("&offset"));
  Logger.log(listId);
  //echo(selfid, listId);
  var offSet = parseInt(response.substring(response.indexOf("&offset") + 7, response.indexOf("&rev")));
  var isRev = response.substring(response.indexOf("&rev") + 4); // &rev
  Logger.log(offSet);
  //echo(selfid, "offset" + offSet);
  var messageId = callback_data.callback_query.message.message_id;
  //echo(selfid, messageId);
  updateKB(senderId, messageId, showVolKB(listId, offSet, isRev));
}

function showVolKB(listId, offSet, isRev) {
  //helper method of chooseShowVol and updateShowVol, constructs the required keyboard
  var response = UrlFetchApp.fetch(cloudMusicUrl + "/dj/program?rid=" + listId + "&limit=" + "1000" + "&asc=" + isRev);
  response = JSON.parse(response);
  var keyBoard = [];

  for (var i = 0; i < itemPerPage && i < response.count; i++) {
    var currIndex = itemPerPage * offSet + i;
    var showObj = response.programs[currIndex];
    var showTitle = showObj.mainSong.name;
    var showId = showObj.mainSong.id;
    var showDuration = showObj.mainSong.duration;
    var miniKB = [];
    var showKey = {
      "text": showTitle + " " + Math.round(showDuration / 60000) + "min",
      'callback_data': netRadioTag + "audio" + showId.toString() + "&list" + listId.toString() + "&rev" + isRev
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
        'callback_data': netRadioTag + "list" + listId + "&offset" + (offSet - 1) + "&rev" + isRev
      }
      navKeys.push(navKey);
    }
    else {
      //not last
      //have pervious
      var prevKey = {
        "text": "Prev⬅️",
        'callback_data': netRadioTag + "list" + listId + "&offset" + (offSet - 1) + "&rev" + isRev
      }
      navKeys.push(prevKey);
      var nextKey = {
        "text": "Next➡️",
        'callback_data': netRadioTag + "list" + listId + "&offset" + (offSet + 1) + "&rev" + isRev
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
        'callback_data': netRadioTag + "list" + listId + "&offset" + (offSet + 1) + "&rev" + isRev
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
  var listId = callback_data.substring(callback_data.indexOf("&list") + 5, callback_data.indexOf("&rev"));
  var isRev = callback_data.substring(callback_data.indexOf("&rev") + 4); // &rev
  // echo(selfid, "audioId" + audioId);
  // echo(selfid, "listId" + listId);
  // echo(selfid, "isRev" + isRev);
  // var keyBoard = rawData.callback_query.message.reply_markup.inline_keyboard;
  // var audioName;
  var keyBoard = [];
  var miniKB = [];
  // echo(selfid, keyBoard.length);
  // for (var i = 0; i < keyBoard.length - 1 && i < 5; i++) {
  //   //the last group is the nav button
  //   echo(selfid, i);
  //   var key = keyBoard[i];
  //   key = key[0];
  //   echo(selfid, key.callback_data);
  //   echo(selfid, callback_data);
  //   if (key.callback_data === callback_data) {
  //     audioName = key.text;

  //     echo(selfid, "AudioName: " + audioName);

  //     if (i + 1 < keyBoard.length - 1) {
  //       nextItemKey = keyBoard[i + 1];
  //       echo(selfid, "nextItemKey: " + nextItemKey.length);
  //       // nextItemKey = nextItemKey[0];
  //     }
  //     else {
  //       //fetch the page to get the next item
  //       thisShowId = keyBoard[5][0].callback_data.substring(11, keyBoard[5][0].callback_data.indexOf("&offset"));
  //       nextItemKey = getTarget(keyBoard[5][0], thisShowId, 1);
  //     }

  //     if (i - 1 >= 0) {
  //       prevItemKey = keyBoard[i - 1];
  //       prevItemKey = prevItemKey[0];
  //     }
  //     else {
  //       //fetch the page to get the prev item
  //       thisShowId = keyBoard[5][0].callback_data.substring(11, keyBoard[5][0].callback_data.indexOf("&offset"));
  //       prevItemKey = getTarget(keyBoard[5][0], thisShowId, -1);
  //     }
  //     miniKB.push(prevItemKey);
  //     miniKB.push(nextItemKey);
  //     break;
  //   }
  // }
  var showKeys = getTarget(listId, audioId, isRev);
  keyBoard.push(showKeys);
  var returnKey = {
    "text": "Return to volume choosing↩️",
    'callback_data': netRadioTag + "list" + listId + "&rev" + isRev
  }
  miniKB.push(returnKey);
  keyBoard.push(miniKB);
  var kbFinal =
  {
    "inline_keyboard": keyBoard
  }

  // echo(selfid, "audioReady");
  var response = UrlFetchApp.fetch(cloudMusicUrl + "/song/url?id=" + audioId);
  response = JSON.parse(response);
  var sizeMB = Math.ceil(response.data[0].size / (Math.pow(1024, 2)));

  // echo(selfid, "audioSize: " + sizeMB);
  var audioLink = response.data[0].url;
  // echo(selfid, audioLink);
  if (sizeMB >= 50) {
    //too large
    echo(senderId, "The audio file is over 50MB, by now I can only send you the link: " + audioLink);
  }
  else {
    // var fetchParameters = {};
    // fetchParameters.muteHttpExceptions = true;
    // echo(selfid, "audioLink");
    var audio = UrlFetchApp.fetch(audioLink).getAs("audio/mpeg");
    // echo(selfid, audioName);
    sendAudio(senderId, audio, "Enjoy!");
    // sendAudioLink(senderId, audioLink, audioName);
  }
  sendKB(senderId, "Choose what to listen next⬇️", kbFinal);
}

function getTarget(listId, findId, isRev) {
  var response = UrlFetchApp.fetch(cloudMusicUrl + "/dj/program?rid=" + listId + "&limit=" + "1000" + "&asc=" + isRev);
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
        echo(selfid, "single");
        miniKB.push(targetPrevKey);
        break;

      }
      else if (currIndex == 0) {
        // first item, show a special button
        echo(selfid, "first item, show a special button");
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
          'callback_data': netRadioTag + "audio" + targetId.toString() + "&list" + listId + "&rev" + isRev
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
          'callback_data': netRadioTag + "audio" + targetId.toString() + "&list" + listId + "&rev" + isRev
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
          'callback_data': netRadioTag + "audio" + targetId.toString() + "&list" + listId + "&rev" + isRev
        }
        // echo(selfid, targetPrevKey.text);
        targetObj = response.programs[currIndex + 1];
        targetTitle = targetObj.mainSong.name;
        targetId = targetObj.mainSong.id;
        targetDuration = targetObj.mainSong.duration;
        targetNextKey = {
          "text": "Next⏭️ " + targetTitle + " " + Math.round(targetDuration / 60000) + "min",
          'callback_data': netRadioTag + "audio" + targetId.toString() + "&list" + listId + "&rev" + isRev
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