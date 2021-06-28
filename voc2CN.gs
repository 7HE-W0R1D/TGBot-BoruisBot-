function voc2CNTest() {

}

function voc2CN(senderid, text, cmdstat, cmdlen) {
  var textlen = text.length;
  var voc = text.substring(cmdstat + cmdlen, textlen);
  var res = "xx";
  voc = voc.trim();
  voc = voc.split(" ").join("");
  var eng = translate(voc);

  if (eng == voc) {
    res = "啊哦，出错了，找不到释义。" + "是不是输入有误呢？";
    //Logger.log("Teanslation not success." + eng + " VOC " + voc);
  }
  else {
    res = "Translation of " + voc + " is " + eng + ".  :)";
    //Logger.log("Teanslation success.");
  }
  echo(senderid, res);
}

function translate(e) {
  e = e.trim();
  e = e.split(" ").join("");
  var url = "http://fanyi.youdao.com/translate?&doctype=json&type=AUTO&i=" + e;
  var response = UrlFetchApp.fetch(url);
  var response = JSON.parse(response);
  var cn = response.translateResult[0][0].tgt;
  return cn;
}