// обект и его функция определяющие по какому url запросу какую страницу загружать
var Route = {};
Route.path = function (route, callback) {
  Route[route] = callback;
};
var sessionParameters = {};

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

/* проверка авторизации в сервисах Google (имя аккаунта) 
и сверка его с пользователями, определенными в settings*/
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
};

/* При загрузке шаблона страницы первым делом запускается эта ф-ция, и фронтенд ожидает
ее значение. Она возвращает данные таблиц, вспомогательные данные для полей, параметры 
текущего пользователя, название департамента. */
function getServerData () {
  let result = {};
  result.sessionParameters = setSessionParameters ();
  let dataInArray = setDataForSession();
  result.docsSheet = getObjFromTable(dataInArray[0]);
  result.stockSheet = getObjFromTable(dataInArray[1]);
  result.utilitySheet = getObjFromTable(dataInArray[2]);
  result.departmentName = dataInArray[3];
  result.dictionary = dataInArray[4];
  return JSON.stringify(result);
}

/* Легкая ф-ция которая проверяет департамент текущего пользователя
, выбирает из объекта настроек данные для данного департамента и возвращает их
в виде массива */
function setDataForSession () {
  let department = sessionParameters.department;
  try {
    docsSheet = dataSources[department].docsSheet;
    stockSheet = dataSources[department].stockSheet;
    utilitySheet = dataSources[department].utilitySheet;
    departmentName = dataSources[department].departmentName;
    dictionary = dictionary;
    return [docsSheet, stockSheet, utilitySheet, departmentName, dictionary];
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
  console.log(data)
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
    if (key.includes("Date")) {
      if (data[key]) {
        /* при попытке отформатировать пустую дату, в ячейку залетает 1970 год, как и должно быть
        так что проверяем еще и тут */
        value = data[key]
      } else {
        continue;
      }
    } else {
      value = data[key];
    }
    targetSheet.getRange(lastRow+1, column).setValue(value);
  }
  targetSheet.getRange(lastRow+1, 1).setValue(new Date());
};

/* Функция осуществляет поиск в листе, собирающем данные от данного приложения
вырезает каждую строку (сделку), соответствующую искомому ID и вставляет ее в архивный лист
("ID") -> (void)
*/
function archive(ID) {
  setSessionParameters();
  console.log(ID)
  return;
  let department = sessionParameters.department;
  let storageSheet = dataSources[department].targetSheet;
  let archiveSheet = dataSources[department].archiveSheet;
  let currentRow = 1;
  let currentID =   `${storageSheet.getRange(currentRow, 5).getValue()}/${storageSheet.getRange(currentRow, 6).getValue()}`;
  do {
    if (currentID === ID) {
      let archiveRange = archiveSheet.getRange(archiveSheet.getLastRow(), 1, 1, archiveSheet.getMaxColumns());
      archiveRange.setValues(storageSheet.getRange(currentRow, 1, 1, storageSheet.getMaxColumns().getValues()));

      storageSheet.deleteRow(currentRow);
      currentRow++;
    }
  } while (currentRow <= storageSheet.getLastRow()+1);
}