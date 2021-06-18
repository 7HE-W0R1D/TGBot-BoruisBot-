/*
function doGetme() {
var response = UrlFetchApp.fetch("https://api.telegram.org/bot" + botToken + "/getMe");
Logger.log(response);
}
*/

function setWebhook() {
  var response = UrlFetchApp.fetch("https://api.telegram.org/bot" + botToken + "/setWebhook?url=" + webAppurl);
  Logger.log(response);
}
/*
function deleteWebhook() {
var response = UrlFetchApp.fetch("https://api.telegram.org/bot" + botToken + "/deleteWebhook?url=" + webAppurl);
Logger.log(response);
}

function getUpdate() {
var response = UrlFetchApp.fetch("https://api.telegram.org/bot" + botToken + "/getUpdates");
Logger.log(response);
}
*/

function debug() {
  //Logger.log(setConfig(3,false));
  //Logger.log(getConfig(3));
  //weather(selfid,"/weathernow     Los Angeles    ", "/weathernow", 0,11);
  //Logger.log(AR2CN(-4));//4004 202 11 1 0
  //randLetter(0);
  Voc2CN(selfid, "/trans2CN cigarett", 0, 9);
}

//------Support function here------
/*getconfig
index1: isEcho;

*/
function getConfig(e) {
  var isOn = false;
  var sheet = SpreadsheetApp.openById("10XDXiI7Vc9GTsy207WSniqGWO1TrvmuHKsOAl-lPlPI");
  var data = sheet.getDataRange().getValues();
  var config = new Array();
  for (var i = 0; i < data.length; i++) {
    config.push(data[i][0]);
  }
  Logger.log(config);

  if (config[e - 1]) {
    isOn = true;
  }
  else {
    isOn = false;
  }
  return isOn;
}

function setConfig(e, stat) {
  var sheet = SpreadsheetApp.openById("10XDXiI7Vc9GTsy207WSniqGWO1TrvmuHKsOAl-lPlPI");
  sheet.getRange('A' + e).setValue(stat);
}

function cmdActive() {
  var isActive = false;
  var sheet = SpreadsheetApp.openById("10XDXiI7Vc9GTsy207WSniqGWO1TrvmuHKsOAl-lPlPI");
  var data = sheet.getDataRange().getValues();
  var config = new Array();

  for (var i = 0; i < data.length; i++) {
    config.push(data[i][0]);
    isActive = isActive || data[i][0];
  }
  Logger.log(config);
  Logger.log(isActive);
  return isActive;
}

function AR2CN(temp) {
  var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  var chnUnitChar = ["", "十", "百", "千", "万"];
  var minus = "零下";
  var strIns = '', chnStr = '';
  var unitPos = 0;
  var isZero = false;
  var section = Math.abs(temp);

  while (section > 0) {
    var v = section % 10;
    if (v == 0) {
      if (isZero) {
        strIns = "";
        //个位数为0 不用写“零”
      }
      else {
        strIns = chnNumChar[v];
      }
      isZero = true;
      chnStr = strIns + chnStr;
    }
    else {
      isZero = false;
      if (unitPos == 1 && v == 1) {
        strIns = "";
        //十位数为1 不用写“一”
      }
      else {
        strIns = chnNumChar[v];
      }
      strIns += chnUnitChar[unitPos];
      chnStr = strIns + chnStr;
    }
    unitPos++;
    section = Math.floor(section / 10);
  }
  if (temp < 0) {
    chnStr = minus + chnStr; //加上“零下” 后期酌情加判断条件
  }
  if (temp == 0) {
    chnStr = chnNumChar[0];
  }
  return chnStr;
}

function translate(e) {
  e = e.trim();
  e = e.split(" ").join("");
  var url = "http://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i=" + e;
  var response = UrlFetchApp.fetch(url);
  var response = JSON.parse(response);
  var CN = response.translateResult[0][0].tgt;
  return CN;
}

function isCNdir(e) {
  var CN = "东南西北";
  var CN = CN.split("");
  var e = e.split("");
  var isCN = false;
  for (var i in CN) {
    if (e[0] == CN[i]) {
      //Logger.log("is CN");
      isCN = true;
      break;
    }
  }
  return isCN;
}

function dirEN2CN(e) {
  var CN = "东南西北";
  var CN = CN.split("");
  var EN = "ESWN";
  var EN = EN.split("");
  var ENdir = e.split("");
  var CNdir = "";

  for (var i in ENdir) {
    //Logger.log(i);
    var dirSingle = ENdir[ENdir.length - i - 1];
    //Logger.log(dirSingle);
    for (var k in EN) {
      if (dirSingle == EN[k]) {
        Logger.log("Found" + k);
        CNdir = CNdir + CN[k];
        break;
      }
    }
  }
  //Logger.log(CNdir);
  return CNdir;
}

function randLetter(e) {
  var str1 = "DEFGHIJKLMNOPQRSTUVWXYZ";
  var array = str1.split("");
  var n = Math.round(Math.random() * e);
  var rand = array[n];
  Logger.log(rand);
  return rand;
}

