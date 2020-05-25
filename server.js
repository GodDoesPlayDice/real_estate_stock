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
    departmentName = dataSources[department].departmentName;
    return [docsSheet, stockSheet, utilitySheet, departmentName];
  } catch (e) {
    console.log(`Произошла ошибка при сборе табличных данных для сессии пользователя.`);
    console.log(e);
    return false;
  }
};

function storeData (json) {
  let data = JSON.parse(json);
  setSessionParameters ();
  let department = sessionParameters.department;
  // лист с учетом отдела продаж
  let targetSheet = dataSources[department].targetSheet;
  // массив с заголовками столбцов
  let headers = targetSheet.getRange(1, 2, 1, targetSheet.getLastColumn()).getValues()[0];
  let columns = {};

  // заголовки столбцов с их номерами в таблице начиная с ID
  headers.forEach((el,i) => {
    columns[el] = i+2;
  })
  let lastRow = targetSheet.getLastRow();
  // удаляем поля объекта, которых не предусмотрены в таблице
  delete data.Timestamp;
  delete data.ID;
  // проходимся по объекту с фронта и вставляем данные с форматированием и без
  for (let key in data) {
    let column = columns[key];
    let value;
    if (key === 'CurrentStatusDate' || key === 'NextStatusEstimatedDate') {
      if (data[key] !=  '') {
        value = new Date(data[key])
      } else {
        continue;
      }
    } else {
      value = data[key];
    }
    targetSheet.getRange(lastRow+1, column).setValue(value);
  }
  targetSheet.getRange(lastRow+1, 1).setValue(new Date());
}