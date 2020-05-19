var sessionParameters = {};
//var docsSheet;
//var stockSheet;

// функция для фронтенда (с ее помощью он получает данные с сервера)
function getServerData () {
    let result = {};
    result.sessionParameters = setSessionParameters ();
    result.docsSheet = setDataForSession()[0];
    result.stockSheet = setDataForSession()[1];
    return JSON.stringify(result);
}