function randNum(e)//generate numbers from 0 to e - 1;
{
  var n = Math.floor(Math.random() * e);
  //Logger.log(n);
  //Logger.log(Math.random());
  return n;
}


function sendContent(senderid, comicCode) {

  var bakCode = comicCode;
  var comicCode = comicCode.substring(0, comicCode.lastIndexOf("?isend="));
  var fullCode = comicCode;
  //Logger.log(comicCode);
  var isend = comicCode.substring((comicCode.lastIndexOf("?isend=") + 7), comicCode.indexOf("?current="));
  isend = parseInt(isend);
  //Logger.log(isend);

  var pgurl = allpg(comicCode);
  //Logger.log(pgurl);

  var len = pgurl.length;
  var round = (len - (len % 10)) / 10 + ((len % 10) / (len % 10));
  //Logger.log(round);
  var photo = {};
  var photoArr = [];
  for (var x = 0; x < (round - 1); x++) {

    photo = {
      type: "photo",
      media: pgurl[0],
      caption: "第" + AR2CN(x + 1) + "部分",
    };
    photoArr.push(photo);

    //Logger.log("***Round: " + (x+1) + " URL: " + pgurl[0]);
    pgurl.shift();

    for (var k = 1; k < 10; k++) {
      photo = {
        type: "photo",
        media: pgurl[0]
      };
      photoArr.push(photo);

      //Logger.log("Round: " + (x+1) + " URL: " + pgurl[0]);
      pgurl.shift();
    }
    //Logger.log("Arr len: " + photoArr.length);
    //Logger.log("Send! " + x);
    sendAlbum(senderid, photoArr);
    photoArr = [];
  }

  x++;
  photoArr = [];
  photo = {
    type: "photo",
    media: pgurl[0],
    caption: "第" + AR2CN(x) + "部分",
  };
  photoArr.push(photo);

  //Logger.log("***Round: " + (x+1) + " URL: " + pgurl[0]);
  pgurl.shift();
  len = pgurl.length;
  for (var y = 0; y < len; y++) {
    photo = {
      type: "photo",
      media: pgurl[0]
    };
    photoArr.push(photo);
    //Logger.log("Round: " + (x+1) + " URL: " + pgurl[0]);
    pgurl.shift();
  }

  sendAlbum(senderid, photoArr);

  endContent(senderid, bakCode);
}

