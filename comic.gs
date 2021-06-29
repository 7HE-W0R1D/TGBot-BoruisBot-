function comicTest() {
  //comic(selfid, "as", 0, 0);
  //echo(selfid, "hi");
  //sendContent(selfid, "/manhua/9740/11879_164585.html?isend=0?current=23?max=24");
  //comicVol(selfid, "/manhua/703");
  //sendContent(selfid, "/manhua/703/715_7653.html" + "?isend=" + "0" + "?current=" + "2" + "?max=" + "18");
}

function comic(senderId, text, cmdstat, cmdlen) {

  var textlen = text.length;
  var sTitle = text.substring(cmdstat + cmdlen, textlen);
  sTitle = encodeURIComponent(sTitle);

  var url = orgURL + "/search?q=" + sTitle;
  var page = UrlFetchApp.fetch(url);
  var doc = Xml.parse(page, true);
  var bodyHtml = doc.html.body.toXmlString();
  doc = XmlService.parse(bodyHtml).getRootElement();

  var comicList = cList(doc);
  //Logger.log(comicList);

  if (comicList.length == 0) {
    //Logger.log("No Comic Found")
    echo(senderId, "啊哦，没有找到漫画呢");
  }
  else {
    sendComic(senderId, comicList, 1, sTitle);
  }

}


function cList(doc) {
  var comicMax = 100; //Limit the max number of comics to search to improve performance
  var result = getElementsByClassName(doc, "row m-0");

  if (result.length > 1) {
    //have valid result! Go on
    var allWrapper = result[1]; //all tags outside all results
    var allResult = [];

    while (getElementsByClassName(doc, "btn btn-primary mb-1").length != 0 && allResult.length < comicMax) {
      //get all from page, the go to next page
      allResult = getAllFromPage(allWrapper, "comicbook-index mb-2 mb-sm-0", allResult, comicMax);
      var newURL = getElementsByClassName(doc, "btn btn-primary mb-1")[0].getAttribute("href").getValue();
      doc = urlParse(orgURL + newURL);
      var allWrapper = getElementsByClassName(doc, "row m-0")[1]; //all tags outside all results
    }

    if (allResult.length < comicMax) {
      //get again from page
      allResult = getAllFromPage(allWrapper, "comicbook-index mb-2 mb-sm-0", allResult, comicMax);
    }

    return allResult;
  }
  else {
    return [];
  }

}

function getAllFromPage(doc, target, result, comicMax) {
  //A helper method for cList
  var allNewResult = getElementsByClassName(doc, target);
  for (var i = 0; i < allNewResult.length; i++) {
    if (result.length == comicMax) {
      //limit max comic number
      break;
    }
    //Push the actual Comic Cover Object into the array
    var comicT = allNewResult[i].getChild("a")
    var cTitle = comicT.getAttribute("title").getValue();//  想要比我大2岁左右的这样的女友
    var cCode = comicT.getAttribute("href").getValue();  //  /manhua/24247
    var cCover = comicT.getChild("img").getAttribute("src").getValue();
    var info = [cTitle, cCode, cCover];
    result.push(info);
  }
  return result;
}

