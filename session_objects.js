var sessionParameters = {};
//var docsSheet;
//var stockSheet;

// функция для фронтенда (с ее помощью он получает данные с сервера)
function getServerData () {
    let result = {};
    result.sessionParameters = setSessionParameters ();
    let singleArr = setDataForSession();
    result.docsSheet = getObjFromTable(singleArr[0]);
    result.stockSheet = getObjFromTable(singleArr[1]);
    result.utilitySheet = getObjFromTable(singleArr[2]);
    return JSON.stringify(result);
}

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