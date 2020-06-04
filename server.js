// обект и его функция определяющие по какому url запросу какую страницу загружать
var Route = {};
Route.path = function (route, callback) {
    Route[route] = callback;
};

function doGet(e) {
    // проверка, указан ли пользователь в системе
    if (!setSessionParameters()) return;
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
function setSessionParameters() {
    let userMail = Session.getActiveUser().getEmail();
    try {
        // установка департамента текущего пользователя
        let currentDepartment = users[userMail].department;
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
    setSessionParameters();
    let result = setDataForSession();
    result.sessionParameters = setSessionParameters();
    return JSON.stringify(result);
}

/* Легкая ф-ция которая проверяет департамент текущего пользователя
, выбирает из объекта настроек данные для данного департамента и возвращает их
в виде массива */
function setDataForSession() {
    let department = sessionParameters.department;
    let role = sessionParameters.role;
    // делаем свойства из опций пользователей ленивыми функциями
    initUserProperties(setSessionParameters().userName);
    try {
        let result = {};

        let dataPart = userSettings[department].roles[role].data;
        let dataPartArr = Object.keys(dataPart);
        dataPartArr.forEach((elem) => {
            result[elem] = getObjFromTable(dataPart[elem]);
        })

        let linksPart = userSettings[department].roles[role].links;
        let linksPartArr = Object.keys(linksPart);
        linksPartArr.forEach((elem) => {
            result[elem] = linksPart[elem];
        });

        result.features = userSettings[department].roles[role].features;
        result.departmentName = userSettings[department].departmentName;
        result.department = department;
        result.dictionary = dictionary;
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
function getObjFromTable(table) {
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
function storeData(json) {
    let data = JSON.parse(json);
    setSessionParameters();
    let userSettings = setDataForSession();

    let calculatedFields = new CalculatedFields (data, userSettings);
    let fieldsList = [
        'TotalArea', 'AreaWithoutBalconies', 'Floor', 'ActualCost',
        'LegalCost', 'ActualOneSquareMeterCost', 'StockOneSquareMeterCost',
        'StockFlatCost', 'FormalCostIncrease', 'LegalOneSquareMeterCost',
        'MagangerComissionPercent', 'HeadComissionPercent', 'ManagerComission',
        'HeadComission', 'AgencyComissionPercent', 'AgencyComission'
    ]
    if (userSettings.department === "O2") {
        fieldsList.forEach((elem) => {
            data[elem] = calculatedFields[elem]
        });
    }
    // лист с учетом отдела продаж
    let targetSheet = userSettings.storageSheet;
    //let targetSheet = dataSources[department][role].targetSheet;
    // массив с заголовками столбцов
    let headers = targetSheet.getRange(1, 2, 1, targetSheet.getLastColumn()).getValues()[0];
    let columns = {};

    // заголовки столбцов с их номерами в таблице начиная с ID
    headers.forEach((el, i) => {
        columns[el] = i + 2;
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
            /* value = value.slice(0, 10); */
            if (value != '') value = new Date(value) /* .toLocaleString().slice(0, 10); */
        }
        targetSheet.getRange(lastRow + 1, column).setValue(value);
    }
    /* установка Timestamp */
    targetSheet.getRange(lastRow + 1, 1).setNumberFormat('yyyy-dd-mm hh:mm:ss')
    targetSheet.getRange(lastRow + 1, 1).setValue(new Date());
};

/* Функция осуществляет поиск в листе, собирающем данные от данного приложения
вырезает каждую строку (сделку), соответствующую искомому ID и вставляет ее в архивный лист
("ID") -> (void)
*/
function archive(ID, sheetName) {
    setSessionParameters();
    let userSettings = setDataForSession();
    let storageSheet = userSettings[sheetName];
    let storageData = storageSheet.getDataRange().getValues();
    let archiveSheet = userSettings.archiveSheet;
    let arrayOfRows = [];

    // находим все строки, с искомым ID, помещаем их номера в отдельный массив
    storageData.forEach((elem, index) => {
        if (elem[3] + "/" + elem[4] === ID) {
            arrayOfRows.push(index + 1);
        }
    })
    console.log("найденные строки для удаления: ", arrayOfRows)
    // проходим по массиву строк копируем данные в архив
    arrayOfRows.forEach((elem) => {
        let sourceRange = storageSheet.getRange(elem, 1, 1, storageSheet.getMaxColumns());
        let archiveRange = archiveSheet.getRange(archiveSheet.getLastRow() + 1, 1, 1, storageSheet.getMaxColumns());
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


class CalculatedFields {
    constructor(rawDataObj, tableData) {
        this.rawFields = rawDataObj;
        this.tableData = tableData;
        this.stockSheet = this.tableData.stockSheet;
        this.docsSheet = this.tableData.docsSheet;
        this.priceSheet = this.tableData.priceSheet;
        this.salarySheet = this.tableData.salarySheet;
    }
    definePricingDate(ReservationDate, RegistrationStartDate, DateOfRegistration, Timestamp) {
        if (ReservationDate != '') return new Date(ReservationDate);
        if (RegistrationStartDate != '') return new Date(RegistrationStartDate);
        if (DateOfRegistration != '') return new Date(DateOfRegistration);
        if (Timestamp != '') return new Date(Timestamp);
    }
    filterSheetByDate(startDateCol, endDateCol, dateInDoc, sheet) {
        let result = {
            headers: sheet.headers
        };

        let headers = sheet.headers;
        let startDateColPos = headers.findIndex((col) => {
            return col === startDateCol
        });
        let endDateColPos = headers.findIndex((col) => {
            return col === endDateCol
        });

        Object.keys(sheet).forEach((key) => {
            let row = sheet[key];
            
            let startDate = new Date(row[startDateColPos]);
            let endDate = new Date(row[endDateColPos]);

            if (dateInDoc >= startDate && dateInDoc <= endDate) {
                result[key] = row;
            }
        });

        return result;
    }
    vlookup(searchInCol, searchForVal, returnFromCol, sheet) {
        let result;
        let headers = sheet.headers;

        let searchInColPos = headers.findIndex((col) => {
            return col === searchInCol
        });
        let returnFromColPos = headers.findIndex((col) => {
            return col === returnFromCol
        });

        let isFound = Object.keys(sheet).some((key) => {
            result = sheet[key][returnFromColPos];
            return sheet[key][searchInColPos] === searchForVal;
        });
        return isFound ? result : isFound;
    }

    get TotalArea() {
        if (this.CurrentTotalArea) return this.CurrentTotalArea;

        this.CurrentTotalArea = this.vlookup("ID", this.rawFields.ID, "total_area", this.stockSheet);
        return this.CurrentTotalArea;
    }
    get AreaWithoutBalconies() {
        return this.vlookup("ID", this.rawFields.ID, "area_without_balconies", this.stockSheet)
    }
    get Floor() {
        return this.vlookup("ID", this.rawFields.ID, "floor", this.stockSheet)
    }
    get ActualCost() {
        if (this.CurrentActualCost) return this.CurrentActualCost;

        let discountOnFlat = this.rawFields.DiscountOnFlat ? parseFloat(this.rawFields.DiscountOnFlat) : 0;
        let discountPerOneSquareMeter = this.rawFields.DiscountPerOneSquareMeter ? parseFloat(this.rawFields.DiscountPerOneSquareMeter) : 0;
        let discount = discountOnFlat > 0 ? discountOnFlat : (discountPerOneSquareMeter*this.TotalArea);

        let actualCost = parseFloat(this.StockFlatCost) - discount;
        
        this.CurrentActualCost = (actualCost === this.LegalCost - this.FormalCostIncrease ? actualCost : "где-то тут ошибка...");
        return this.CurrentActualCost;
    }
    get LegalCost() {
        if (this.CurrentLegalCost) return this.CurrentLegalCost; 

        let fieldsToSum = ['FirstSubsidyPayment', 'SecondSubsidyPayment', 'BankLoanPayment',
            'PaymentFromDeveloper', 'InitialPaymentFromClient', "InstallmentPayment1", 
            "InstallmentPayment2", "InstallmentPayment3", "InstallmentPayment4", 
            "InstallmentPayment5", "InstallmentPayment6", "InstallmentPayment7", 
            "InstallmentPayment8", "InstallmentPayment9", "InstallmentPayment10", 
            "InstallmentPayment11", "InstallmentPayment12", "InstallmentPayment13", 
            "InstallmentPayment14", "InstallmentPayment15", "InstallmentPayment16", 
            "InstallmentPayment17", "InstallmentPayment18", "InstallmentPayment19", 
            "InstallmentPayment20", "InstallmentPayment21", "InstallmentPayment22", 
            "InstallmentPayment23", "InstallmentPayment24", "InstallmentPayment25", 
            "InstallmentPayment26", "InstallmentPayment27"
        ]

        const reducer = (accumulator, fieldName) => accumulator + (parseFloat(this.rawFields[fieldName]) >= 0 ? parseFloat(this.rawFields[fieldName]) : 0);
        
        this.CurrentLegalCost = fieldsToSum.reduce(reducer, 0);
        return this.CurrentLegalCost;
    }
    get ActualOneSquareMeterCost() {
        if (this.CurrentActualOneSquareMeterCost) return this.CurrentActualOneSquareMeterCost; 

        this.CurrentActualOneSquareMeterCost = parseFloat(this.ActualCost)/parseFloat(this.TotalArea);
        return this.CurrentActualOneSquareMeterCost;
    }
    get StockOneSquareMeterCost() {
        if (this.CurrentStockOneSquareMeterCost) return this.CurrentStockOneSquareMeterCost;

        let pricingDate = this.definePricingDate(this.rawFields.ReservationDate,
            this.rawFields.RegistrationStartDate,
            this.rawFields.DateOfRegistration,
            this.rawFields.Timestamp);
        let filteredSheet = this.filterSheetByDate("StartDate", "EndDate", pricingDate, this.priceSheet);
        let priceID = `${this.rawFields.SelectLiter}/${this.TotalArea}`;

        this.CurrentStockOneSquareMeterCost = this.vlookup("ID", priceID, "StockOneSquareMeterCost",  filteredSheet);  
        return this.CurrentStockOneSquareMeterCost;
    }
    get StockFlatCost() {
        if (this.CurrentStockFlatCost) return this.CurrentStockFlatCost; 

        this.CurrentStockFlatCost = (parseFloat(this.TotalArea)*parseFloat(this.StockOneSquareMeterCost)).toFixed(2);
        return this.CurrentStockFlatCost;
    }
    get FormalCostIncrease() {
        if (this.CurrentFormalCostIncrease) return this.CurrentFormalCostIncrease; 
        
        let increase = parseFloat(this.rawFields.PaymentFromDeveloper)+parseFloat(this.rawFields.FoolTaxPaymentInBankLoan);
        this.CurrentFormalCostIncrease = increase > 0 ? increase : 0;
        return (this.CurrentFormalCostIncrease).toFixed(2);
    }
    get LegalOneSquareMeterCost() {
        return  (parseFloat(this.LegalCost)/parseFloat(this.TotalArea)).toFixed(2);
    }
    get MagangerComissionPercent() {
        let dateString = this.rawFields.ReservationDate;
        if (dateString === '') return 0;
        if (this.rawFields.SelectManager === "АВБ") return 0;
        if (parseFloat(this.rawFields.IndPercentManagerComission) > 0) return parseFloat(this.rawFields.IndPercentManagerComission);

        let salaryDate = new Date(dateString);
        let filteredByDate = this.filterSheetByDate("StartDate", "EndDate", salaryDate, this.salarySheet);
        
        let managerName = this.rawFields.SelectManager;
        let dealType = this.rawFields.DealType;

        return parseFloat(this.vlookup("employee", managerName, dealType, filteredByDate))
    }
    get HeadComissionPercent() {
        let dateString = this.rawFields.ReservationDate;
        if (dateString === '') return 0;
        if (this.rawFields.SelectManager === "АВБ") return 0;
        if (parseFloat(this.rawFields.IndPercentHeadComission) > 0) return parseFloat(this.rawFields.IndPercentHeadComission);

        let salaryDate = new Date(dateString);
        let filteredByDate = this.filterSheetByDate("StartDate", "EndDate", salaryDate, this.salarySheet);
        
        let dealType = this.rawFields.DealType;

        return parseFloat(this.vlookup("position", "РОП", dealType, filteredByDate))
    }
    get ManagerComission() {
        return (this.MagangerComissionPercent*this.ActualCost).toFixed(2);
    }
    get HeadComission() {
        return (this.HeadComissionPercent*this.ActualCost).toFixed(2);
    }
    get AgencyComissionPercent() {
        if (this.rawFields.SelectManager === "АВБ") return 0;
        if (this.rawFields.DealType != "АН") return 0;
        if (parseFloat(this.rawFields.IndPercentAgencyComission) > 0) return parseFloat(this.rawFields.IndPercentAgencyComission);
        return 0.05;
    }
    get AgencyComission() {
        return (this.AgencyComissionPercent*this.ActualCost).toFixed(2);
    }
}