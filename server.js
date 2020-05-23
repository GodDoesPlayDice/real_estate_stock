// обект и его функция определяющие по какому url запросу какую страницу загружать
var Route = {};
Route.path = function (route, callback) {
  Route[route] = callback;
};

function doGet(e) {
  // проверка, указан ли пользователь в системе
  if(!setSessionParameters()) return;
  // проверка налиция в таблицах данных для сессии
  //if(!setDataForSession()) return;
  // непосредственно сам роутинг
  Route.path("main", loadMainPage);
  if (Route[e.parameters.v]) {
    return Route[e.parameters.v]();
  };
}
// рендерит наши шаблоны (https://www.youtube.com/watch?v=9LHPU0dYyrU)
function render(file, argsObject) {
  var template = HtmlService.createTemplateFromFile(file)
  if (argsObject) {
     var keys = Object.keys(argsObject);
     keys.forEach(function (key) {
        template[key] = argsObject[key];
     });
     return template.evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
};
// эта маленькая функция нужна для встраивания кода в  HTML страницу
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
};

function loadMainPage() {
  return render("index", {});
};

// установка параметров для пользователя
function setSessionParameters () {
  let userMail = Session.getActiveUser().getEmail();
  try {
    // установка департамента текущего пользователя
    let currentDepartment =  users[userMail].department;
    sessionParameters.department = currentDepartment;
    // установка роли текущего пользователя
    let currentRole = users[userMail].role;
    sessionParameters.role = currentRole;
    return sessionParameters;
  } catch (e) {
      console.log(`Попытка входа неавторизованным пользователем - ${userMail}`);
      console.log(e);
    return false;
  } 
}
// добавляем данные для сессии в глоб. переменную
function setDataForSession () {
  let department = sessionParameters.department;
  try {
    docsSheet = dataSources[department].docsSheet;
    stockSheet = dataSources[department].stockSheet;
    utilitySheet = dataSources[department].utilitySheet;
    return [docsSheet, stockSheet, utilitySheet];
  } catch (e) {
    console.log(`Произошла ошибка при сборе табличных данных для сессии пользователя.`);
    console.log(e);
    return false;
  }
};

function storeData (json) {
  let data = JSON.parse(json);
  console.log(data);
  let arr = [];
  
  for (let key in data) {
    arr.push(data[key])
  }
  let final = [arr];
  let target = SpreadsheetApp.openById("15iA9-3RpTFuFWLUHsjs4eUBjCKjU0dbdUPNxgwrw17M")
  .getSheetByName("target").getRange(1,1, final.length, final[0].length);
  target.setValues(final);
}