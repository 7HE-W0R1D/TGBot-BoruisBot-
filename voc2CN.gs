function voc2CNTest() {
  
}

function voc2CN(senderid, text, cmdstat, cmdlen) {
  var textlen = text.length;
  //Logger.log(textlen);
  var voc = text.substring(cmdstat + cmdlen, textlen);
  var res = "xx";
  voc = voc.trim();
  voc = voc.split(" ").join("");
  //Logger.log("voc: " + voc);
  var eng = translate(voc);
  //echo(senderid, res);
  //Logger.log(eng);
  if (eng == voc) {
    res = "啊哦，出错了，找不到释义。" + "是不是输入有误呢？";
    //Logger.log("Teanslation not success." + eng + " VOC " + voc);
  }
  else {
    res = "Translation of " + voc + " is " + eng + ".  :)";
    //Logger.log("Teanslation success.");
  }
  //Logger.log("res: " + res);
  // res = encodeURIComponent(res);
  echo(senderid, res);
}