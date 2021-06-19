function yiyanTest() {
  
}

function yiYan(senderid) {
  var response = UrlFetchApp.fetch("http://api.guaqb.cn/v1/onesaid/");
  echo(senderid, response);
}