function selfSupportFuncTest() {
  Logger.log(quickAR2CN(-10));
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

// function AR2CN(temp) {
//   var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
//   var chnUnitChar = ["", "十", "百", "千", "万"];
//   var minus = "零下";
//   var strIns = '', chnStr = '';
//   var unitPos = 0;
//   var isZero = false;
//   var section = Math.abs(temp);

//   while (section > 0) {
//     var v = section % 10;
//     if (v == 0) {
//       if (isZero) {
//         strIns = "";
//         //个位数为0 不用写“零”
//       }
//       else {
//         strIns = chnNumChar[v];
//       }
//       isZero = true;
//       chnStr = strIns + chnStr;
//     }
//     else {
//       isZero = false;
//       if (unitPos == 1 && v == 1) {
//         strIns = "";
//         //十位数为1 不用写“一”
//       }
//       else {
//         strIns = chnNumChar[v];
//       }
//       strIns += chnUnitChar[unitPos];
//       chnStr = strIns + chnStr;
//     }
//     unitPos++;
//     section = Math.floor(section / 10);
//   }
//   if (temp < 0) {
//     chnStr = minus + chnStr; //加上“零下” 后期酌情加判断条件
//   }
//   if (temp == 0) {
//     chnStr = chnNumChar[0];
//   }
//   return chnStr;
// }

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
    //Logger.log(i);
    var dirSingle = engDir[engDir.length - i - 1];
    //Logger.log(dirSingle);
    for (var k in eng) {
      if (dirSingle == eng[k]) {
        Logger.log("Found" + k);
        cnDir = cnDir + cn[k];
        break;
      }
    }
  }
  //Logger.log(cnDir);
  return cnDir;
}

function urlParse(inputURL) {
  var page = UrlFetchApp.fetch(inputURL);
  var doc = Xml.parse(page, true);
  var bodyHtml = doc.html.body.toXmlString();
  return XmlService.parse(bodyHtml).getRootElement();
}
