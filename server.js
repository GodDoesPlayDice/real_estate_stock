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

var sessionParameters = {
  department: '',
  role: '',
  userName: ''
};

/* проверка авторизации в сервисах Google (имя аккаунта) 
и сверка его с пользователями, определенными в settings*/
function setSessionParameters () {
  let userMail = Session.getActiveUser().getEmail();
  try {
    // установка департамента текущего пользователя
    let currentDepartment =  users[userMail].department;
    sessionParameters.department = currentDepartment;
    sessionParameters.userName = userMail;
    // установка роли текущего пользователя
    let currentRole = users[userMail].role;
    sessionParameters.role = currentRole;
    return sessionParameters;
  } catch (e) {
      console.log(`Попытка входа неавторизованным пользователем - ${userMail}`);
      console.log(e);
    return false;
  } 
};

/* При загрузке шаблона страницы первым делом запускается эта ф-ция, и фронтенд ожидает
ее значение. Она возвращает данные таблиц, вспомогательные данные для полей, параметры 
текущего пользователя, название департамента. */
function getServerData() {
  let result = {};
  result.sessionParameters = setSessionParameters ();
  let sessionData = setDataForSession();
  result.docsSheet = getObjFromTable(sessionData.docsSheet);
  result.stockSheet = getObjFromTable(sessionData.stockSheet);
  result.utilitySheet = getObjFromTable(sessionData.utilitySheet);
  result.departmentName = sessionData.departmentName;

  result.departmentName = sessionData.departmentName;
  result.dictionary = dictionary;
  result.features = sessionData.features;
  return JSON.stringify(result);
}

/* Легкая ф-ция которая проверяет департамент текущего пользователя
, выбирает из объекта настроек данные для данного департамента и возвращает их
в виде массива */
function setDataForSession () {
  let department = sessionParameters.department;
  let role = sessionParameters.role;
  // делаем свойства из опций пользователей ленивыми функциями
  initUserProperties(setSessionParameters().userName);
  try {
    let result = {};

    let dataPart = userSettings[department].roles[role].data;
    let dataPartArr = Object.keys(dataPart);
    dataPartArr.forEach((elem) => {
      result[elem] = dataPart[elem];
    })

    let linksPart = userSettings[department].roles[role].links;
    let linksPartArr = Object.keys(linksPart);
    linksPartArr.forEach((elem) => {
      result[elem] = linksPart[elem];
    });
    result.features = userSettings[department].roles[role].features;
    result.departmentName = userSettings[department].departmentName;
    return result;
    /* [docsSheet, stockSheet, utilitySheet, departmentName, dictionary]; */
  } catch (e) {
    console.log(`Произошла ошибка при сборе табличных данных для сессии пользователя.`);
    console.log(e);
    return false;
  }
};

/* меняет формат данных на следующий:
 - первый ключ объекта - массив с хэдерами столбцов 
 - последующие ключи - строки: массив со строкой */
function getObjFromTable (table) {
  let result = {};
  table.forEach((elem, index) => {
      if (index == 0) {
          result.headers = elem;
      } else {
          result[index] = elem;
      }
  });
  return result;
}


/* Сохранение данных в таблицы
находит последнюю строку в targetSheet вставляет туда значения
пришедших ключей объекта, предварительно рассчитав номера столбцов в targetSheet. 
 попутно удаляются лишние ключи и форматируются ключи с датами */
function storeData (json) {
  let data = JSON.parse(json);
  setSessionParameters ();
  let userSettings = setDataForSession ();
  let department = sessionParameters.department;
  let role = sessionParameters.role;
  // лист с учетом отдела продаж
  let targetSheet = userSettings.storageSheet;
  //let targetSheet = dataSources[department][role].targetSheet;
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
    let value = data[key];
    if (key.includes("Date")) {
      /* решил не разбираться с парсингом UTC строки а просто оставить от
      каждой даты только 10 первых символов (что мне и нужно) */
      value = value.slice(0, 10);
    }
    targetSheet.getRange(lastRow+1, column).setValue(value);
  }
  /* установка Timestamp */
  targetSheet.getRange(lastRow+1, 1).setValue(new Date());
};

/* Функция осуществляет поиск в листе, собирающем данные от данного приложения
вырезает каждую строку (сделку), соответствующую искомому ID и вставляет ее в архивный лист
("ID") -> (void)
*/
function archive(ID) {
  setSessionParameters();
  let userSettings = setDataForSession ();
  let storageSheet = userSettings.storageSheet;
  let storageData = storageSheet.getDataRange().getValues();
  let archiveSheet = userSettings.archiveSheet;
  let arrayOfRows = [];

  // находим все строки, с искомым ID, помещаем их номера в отдельный массив
  storageData.forEach((elem, index) => {
    if (elem[3]+"/"+elem[4] === ID) {
      arrayOfRows.push(index+1);
    }
  })
  console.log("найденные строки для удаления: ", arrayOfRows)
  // проходим по массиву строк копируем данные в архив
  arrayOfRows.forEach((elem) => {
    let sourceRange = storageSheet.getRange(elem, 1, 1, storageSheet.getMaxColumns());
    let archiveRange = archiveSheet.getRange(archiveSheet.getLastRow()+1, 1, 1, storageSheet.getMaxColumns());
    console.log('копирование строки', elem)
    archiveRange.setValues(sourceRange.getValues());
    
  })
/* удаляем пустые строки 
reverse чтобы строки удалялись с самой большой*/
  arrayOfRows.reverse().forEach((elem) => {
    console.log('удаление строки', elem)
    storageSheet.deleteRow(elem)
  })
};