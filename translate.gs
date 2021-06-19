function translateTest() {
  
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