function endContent(senderid, comicCode) {


  //var comicCode = "/manhua/9740/11879_164585.html?isend=0?current=23?max=24";
  var senderid = senderid;

  var sendBackcode = comicCode.substring(0, comicCode.lastIndexOf("?isend="));
  //Logger.log(sendBackcode);
  var fullCode = sendBackcode;

  var isend = comicCode.substring((comicCode.lastIndexOf("?isend=") + 7), comicCode.lastIndexOf("?current="));
  isend = parseInt(isend);
  //Logger.log(isend);

  var current = comicCode.substring((comicCode.lastIndexOf("?current=") + 9), comicCode.lastIndexOf("?max="));
  current = parseInt(current);
  //Logger.log(current);

  var max = comicCode.substring((comicCode.lastIndexOf("?max=") + 5), comicCode.length);
  max = parseInt(max);
  //Logger.log(max);
  var rewind = comicCode.substring(0, comicCode.lastIndexOf("/"));


  var orgurl = "https://www.manhuadb.com";
  var volCode = rewind;
  //var senderid = selfid;

  var urlc = orgurl + volCode;
  Logger.log(urlc);
  var contentc = UrlFetchApp.fetch(urlc).getContentText();
  var page = UrlFetchApp.fetch(urlc);
  var doc = Xml.parse(page, true);
  var bodyHtml = doc.html.body.toXmlString();
  doc = XmlService.parse(bodyHtml);
  var root = doc.getRootElement();
  var y = root.getChild("div");
  Logger.log(y);
  var vol;
  vol = getBy(y, "row m-0 mt-lg-3", "class", "div");
  vol = getBy(vol, "col-lg-9 px-0", "class", "div");
  vol = getBy(vol, "comic-toc-section bg-white p-3", "class", "div");
  vol = vol.getChild("div").getChild("div").getChild("ol").getChildren();
  //Logger.log(vol);
  //Logger.log(vol.length);
  var nextUrl;
  var prevUrl;

  for (var x = 0; x < vol.length; x++) {

    var volUrl = vol[x].getChild("a").getAttribute("href").getValue();
    if (volUrl == fullCode && isend == -1 && vol.length > 1) {
      nextUrl = vol[x + 1].getChild("a").getAttribute("href").getValue();
    }

    if (volUrl == fullCode && isend == 0) {
      Logger.log(vol);
      nextUrl = vol[x + 1].getChild("a").getAttribute("href").getValue();
      prevUrl = vol[x - 1].getChild("a").getAttribute("href").getValue();
    }

    if (volUrl == fullCode && isend == 1) {
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

  if (isend == -1 && vol.length > 1) {
    //first vol  
    //callBackurl + "?isend=" + isend.toString() + "?current=" +  + "?max="
    var nextnum;
    var nextisend;
    if ((current + 1) == max) {
      //will be last page
      nextisend = 1;
      nextnum = current + 1;
    }
    if ((current + 1) != max) {
      //will not be last page
      nextisend = 0;
      nextnum = current + 1;
    }

    var navKeys =
      [{
        "text": "下一集",
        'callback_data': nextUrl + "?isend=" + nextisend.toString() + "?current=" + nextnum.toString() + "?max=" + max.toString()
      }];
    keyBoard.push(navKeys);
  }

  if (isend == -1 && vol.length == 1) {
    //first vol only vol
    var navKeys =
      [];
    keyBoard.push(navKeys);
  }

  if (isend == 0) {
    //mid vol

    var nextnum;
    var prevnum;
    var nextisend;
    var previsend;

    if ((current + 1) == max) {
      //will be last page
      nextisend = 1;
      nextnum = current + 1;
    }
    if ((current + 1) != max) {
      //will not be last page
      nextisend = 0;
      nextnum = current + 1;
    }
    if ((current - 1) == max) {
      //will be first page
      previsend = 1;
      prevnum = current - 1;
    }
    if ((current - 1) != max) {
      //will not be first page
      previsend = 0;
      prevnum = current - 1;
    }

    var navKeys =
      [{
        "text": "上一集",
        'callback_data': prevUrl + "?isend=" + previsend.toString() + "?current=" + prevnum.toString() + "?max=" + max.toString()
      },
      {
        "text": "下一集",
        'callback_data': nextUrl + "?isend=" + nextisend.toString() + "?current=" + nextnum.toString() + "?max=" + max.toString()
      }];
    keyBoard.push(navKeys);
  }

  if (isend == 1) {
    //last vol
    var prevnum;
    var previsend;
    if ((current - 1) == max) {
      //will be first page (only 2 in total)
      previsend = 1;
      prevnum = current - 1;
    }
    if ((current - 1) != max) {
      //will not be first page
      previsend = 0;
      prevnum = current - 1;
    }

    var navKeys =
      [{
        "text": "上一集",
        'callback_data': prevUrl + "?isend=" + previsend.toString() + "?current=" + prevnum.toString() + "?max=" + max.toString()
      }];
    keyBoard.push(navKeys);
  }
  var KB = {
    "inline_keyboard": keyBoard
  }
  Logger.log(JSON.stringify(KB));

  sendKB(senderid, "本集已读完~", KB);
}

function allpg(comicCode) {
  var orgurl = "https://www.manhuadb.com";
  orgurl = orgurl + comicCode;
  var page = "_p";
  var pagenum = 1;
  var allpgs = [];
  var url = orgurl.substr(0, orgurl.length - 5) + page + pagenum + orgurl.substr(-5, 5);
  //Logger.log(url);
  //allpgs.push(url);

  for (pagenum1 = 0; UrlFetchApp.fetch(url).getContentText().indexOf('<img class="img-fluid show-pic" src="') != -1; pagenum++) {
    var url = orgurl.substr(0, orgurl.length - 5) + page + pagenum + orgurl.substr(-5, 5);
    //Logger.log(url);
    allpgs.push(url);
  }
  allpgs.pop();
  var picUrl = [];
  for (var x = 0; x < allpgs.length; x++) {

    picUrl.push(findPic(allpgs[x]));
  }
  return (picUrl);

}

function findPic(callback_data) {

  var urlc = callback_data;
  var contentc = UrlFetchApp.fetch(urlc).getContentText();
  //Logger.log(contentc);
  var page = UrlFetchApp.fetch(urlc);
  var doc = Xml.parse(page, true);
  var bodyHtml = doc.html.body.toXmlString();
  doc = XmlService.parse(bodyHtml);
  var root = doc.getRootElement();
  var y = root.getChild("div");
  //Logger.log(y.getAttribute("class").getValue());
  var kids = y.getChildren();
  //Logger.log(kids);
  var picurl = kids[4];
  picurl = picurl.getChildren();
  picurl = picurl[2];
  picurl = picurl.getChildren();
  picurl = picurl[1];
  picurl = picurl.getChildren();
  picurl = picurl[0];
  //Logger.log(picurl)
  picurl = picurl.getAttribute("src").getValue();
  //Logger.log(picurl); 
  return picurl
}

function search(content, fromText, toText, marginf, marginr) {

  var index1 = content.indexOf(fromText);
  //Logger.log(index1);
  var slice1 = content.substring(index1 + marginf, index1 + marginr);
  //Logger.log(slice1);
  var index2 = slice1.indexOf(toText);
  slice1 = slice1.substring(0, index2);
  //Logger.log(slice1); 
  return slice1;
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
  //echo(chatId, "CP2");
  UrlFetchApp.fetch('https://api.telegram.org/bot' + botToken + '/', data);
}

function comicVol(senderid, callback_data) {

  var orgurl = "https://www.manhuadb.com";
  var volCode = callback_data;
  //var senderid = selfid;

  var urlc = orgurl + volCode;
  var contentc = UrlFetchApp.fetch(urlc).getContentText();
  var page = UrlFetchApp.fetch(urlc);
  var doc = Xml.parse(page, true);
  var bodyHtml = doc.html.body.toXmlString();
  doc = XmlService.parse(bodyHtml);
  var root = doc.getRootElement();
  var y = root.getChild("div");
  //Logger.log(y);
  var vol;
  vol = getBy(y, "row m-0 mt-lg-3", "class", "div");
  vol = getBy(vol, "col-lg-9 px-0", "class", "div");
  vol = getBy(vol, "comic-toc-section bg-white p-3", "class", "div");
  vol = vol.getChild("div").getChild("div").getChild("ol").getChildren();
  //Logger.log(vol);
  //Logger.log(vol.length);
  var volUrlList = [];
  for (var x = 0; x < vol.length; x++) {

    var volUrl = vol[x].getChild("a").getAttribute("href").getValue();
    //Logger.log(volUrl);
    var volTitle = vol[x].getChild("a").getAttribute("title").getValue();
    volUrlList.push([volUrl, volTitle]);

  }

  var KBnull = { "inline_keyboard": [] };

  var response = sendKB(senderid, "Please select volume⬇", KBnull);
  var res = response.getContentText();
  res = JSON.parse(res);
  var messageId = res.result.message_id;
  Logger.log(messageId);
  var chatId = res.result.chat.id;
  Logger.log(chatId);
  Logger.log(volUrlList);
  var c = 1;
  var KB = getVolKB(volUrlList, volCode, c, messageId, chatId);
  Logger.log(KB);
  //sendKB(senderid, "test", KB)
  updateKB(chatId, messageId, KB);

}

function updateVol(senderid, callback_data) {
  //  /manhua/9740$11msg2397chatselfid

  //'callback_data': volCode + prefix + (c - 19).toString() + "msg" + messageId + "chat" + chatId
  var callback_data = callback_data;
  var senderid = senderid;
  var prefixPos = callback_data.indexOf("$");
  //Logger.log(prefixPos);
  var volCode = callback_data.substring(0, prefixPos);
  var c = callback_data.substring(prefixPos + 1, callback_data.indexOf("msg"));
  c = parseInt(c);
  var messageId = parseInt(callback_data.substring(callback_data.indexOf("msg") + 3, callback_data.indexOf("chat")));
  var chatId = parseInt(callback_data.substring(callback_data.indexOf("chat") + 4, callback_data.length));
  Logger.log(volCode + " c: " + c + " msgid: " + messageId + " chatid: " + chatId);
  //echo(senderid, volCode + " c: " + c + " msgid: " + messageId + " chatid: " +chatId);

  var orgurl = "https://www.manhuadb.com";
  var urlc = orgurl + volCode;
  //var contentc = UrlFetchApp.fetch(urlc).getContentText();    
  var page = UrlFetchApp.fetch(urlc);
  var doc = Xml.parse(page, true);
  var bodyHtml = doc.html.body.toXmlString();
  doc = XmlService.parse(bodyHtml);
  var root = doc.getRootElement();
  var y = root.getChild("div");
  //Logger.log(y);
  var vol;
  vol = getBy(y, "row m-0 mt-lg-3", "class", "div");
  vol = getBy(vol, "col-lg-9 px-0", "class", "div");
  vol = getBy(vol, "comic-toc-section bg-white p-3", "class", "div");
  vol = vol.getChild("div").getChild("div").getChild("ol").getChildren();
  Logger.log(vol);
  //Logger.log(vol.length);
  var volUrlList = [];
  for (var x = 0; x < vol.length; x++) {

    var volUrl = vol[x].getChild("a").getAttribute("href").getValue();
    //Logger.log(volUrl);
    var volTitle = vol[x].getChild("a").getAttribute("title").getValue();
    volUrlList.push([volUrl, volTitle]);

  }

  var KB = getVolKB(volUrlList, volCode, c, messageId, chatId);
  updateKB(chatId, messageId, KB);

}

function getVolKB(volUrlList, volCode, c, messageId, chatId) {

  var title;
  var callBackurl;
  var prefix = "$";
  var KB = [];
  var miniKB = [];

  if (c == undefined) {

    c = 1;
  }
  var isend = 0;
  for (; c % 10 != 0 && c < volUrlList.length; c++) {

    var posX = ((c - 1) % 10) % 2;
    var posY = (((c - 1) % 10) - (((c - 1) % 10) % 2)) / 2;
    isend = 0;

    if (c == 1 && posX != 1) {

      isend = -1;
    }
    //Logger.log(posX + " - " + posY);
    title = volUrlList[c - 1][1];
    callBackurl = volUrlList[c - 1][0];
    var num = c;
    var max = volUrlList.length;
    var singleKey =
    {
      "text": title,
      'callback_data': callBackurl + "?isend=" + isend.toString() + "?current=" + num.toString() + "?max=" + max.toString()
      //这里的callbackurl有/manhua/还有下划线，与上一个做区分。
    }

    if (posX != 1) {
      //不是右侧的
      miniKB.push(singleKey);
      //Logger.log("left: " + singleKey);
    }
    else if (posX == 1) {
      //
      miniKB.push(singleKey);
      KB.push(miniKB);
      miniKB = [];

    }
  }

  if (c <= 10 && c == volUrlList.length) {
    //短且最后一个 no nav
    var num = c;
    var max = volUrlList.length;
    isend = 1;
    title = volUrlList[c - 1][1];
    callBackurl = volUrlList[c - 1][0];
    var singleKey =
    {
      "text": title,
      'callback_data': callBackurl + "?isend=" + isend.toString() + "?current=" + num.toString() + "?max=" + max.toString()
    }

    miniKB.push(singleKey);
    KB.push(miniKB);
    miniKB = [];
  }

  if (c >= 10 && c == volUrlList.length) {
    //长 最后 only prev
    var num = c;
    var max = volUrlList.length;
    isend = 1;
    title = volUrlList[c - 1][1];
    callBackurl = volUrlList[c - 1][0];
    var singleKey =
    {
      "text": title,
      'callback_data': callBackurl + "?isend=" + isend.toString() + "?current=" + num.toString() + "?max=" + max.toString()
    }

    miniKB.push(singleKey);
    KB.push(miniKB);
    miniKB = [];
    var prevC = c - (c % 10) - 9;
    var prevK =
    {
      "text": "Prev",
      'callback_data': volCode + prefix + prevC.toString() + "msg" + messageId.toString() + "chat" + chatId.toString()
    }
    miniKB.push(prevK);
    KB.push(miniKB);
    miniKB = [];

  }

  if (c == 10 && volUrlList.length >= 11) {
    //长 第一页 only next
    var num = c;
    var max = volUrlList.length;
    isend = 0;
    title = volUrlList[c - 1][1];
    callBackurl = volUrlList[c - 1][0];
    var singleKey =
    {
      "text": title,
      'callback_data': callBackurl + "?isend=" + isend.toString() + "?current=" + num.toString() + "?max=" + max.toString()
    }
    //echo(selfid, "here!");    
    miniKB.push(singleKey);
    KB.push(miniKB);
    miniKB = [];
    var nextK =
    {
      "text": "Next",
      'callback_data': volCode + prefix + (c + 1).toString() + "msg" + messageId.toString() + "chat" + chatId.toString()
    }
    //echo(selfid, volCode + prefix + (c + 1).toString() + "msg" + messageId.toString() + "chat" + chatId.toString());      
    miniKB.push(nextK);
    KB.push(miniKB);
    miniKB = [];
  }

  if (c > 10 && c != volUrlList.length && volUrlList.length >= 11) {
    //normal prev&next
    var num = c;
    var max = volUrlList.length;
    isend = 0;
    title = volUrlList[c - 1][1];
    callBackurl = volUrlList[c - 1][0];
    var singleKey =
    {
      "text": title,
      'callback_data': callBackurl + "?isend=" + isend.toString() + "?current=" + num.toString() + "?max=" + max.toString()
    }

    miniKB.push(singleKey);
    KB.push(miniKB);
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
    KB.push(miniKB);
    miniKB = [];
  }

  //Logger.log(keyBoard);
  var KBfinal =
  {
    "inline_keyboard": KB
  }
  return KBfinal

}

function comic(senderid, text, cmdstat, cmdlen) {

  var orgurl = "https://www.manhuadb.com/search?q=";
  //echo(senderid, text);
  //echo(senderid, cmdstat);
  //echo(senderid, cmdlen);
  var textlen = text.length;
  //Logger.log(textlen);
  var sTitle = text.substring(cmdstat + cmdlen, textlen);
  //echo(senderid, sTitle);
  sTitle = encodeURIComponent(sTitle);

  var url = orgurl + sTitle;
  //Logger.log(url);
  var content = UrlFetchApp.fetch(url).getContentText();
  //Logger.log(content);
  var page = UrlFetchApp.fetch(url);
  var doc = Xml.parse(page, true);
  var bodyHtml = doc.html.body.toXmlString();
  doc = XmlService.parse(bodyHtml);

  var List = cList(doc);
  //Logger.log(List);
  if (List.length == 0) {
    echo(senderid, "啊哦，没有找到漫画呢");
  }
  else {
    var x = 1;//undefined or 1;
    //Logger.log(List.length);

    sendComic(senderid, List, x, sTitle);
  }

}

function comicpage(senderid, callback_data) {

  var x;
  var sTitle = "";
  var orgurl = "https://www.manhuadb.com/search?q=";
  //echo(selfid, "CP3");

  if (callback_data.indexOf("#") != -1) {

    x = parseInt(callback_data.substring(callback_data.indexOf("#") + 1, callback_data.length));
    sTitle = callback_data.substring(0, callback_data.indexOf("#"));
    //Logger.log(pagenum);
    //Logger.log(sTitle);
    //echo(selfid, "CP4");
  }

  var url = orgurl + sTitle;
  //Logger.log(url);
  var content = UrlFetchApp.fetch(url).getContentText();
  //Logger.log(content);
  var page = UrlFetchApp.fetch(url);
  var doc = Xml.parse(page, true);
  var bodyHtml = doc.html.body.toXmlString();
  doc = XmlService.parse(bodyHtml);

  //echo(selfid, "CP5");
  var List = cList(doc);
  //echo(selfid, List.length);
  //echo(selfid, "CP6");
  sendComic(senderid, List, x, sTitle);
}



function sendComic(senderid, List, x, sTitle) {

  var prefix = "#";
  var keyBoard = {};

  if (x == undefined) {
    x = 1;
  }

  for (; x % 5 != 0 && x < List.length; x++) {
    //Logger.log(x-1);
    var Title = List[x - 1][0];
    Title = Title.replace(/[\(\)\-=#*>_<~@{}\[\]\\:%!]/gi, "");
    var Backdata = List[x - 1][1];
    var Cover = List[x - 1][2];
    if (Cover.indexOf("https") == -1) {
      Cover = "https://www.manhuadb.com/" + Cover;
      List[x - 1][2] = Cover;
    }

    //Logger.log(Title + Backdata + Cover);
    keyBoard = {
      "inline_keyboard": [
        [{
          "text": "Read this⬆",
          'callback_data': Backdata
        }]
      ]
    };

    //echo(senderid, "X = " + x);

    sendPhotoKB(senderid, Cover, Title, keyBoard);

  }
  var Title = List[x - 1][0];
  Title = Title.replace(/[\(\)\-=#*>_<~@{}\[\]\\:%!]/gi, "");
  var Backdata = List[x - 1][1];
  var Cover = List[x - 1][2];


  if (Cover.indexOf("https") == -1) {
    Cover = "https://www.manhuadb.com/" + Cover;
    List[x - 1][2] = Cover;
  }

  //echo(senderid, "List = " + List.length);
  //echo(senderid, "X' = " + x);
  //echo(senderid, x == List.length); 

  if (x == List.length && List.length >= 6) {
    //no next page
    //37
    //echo(senderid, "no next");
    var prevX = x - (x % 5) - 4;
    keyBoard = {
      "inline_keyboard": [
        [{
          "text": "Read this⬆",
          'callback_data': Backdata
        }],
        [{
          "text": "Prev",
          'callback_data': sTitle + prefix + prevX.toString()
        }],
      ]
    }

  }
  if (x <= 5 && List.length > 5) {
    //no prev page
    keyBoard = {
      "inline_keyboard": [
        [{
          "text": "Read this⬆",
          'callback_data': Backdata
        }],
        [{
          "text": "Next",
          'callback_data': sTitle + prefix + (x + 1).toString()
        }],
      ]
    }

  }
  if (x > 5 && x != List.length) {
    keyBoard = {
      "inline_keyboard": [
        [{
          "text": "Read this⬆",
          'callback_data': Backdata
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
  if (x <= 5 && x == List.length) {

    keyBoard = {
      "inline_keyboard": [
        [{
          "text": "Read this⬆",
          'callback_data': Backdata
        }]
      ]
    };
  }

  sendPhotoKB(senderid, Cover, Title, keyBoard);
};

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
  var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + botToken + '/', data);
  return response;

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

  var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + botToken + '/', data);
  return response
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
  //echo(chatId, "CP2");
  UrlFetchApp.fetch('https://api.telegram.org/bot' + botToken + '/', data);
}
/*
function sendAlbumKB(chatId, photourls, caption, keyBoard) {
var data = {
method: "post",
payload: {
method: "sendMediaGroup",
chat_id: String(chatId),
media: photourls,
//caption: caption,
//parse_mode: "MarkdownV2",
//reply_markup: JSON.stringify(keyBoard)
}
};
//echo(chatId, "CP2");
UrlFetchApp.fetch('https://api.telegram.org/bot' + botToken + '/', data);
}*/

function getBy(element, name, att, type) {
  //att = "class" / "id" ...
  element = element.getChildren(type);
  var child;
  var childreturn = null;
  for (var x = 0; x < element.length; x++) {

    child = element[x];

    if (child.getAttribute(att).getValue() == name) {
      //Logger.log(child + child.getText());
      childreturn = child;
    }
  }

  return childreturn
}

function cList(doc) {

  var root = doc.getRootElement();
  //Logger.log(root);
  //var x = root.getChild("div").getAttribute("class").getValue();
  //x = x[0];
  //Logger.log(x);
  var y = root.getChild("div");
  //Logger.log(y);
  var List = [];
  List = getBy(y, "row m-0", "class", "div");
  List = List.getChild("div");
  List = getBy(List, "comic-main-section bg-white p-3", "class", "div");

  if (getBy(List, "row m-0", "class", "div") == null) {
    var comicList = [];
  }

  else {

    List = getBy(List, "row m-0", "class", "div");
    //Logger.log(List.getChildren());
    var Listnum = List.getChildren().length;
    //Logger.log(Listnum);
    List = List.getChildren();
    var comicList = [];

    for (var x = 0; x < Listnum; x++) {

      var comicT = List[x];
      comicT = comicT.getChild("div").getChild("a");
      var cTitle = comicT.getAttribute("title").getValue();
      var cCode = comicT.getAttribute("href").getValue();
      var cCover = comicT.getChild("img").getAttribute("src").getValue();
      //Logger.log(cTitle + cCode + cCover);
      var info = [cTitle, cCode, cCover];

      comicList.push(info);
    }
  }
  //Logger.log(comicList[3]);
  return comicList
}


//------Command function here------
function echo(id, text) {
  var response = UrlFetchApp.fetch("https://api.telegram.org/bot" + botToken
                                    + "/sendMessage?chat_id=" + id + "&text=" + text);
  Logger.log(id);
}

function weather(senderid, text, cmd, cmdstat, cmdlen) {
  var textlen = text.length;
  Logger.log(textlen);
  var weatherType = cmd.substring(cmdstat + 8, cmdstat + cmdlen);
  Logger.log(weatherType);
  var city = text.substring(cmdstat + cmdlen, textlen);
  city = city.trim();
  Logger.log("City trim: " + city);
  city = city.split(" ").join("");
  Logger.log("City replace: " + city);
  if (city.length == 0) {
    echo(senderid, "Please specify the city name like this '/weathernow beijing'.");
  }
  else {
    var response = UrlFetchApp.fetch("https://free-api.heweather.net/s6/weather/" + weatherType
                                     + "?location=" + city + "&key=" + weatherToken);
    //Logger.log(response);
    var weathertext = JSON.parse(response);
    var weathermini = weathertext.HeWeather6[0];
    Logger.log(weathermini);

    if (weatherType == "now") {

      var weatherinfo = weathermini.now;
      var allStr = "";

      //我当时就念了两句诗 θ..θ
      var sheet = SpreadsheetApp.openById("1w8Dm6e-VhHM2ZIL7Pr4gaRMagsaooOnGVekVUA-RpL0");
      var data = sheet.getDataRange().getValues();
      var cond = weatherinfo.cond_code;
      var poemNum = 0;//诗词行号（横）
      var poemMax = 0;//诗词个数
      var poemPos = 0;//选定诗词列号（竖）
      var poemTXT = "";
      var poemF = "";
      var poemR = "";
      var cmPos = 0;
      var poemFinal = "";
      var condT = "";

      for (var i = 0; i < data.length; i++) {
        //Logger.log('Code: ' + data[i][0]);
        //Logger.log('Translation: ' + data[i][1]);
        if (data[i][0] == cond) {
          Logger.log("Found");
          condT = data[i][1];//中文天气情况
          Logger.log(condT);
          poemNum = i;
          Logger.log("poemNum" + poemNum);
          break;
        }
      }
      poemMax = data[poemNum][3];
      Logger.log("pM " + poemMax);
      poemPos = 3 + randNum(poemMax) + 1;
      Logger.log("pP " + poemPos);
      poemTXT = data[poemNum][poemPos];

      cmPos = poemTXT.indexOf("，");
      poemF = poemTXT.substring(0, cmPos + 1);
      poemF = "“" + poemF;
      poemR = poemTXT.substring(cmPos + 1);
      poemR = poemR + "”";
      poemFinal = poemF + "\n" + "     " + poemR;
      Logger.log(poemFinal);

      //温度Str
      var temp = weatherinfo.tmp;
      var tempText = AR2CN(temp) + "摄氏度，";

      //降水Str
      var pcpn = weatherinfo.pcpn;
      var prcp = "";
      if (!pcpn == 0) {
        prcp = "无降水，";
      }
      else {
        prcp = "区域降水" + AR2CN(hum) + "毫米，";
      }

      //风力Str
      var wind = "";
      var windSc = weatherinfo.wind_sc;
      var windDir = weatherinfo.wind_dir;
      var isCN = isCNdir(windDir);
      Logger.log("windSc: " + windSc);
      if (windSc == 0) {
        wind = "无风。";
      }
      else {
        var dashPos = windSc.indexOf("-");


        if (!isCN) {
          Logger.log("windDir: " + windDir);
          windDir = dirEN2CN(windDir) + "风";
          isCN = false;
        }

        if (!dashPos == -1) {
          var minX = windSc.substring(0, dashPos);
          var maxX = windSc.substring(dashPos + 1);
          Logger.log(minX + "=====" + maxX);
          windSc = minX;
        }
        wind = windDir + AR2CN(windSc) + "级。";
      }
      //Logger.log(windSc);

      //地点+天气Str
      var cityRe = weathermini.basic.location;
      Logger.log(cityRe);
      if (!isCN) {
        cityRe = translate(cityRe);
      }
      var locCond = cityRe + "，" + condT + "，";
      Logger.log("locCond: " + locCond);

      //总
      allStr = locCond + tempText + prcp + wind;
      Logger.log(allStr);

      var msg = poemFinal + "\n" + allStr;
      msg = encodeURIComponent(msg);
      echo(senderid, msg);
    }
  }
}
//Response example in Notebook--Weather response.

function Voc2CN(senderid, text, cmdstat, cmdlen) {
  var textlen = text.length;
  //Logger.log(textlen);
  var Voc = text.substring(cmdstat + cmdlen, textlen);
  var Res = "xx";
  Voc = Voc.trim();
  Voc = Voc.split(" ").join("");
  //Logger.log("Voc: " + Voc);
  var EN = translate(Voc);
  //echo(senderid, Res);
  //Logger.log(EN);
  if (EN == Voc) {
    Res = "啊哦，出错了，找不到释义。" + "是不是输入有误呢？";
    //Logger.log("Teanslation not success." + EN + " VOC " + Voc);
  }
  else {
    Res = "Translation of " + Voc + " is " + EN + ".  :)";
    //Logger.log("Teanslation success.");
  }
  //Logger.log("Res: " + Res);
  // Res = encodeURIComponent(Res);
  echo(senderid, Res);
}

function yiYan(senderid) {
  var response = UrlFetchApp.fetch("http://api.guaqb.cn/v1/onesaid/");
  Logger.log(response);
  echo(senderid, response);
}

function Comic(senderid, text, cmdstat, cmdlen) {
  //echo(senderid, text);
  //echo(senderid, cmdstat);
  //echo(senderid, cmdlen);
  var textlen = text.length;
  //Logger.log(textlen);
  var sTitle = text.substring(cmdstat + cmdlen, textlen);
  //echo(senderid, sTitle);
  comic(senderid, text, cmdstat, cmdlen);

}

//-----------------------------------------------------------------------Main function here-----------------------------------------------------------------------
function doGet(e) {
  return ContentService.createTextOutput("Fuck Google? " + JSON.stringify(e));
}

//main
function doPost(e) {
  var rawData = JSON.parse(e.postData.contents);//Response example in Notebook--Webhook response.
  //var rawData =   rawData.postData.contents;

  var isCmd = false;
  //echo(senderid, text);
  /*
  GmailApp.sendEmail("Xperia.782980292@gmail.com", "TG", "hi");
  var body = DocumentApp.openById("1xrgoIPnxTvtOyoqvN-VIrjL6KzfdAD-fvj9HcG9nFA0").getBody();
  var bodytext = body.editAsText();
  */

  if (rawData.message) {

    if (rawData.message.entities == null) {
      //GmailApp.sendEmail("Xperia.782980292@gmail.com", "TG", "hi");
      if (!cmdActive()) {
        echo(senderid, "可以通过命令唤醒我哦");
      }
      isCmd = false;
    }
    else {

      var senderid = rawData.message.from.id;
      var senderNameF = rawData.message.from.first_name;
      var senderNameL = rawData.message.from.last_name;
      var text = rawData.message.text;//what he or she actually said
      var entity = rawData.message.entities[0];
      isCmd = false;

      if (JSON.stringify(entity.type) == '"bot_command"') {
        isCmd = true;

        if (rawData.message.entities.length > 1) {
          echo(senderid, "You send several commands, I will only accept the first one.");
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
            echo(senderid, "Are you 憨批? Echo already started.");
          }
          else{
            setConfig(1,true);
            echo(senderid, "Echo started.");
          }
        }
        else if(cmd == "/echostop"){
          if (!getConfig(1)){
            echo(senderid, "You are 铁龙鸣. Echo already stopped.");
          }
          else{
            setConfig(1,false);
            echo(senderid, "Echo stopped.");
          }
        }*/

        if (cmd == "/weathernow") {
          weather(senderid, text, cmd, cmdstat, cmdlen);
        }
        else if (cmd == "/translate") {
          Voc2CN(senderid, text, cmdstat, cmdlen);
        }
        else if (cmd == "/yiyan") {
          yiYan(senderid);
        }
        else if (cmd == "/comic") {
          Comic(senderid, text, cmdstat, cmdlen);
        }

        else {
          echo(senderid, "Not a valid command.");
        }
        //echo(senderid, "cmd");
      }
    }
  }
  //
  if (rawData.callback_query) {
    //echo(selfid, "CP1");
    senderid = rawData.callback_query.from.id;
    //echo(senderid, "test4");
    //echo(senderid, rawData.callback_query.data);
    //echo(selfid, "CP2");
    //echo(selfid, rawData.callback_query.data.indexOf("$"));
    if (rawData.callback_query.data.indexOf("#") != -1) {

      comicpage(senderid, rawData.callback_query.data)
    }

    if (rawData.callback_query.data.indexOf("/manhua") != -1 && rawData.callback_query.data.indexOf("_") == -1
         && rawData.callback_query.data.indexOf("$") == -1) {
      //点击了一个漫画，发初始漫画集
      comicVol(senderid, rawData.callback_query.data);
    }


    if (rawData.callback_query.data.indexOf("$") != -1) {
      //更新漫画集显示
      updateVol(senderid, rawData.callback_query.data);
      //updateVol(senderid, callback_data)

    }

    if (rawData.callback_query.data.indexOf("/manhua") != -1 && rawData.callback_query.data.indexOf("_") != -1 
        && rawData.callback_query.data.indexOf("isend") != -1) {
      //点击了漫画的一集，准备发漫画

      //echo(senderid, "entered if");
      //echo(senderid, rawData.callback_query.data);
      sendContent(senderid, rawData.callback_query.data);
    }

  };
  //GmailApp.sendEmail("Xperia.782980292@gmail.com", "TG_command", JSON.stringify(entity.type) + "\n" + JSON.stringify(e));
  //Link the functions here;
  /*
  if (getConfig(1) && !isCmd){
    echo(senderid, text);
  }//echo
  */


}