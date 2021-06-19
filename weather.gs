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
      var sheet = SpreadsheetApp.openById(spreadSheetID);
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