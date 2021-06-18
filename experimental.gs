function debugExp() {
  //Logger.log(dirEN2CN("N"));
  //Logger.log(isCNdir("南"));
  //Logger.log(translate("   Los A ng el e s"));
  //Logger.log("HE is \"" + "\"");
  //Voc2CN(651615754, "/trans2CN cigaret", 0 ,9)
  //yiYan();
  Logger.log(Testnum);

}

function AR2CN1(temp) {

  var chnNumChar = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  var chnUnitChar = ["", "十", "百", "千", "万"];
  var minus = "零shang";
  var strIns = '', chnStr = '';
  var unitPos = 0;
  var isZero = false;
  var section = Math.abs(temp);

  while (section >= 0 && Math.abs(temp) > 0) {
    var v = section % 10;
    //Logger.log(v);
    if (v == 0) {
      if (isZero || temp % 10 == 0) {
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

function turing() {
  var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
  httpRequest.open('POST', 'http://openapi.tuling123.com/openapi/api/v2', true); //第二步：打开连接/***发送json格式文件必须设置请求头 ；如下 - */
  httpRequest.setRequestHeader("Content-type", "application/json");//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）var obj = { name: 'zhansgan', age: 18 };
  httpRequest.send(JSON.stringify(obj));//发送请求 将json写入send中
  /**
   * 获取数据后的处理程序
   */
  httpRequest.onreadystatechange = function () {//请求后的回调接口，可将请求成功后要执行的程序写在其中
    if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
      var json = httpRequest.responseText;//获取到服务端返回的数据
      console.log(json);
    }
  }
}

function yiYan() {
  var response = UrlFetchApp.fetch("http://api.guaqb.cn/v1/onesaid/");
  Logger.log(response);
}

function Voc2CN(senderid, text, cmdstat, cmdlen) {
  var textlen = text.length;
  Logger.log(textlen);
  var Voc = text.substring(cmdstat + cmdlen, textlen);
  var Res = "";
  Voc = Voc.trim();
  Voc = Voc.split(" ").join("");
  Logger.log("Voc: " + Voc);
  var EN = translate(Voc);
  Logger.log(EN);
  if (EN == Voc) {
    Res = "啊哦，出错了，找不到释义。\n是不是输入有误呢？";
    Logger.log("Teanslation not success." + EN + " VOC " + Voc);
  }
  else {
    Res = "Teanslation of " + Voc + " is " + EN + ".  :)";
    Logger.log("Teanslation success.");
  }
  Logger.log("Res: " + Res);
  //echo(senderid, Res);

}

function translate(e) {
  e = e.trim();
  e = e.split(" ").join("");
  Logger.log(e);
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

function randLetter() {
  var str1 = "DEFGHIJKLMNOPQRSTUVWXYZ";
  var array = str1.split("");
  var n = Math.round(Math.random() * (array.length - 1));
  var rand = array[n];
  Logger.log(rand);
}

function randNumGen() {
  Logger.log(randNum(3));
}

function randNum(e)//generate numbers from 0 to e - 1;
{
  var n = Math.floor(Math.random() * e);
  //Logger.log(n);
  //Logger.log(Math.random());
  return n;
}


function poem() {

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

  for (var i = 0; i < data.length; i++) {
    //Logger.log('Code: ' + data[i][0]);
    //Logger.log('Translation: ' + data[i][1]);
    if (data[i][0] == cond) {
      Logger.log("Found");
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
}
