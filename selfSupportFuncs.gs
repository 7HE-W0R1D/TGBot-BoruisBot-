function selfSupportFuncTest() {
  //Logger.log(quickAR2CN(-10));
}

function quickAR2CN(inputNum) {
  var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  var chnTradChar = ["", "", "两", "三", "四", "五", "六", "七", "八", "九"];
  var chnUnitChar = ["", "十", "百", "千", "万"];
  var minus = "零下";
  var isMinus = false;
  var isPrevZero = false;
  var currPos = 0;
  var result = "";

  if (inputNum < 0) {
    isMinus = true;
    inputNum = Math.abs(inputNum);
  }

  if (inputNum == 0) {
    return chnNumChar[0];
  }

  while (inputNum > 0) {
    var currDigit = inputNum % 10;

    if (currDigit != 0) {
      isPrevZero = false;

      if ((currPos == 1 && currDigit == 1) || (((currPos == 3 || currPos == 4) && currDigit == 2))) {
        //Change 一十一 to 十一，二千 to 两千，二万 to 两万
        result = chnTradChar[currDigit] + chnUnitChar[currPos] + result;

      } else {
        result = chnNumChar[currDigit] + chnUnitChar[currPos] + result;
      }
    } else {

      if (currPos == 0) {
        isPrevZero = true;
      }
      if (!isPrevZero) {
        result = chnNumChar[currDigit] + result;
        isPrevZero = true;
      }
    }

    inputNum = Math.floor(inputNum / 10);
    currPos++;
  }

  if (isMinus) {
    result = minus + result;
  }

  return result;
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
  return n;
}

function isCNdir(e) {
  var cn = "东南西北";
  var cn = cn.split("");
  var e = e.split("");
  var isCN = false;
  for (var i in cn) {
    if (e[0] == cn[i]) {
      //Logger.log("is cn");
      isCN = true;
      break;
    }
  }
  return isCN;
}

function dirEN2CN(e) {
  var cn = "东南西北";
  var cn = cn.split("");
  var eng = "ESWN";
  var eng = eng.split("");
  var engDir = e.split("");
  var cnDir = "";

  for (var i in engDir) {
    var dirSingle = engDir[engDir.length - i - 1];

    for (var k in eng) {
      if (dirSingle == eng[k]) {
        Logger.log("Found" + k);
        cnDir = cnDir + cn[k];
        break;
      }
    }
  }
  return cnDir;
}

function urlParse(inputURL) {
  var page = UrlFetchApp.fetch(inputURL);
  var doc = Xml.parse(page, true);
  var bodyHtml = doc.html.body.toXmlString();
  return XmlService.parse(bodyHtml).getRootElement();
}
