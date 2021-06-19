function doGet() {
  //comicVol(selfid, "/manhua/24247");
  //quickAllPG("/manhua/24247/26451_275870.html");
  //endContent(selfid, "/manhua/9740/11879_164585.html?isend=0?current=23?max=24");
  updateVol(selfid, "/manhua/9740$11msg6010chat" + selfid.toString());
}

// function setDevWebhook() {
//   var response = UrlFetchApp.fetch("https://api.telegram.org/bot" + botToken + "/setWebhook?url=" + webDevURL);
//   Logger.log(response);
// }

// function allPG(comicCode) {
//   //var orgurl = "https://www.manhuadb.com";
//   var urlC = orgURL + comicCode; //using orgurl for compatibility with ver20.8.1
//   var page = "_p";
//   var pagenum = 1;
//   var allpgs = [];
//   var url = urlC.substr(0, urlC.length - 5) + page + pagenum + urlC.substr(-5, 5); //seperate the .html and instert info
//   //Logger.log(url);
//   //allpgs.push(url);

//   for (pagenum1 = 0; UrlFetchApp.fetch(url).getContentText().indexOf('<img class="img-fluid show-pic" src="') != -1; pagenum++) {
//     var url = urlC.substr(0, urlC.length - 5) + page + pagenum + urlC.substr(urlC.length - 5, urlC.length);
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