function sendComic(senderId, coverList, x, sTitle) {
  //x is the current comic's index (starting from 1)

  var prefix = "#";
  var keyBoard = {};

  for (; x % 5 != 0 && x < coverList.length; x++) {
    // Logger.log(x-1);
    var title = coverList[x - 1][0];
    title = title.replace(/[\(\)\|\-=#*>_<~@{}\[\]\\:%!]/gi, "");
    var backData = coverList[x - 1][1];
    var cover = coverList[x - 1][2];

    if (cover.indexOf("https") == -1) {
      cover = orgURL + "/" + cover;
      coverList[x - 1][2] = cover;
    }

    // Logger.log(title + backData + cover);
    keyBoard = {
      "inline_keyboard": [
        [{
          "text": "Read this⬆",
          'callback_data': backData
        }]
      ]
    };
    sendPhotoKB(senderId, cover, title, keyBoard);

  }
  var title = coverList[x - 1][0];
  title = title.replace(/[\(\)\-=#*>_<~@{}\[\]\\:%!]/gi, "");
  var backData = coverList[x - 1][1];
  var cover = coverList[x - 1][2];


  if (cover.indexOf("https") == -1) {
    cover = orgURL + "/" + cover;
    coverList[x - 1][2] = cover;
  }

  if (x == coverList.length && coverList.length >= 6) {
    //no next page, have prev page
    //echo(senderId, "no next");
    var prevX = x - (x % 5) - 4;
    keyBoard = {
      "inline_keyboard": [
        [{
          "text": "Read this⬆",
          'callback_data': backData
        }],
        [{
          "text": "Prev",
          'callback_data': sTitle + prefix + prevX.toString()
        }],
      ]
    }

  }
  if (x <= 5 && coverList.length > 5) {
    //no prev page
    keyBoard = {
      "inline_keyboard": [
        [{
          "text": "Read this⬆",
          'callback_data': backData
        }],
        [{
          "text": "Next",
          'callback_data': sTitle + prefix + (x + 1).toString()
        }],
      ]
    }

  }
  if (x > 5 && x != coverList.length) {
    keyBoard = {
      "inline_keyboard": [
        [{
          "text": "Read this⬆",
          'callback_data': backData
        }],
        [{
          "text": "Prev",
          'callback_data': sTitle + prefix + (x - 9).toString()
        },
        {
          "text": "Next",
          "callback_data": sTitle + prefix + (x + 1).toString()
        }
        ],
      ]
    }
  }
  if (x <= 5 && x == coverList.length) {
    //only one page, reaches the end
    keyBoard = {
      "inline_keyboard": [
        [{
          "text": "Read this⬆",
          'callback_data': backData
        }]
      ]
    };
  }

  sendPhotoKB(senderId, cover, title, keyBoard);
};

function comicVol(senderId, callback_data) {

  var volCode = callback_data;
  var root = urlParse(orgURL + volCode);
  var vol = getElementsByClassName(root, "sort_div fixed-wd-num");

  if (vol.length == 0) {
    vol = getElementsByClassName(root, "sort_div");
  }

  var volUrlList = [];
  for (var x = 0; x < vol.length; x++) {

    var volUrl = vol[x].getChild("a").getAttribute("href").getValue();
    var volTitle = vol[x].getChild("a").getAttribute("title").getValue();
    volUrlList.push([volUrl, volTitle]);

  }

  var kbNull = { "inline_keyboard": [] };
  var res = sendKB(senderId, "Please select volume⬇", kbNull); //send an empty keyboard first
  res = JSON.parse(res.getContentText());
  var messageId = res.result.message_id;
  // Logger.log(messageId);
  var chatId = res.result.chat.id;
  // Logger.log(chatId);
  var keyBoard = getVolKB(volUrlList, volCode, 1, messageId, chatId);
  // Logger.log(keyBoard);
  updateKB(chatId, messageId, keyBoard); //add content after

}

function getVolKB(volUrlList, volCode, c, messageId, chatId) {

  var title;
  var callBackurl; //  /manhua/703/715_7653.html
  var prefix = "$";
  var keyBoard = [];
  var miniKB = [];

  if (c == undefined) {
    c = 1;
  }

  var isEnd = 0;
  for (; c % 10 != 0 && c < volUrlList.length; c++) {

    var posX = ((c - 1) % 10) % 2;
    isEnd = 0;

    if (c == 1 && posX != 1) {
      isEnd = -1;
    }
    title = volUrlList[c - 1][1];
    callBackurl = volUrlList[c - 1][0];
    var num = c;
    var max = volUrlList.length;
    var singleKey =
    {
      "text": title,
      'callback_data': callBackurl + "?isend=" + isEnd.toString() + "?current=" + num.toString() + "?max=" + max.toString()
      //这里的callbackurl有/manhua/还有下划线，与上一个做区分。
    }

    if (posX != 1) {
      //不是右侧的
      miniKB.push(singleKey);
    }
    else if (posX == 1) {
      //
      miniKB.push(singleKey);
      keyBoard.push(miniKB);
      miniKB = [];

    }
  }

  if (c <= 10 && c == volUrlList.length) {
    //短且最后一个 no nav
    var num = c;
    var max = volUrlList.length;
    isEnd = 1;
    title = volUrlList[c - 1][1];
    callBackurl = volUrlList[c - 1][0];
    var singleKey =
    {
      "text": title,
      'callback_data': callBackurl + "?isend=" + isEnd.toString() + "?current=" + num.toString() + "?max=" + max.toString()
    }

    miniKB.push(singleKey);
    keyBoard.push(miniKB);
    miniKB = [];
  }

  if (c >= 10 && c == volUrlList.length) {
    //长 最后 only prev
    var num = c;
    var max = volUrlList.length;
    isEnd = 1;
    title = volUrlList[c - 1][1];
    callBackurl = volUrlList[c - 1][0];
    var singleKey =
    {
      "text": title,
      'callback_data': callBackurl + "?isend=" + isEnd.toString() + "?current=" + num.toString() + "?max=" + max.toString()
    }

    miniKB.push(singleKey);
    keyBoard.push(miniKB);
    miniKB = [];

    var prevC = c - (c % 10) - 9;
    var prevK =
    {
      "text": "Prev",
      'callback_data': volCode + prefix + prevC.toString() + "msg" + messageId.toString() + "chat" + chatId.toString()
    }
    miniKB.push(prevK);
    keyBoard.push(miniKB);
    miniKB = [];

  }

  if (c == 10 && volUrlList.length >= 11) {
    //长 第一页 only next
    var num = c;
    var max = volUrlList.length;
    isEnd = 0;
    title = volUrlList[c - 1][1];
    callBackurl = volUrlList[c - 1][0];
    var singleKey =
    {
      "text": title,
      'callback_data': callBackurl + "?isend=" + isEnd.toString() + "?current=" + num.toString() + "?max=" + max.toString()
    }
    //echo(selfid, "here!");    
    miniKB.push(singleKey);
    keyBoard.push(miniKB);
    miniKB = [];

    var nextK =
    {
      "text": "Next",
      'callback_data': volCode + prefix + (c + 1).toString() + "msg" + messageId.toString() + "chat" + chatId.toString()
    }
    miniKB.push(nextK);
    keyBoard.push(miniKB);
    miniKB = [];
  }

  if (c > 10 && c != volUrlList.length && volUrlList.length >= 11) {
    //normal prev&next
    var num = c;
    var max = volUrlList.length;
    isEnd = 0;
    title = volUrlList[c - 1][1];
    callBackurl = volUrlList[c - 1][0];
    var singleKey =
    {
      "text": title,
      'callback_data': callBackurl + "?isend=" + isEnd.toString() + "?current=" + num.toString() + "?max=" + max.toString()
    }

    miniKB.push(singleKey);
    keyBoard.push(miniKB);
    miniKB = [];
    var prevK = {
      "text": "Prev",
      'callback_data': volCode + prefix + (c - 19).toString() + "msg" + messageId.toString() + "chat" + chatId.toString()
    }
    miniKB.push(prevK);

    var nextK = {
      "text": "Next",
      'callback_data': volCode + prefix + (c + 1).toString() + "msg" + messageId.toString() + "chat" + chatId.toString()
    }
    miniKB.push(nextK);
    keyBoard.push(miniKB);
    miniKB = [];
  }

  var kbFinal =
  {
    "inline_keyboard": keyBoard
  }
  return kbFinal
}

function quickAllPG(comicCode) {
  var urlC = orgURL + comicCode;
  var pageFlag = "_p";
  var currPage = 1;
  var allPG = [];
  var currURL = urlC.substr(0, urlC.length - 5) + pageFlag + currPage + urlC.substr(urlC.length - 5, urlC.length); //seperate the .html and instert info
  var picElement = getElementsByClassName(urlParse(currURL), "img-fluid show-pic");
  while (picElement.length != 0) {
    var picUrl = picElement[0].getAttribute("src").getValue();
    allPG.push(picUrl);
    currPage++;
    currURL = urlC.substr(0, urlC.length - 5) + pageFlag + currPage + urlC.substr(urlC.length - 5, urlC.length); //update url
    picElement = getElementsByClassName(urlParse(currURL), "img-fluid show-pic");
  }
  //Logger.log(allPG.length);
  return allPG;
}


function sendContent(senderId, comicCode) {

  var bakCode = comicCode;
  var comicURL = comicCode.substring(0, comicCode.lastIndexOf("?isend="));
  var isEnd = comicCode.substring((comicCode.lastIndexOf("?isend=") + 7), comicCode.indexOf("?current="));
  isEnd = parseInt(isEnd);
  var pgURL = quickAllPG(comicURL);

  var len = pgURL.length;
  var round = (len - (len % 10)) / 10 + Math.ceil((len % 10) / 10); //every group 10 pics, round is how many groups there will be
  var photo = {};
  var photoArr = [];
  for (var x = 0; x < (round - 1); x++) {
    //full groups(10 items), processed here

    //first pic, with caption
    photo = {
      type: "photo",
      media: pgURL[0],
      caption: "第" + quickAR2CN(x + 1) + "部分",
    };
    photoArr.push(photo);
    pgURL.shift();

    for (var k = 1; k < 10; k++) {
      //next 9 pics without captions
      photo = {
        type: "photo",
        media: pgURL[0]
      };
      photoArr.push(photo);
      pgURL.shift();
    }
    sendAlbum(senderId, photoArr);
    photoArr = [];
    Utilities.sleep(2000);
  }

  //last group processed here
  x++;

  photoArr = [];
  photo = {
    type: "photo",
    media: pgURL[0],
    caption: "第" + quickAR2CN(x) + "部分",
  };
  photoArr.push(photo);
  pgURL.shift();
  len = pgURL.length; //how many pics are left here

  for (var y = 0; y < len; y++) {
    photo = {
      type: "photo",
      media: pgURL[0]
    };
    photoArr.push(photo);
    pgURL.shift();
  }

  sendAlbum(senderId, photoArr);

  endContent(senderId, bakCode);
}


function endContent(senderId, comicCode) {

  //  /manhua/9740/11879_164585.html?isend=0?current=23?max=24
  var senderId = senderId;
  var sendBackcode = comicCode.substring(0, comicCode.lastIndexOf("?isend="));
  var fullCode = sendBackcode;
  var isEnd = comicCode.substring((comicCode.lastIndexOf("?isend=") + 7), comicCode.lastIndexOf("?current=")); //is it the last volume?
  isEnd = parseInt(isEnd);
  var current = comicCode.substring((comicCode.lastIndexOf("?current=") + 9), comicCode.lastIndexOf("?max="));
  current = parseInt(current);
  var max = comicCode.substring((comicCode.lastIndexOf("?max=") + 5), comicCode.length); //number of last volume
  max = parseInt(max);
  var rewind = comicCode.substring(0, comicCode.lastIndexOf("/")); //back to the volume choosing page
  var volCode = rewind;

  var root = urlParse(orgURL + volCode);
  var vol = getElementsByClassName(root, "sort_div fixed-wd-num");
  //Logger.log(vol);
  var nextUrl;
  var prevUrl;

  for (var x = 0; x < vol.length; x++) {

    var volUrl = vol[x].getChild("a").getAttribute("href").getValue();
    if (volUrl == fullCode && isEnd == -1 && vol.length > 1) {
      nextUrl = vol[x + 1].getChild("a").getAttribute("href").getValue();
    }

    if (volUrl == fullCode && isEnd == 0) {
      //Logger.log(vol);
      nextUrl = vol[x + 1].getChild("a").getAttribute("href").getValue();
      prevUrl = vol[x - 1].getChild("a").getAttribute("href").getValue();
    }

    if (volUrl == fullCode && isEnd == 1) {
      prevUrl = vol[x - 1].getChild("a").getAttribute("href").getValue();
    }

  }

  var keyBoard = [];
  var rewindKey =
    [{
      "text": "回到选集",
      'callback_data': rewind
    }];
  keyBoard.push(rewindKey);

  if (isEnd == -1 && vol.length > 1) {
    //first vol  
    //callBackurl + "?isend=" + isEnd.toString() + "?current=" +  + "?max="
    var nextNum;
    var nextIsEnd;
    if ((current + 1) == max) {
      //will be last page
      nextIsEnd = 1;
      nextNum = current + 1;
    }
    if ((current + 1) != max) {
      //will not be last page
      nextIsEnd = 0;
      nextNum = current + 1;
    }

    var navKeys =
      [{
        "text": "下一集",
        'callback_data': nextUrl + "?isend=" + nextIsEnd.toString() + "?current=" + nextNum.toString() + "?max=" + max.toString()
      }];
    keyBoard.push(navKeys);
  }

  if (isEnd == -1 && vol.length == 1) {
    //first vol only vol
    var navKeys = [];
    keyBoard.push(navKeys);
  }

  if (isEnd == 0) {
    //mid vol

    var nextNum;
    var prevNum;
    var nextIsEnd;
    var prevIsEnd;

    if ((current + 1) == max) {
      //will be last page
      nextIsEnd = 1;
      nextNum = current + 1;
    }
    if ((current + 1) != max) {
      //will not be last page
      nextIsEnd = 0;
      nextNum = current + 1;
    }
    if ((current - 1) == max) {
      //will be first page
      prevIsEnd = 1;
      prevNum = current - 1;
    }
    if ((current - 1) != max) {
      //will not be first page
      prevIsEnd = 0;
      prevNum = current - 1;
    }

    var navKeys =
      [{
        "text": "上一集",
        'callback_data': prevUrl + "?isend=" + prevIsEnd.toString() + "?current=" + prevNum.toString() + "?max=" + max.toString()
      },
      {
        "text": "下一集",
        'callback_data': nextUrl + "?isend=" + nextIsEnd.toString() + "?current=" + nextNum.toString() + "?max=" + max.toString()
      }];
    keyBoard.push(navKeys);
  }

  if (isEnd == 1) {
    //last vol
    var prevNum;
    var prevIsEnd;
    if ((current - 1) == max) {
      //will be first page (only 2 in total)
      prevIsEnd = 1;
      prevNum = current - 1;
    }
    if ((current - 1) != max) {
      //will not be first page
      prevIsEnd = 0;
      prevNum = current - 1;
    }

    var navKeys =
      [{
        "text": "上一集",
        'callback_data': prevUrl + "?isend=" + prevIsEnd.toString() + "?current=" + prevNum.toString() + "?max=" + max.toString()
      }];
    keyBoard.push(navKeys);
  }
  var finalKB = {
    "inline_keyboard": keyBoard
  }
  //Logger.log(JSON.stringify(finalKB));

  sendKB(senderId, "本集已读完~", finalKB);
}

function comicPage(senderId, callback_data) {

  var x;
  var sTitle = "";
  //var orgurl = "https://www.manhuadb.com/search?q=";
  //echo(selfid, "CP3");

  if (callback_data.indexOf("#") != -1) {

    x = parseInt(callback_data.substring(callback_data.indexOf("#") + 1, callback_data.length));
    sTitle = callback_data.substring(0, callback_data.indexOf("#"));
  }

  doc = urlParse(orgURL + "/search?q=" + sTitle)
  sendComic(senderId, cList(doc), x, sTitle);
}

function updateVol(senderId, callback_data) {
  //  /manhua/9740$11msg2397chatselfid
  // 

  //'callback_data': volCode + prefix + (c - 19).toString() + "msg" + messageId + "chat" + chatId
  var callback_data = callback_data;
  var prefixPos = callback_data.indexOf("$");
  var volCode = callback_data.substring(0, prefixPos);
  var c = callback_data.substring(prefixPos + 1, callback_data.indexOf("msg"));
  c = parseInt(c);
  var messageId = parseInt(callback_data.substring(callback_data.indexOf("msg") + 3, callback_data.indexOf("chat")));
  var chatId = parseInt(callback_data.substring(callback_data.indexOf("chat") + 4, callback_data.length));
  // Logger.log(volCode + " c: " + c + " msgid: " + messageId + " chatid: " + chatId);

  var root = urlParse(orgURL + volCode)
  var vol = getElementsByClassName(root, "sort_div fixed-wd-num");
  // Logger.log(vol);

  var volUrlList = [];
  for (var x = 0; x < vol.length; x++) {

    var volUrl = vol[x].getChild("a").getAttribute("href").getValue();
    // Logger.log(volUrl);
    var volTitle = vol[x].getChild("a").getAttribute("title").getValue();
    volUrlList.push([volUrl, volTitle]);

  }

  var keyBoard = getVolKB(volUrlList, volCode, c, messageId, chatId);
  updateKB(chatId, messageId, keyBoard);

}
