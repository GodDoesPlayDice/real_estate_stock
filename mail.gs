const SS = '16Jhl___hrispY_o2XV3QOhJyglDonvP9VD8dKzRshNY';
const SHEETNAME = ''

// отправка email с открытым в режиме просмотра документом
function emailContractAsPDF(contractId) {
    //
    var userParams = getGlobalsForUser();
    //
    var ss = SpreadsheetApp.openById(userParams.mainDataBaseId);
    var sheet = ss.getSheetByName(userParams.actualConditionsSheet.sheetName);
    sheet.getRange("C1").clearContent();
    sheet.getRange("C1").setValue(contractId);
    var email = userParams.normalEmailList;
    // переменная с формой оплаты для разделения рассылок писем
    var payform = sheet.getRange('B27').getValue();
    //
    var url_base = ss.getUrl().replace(/edit$/, '');
    // Лист Документ
    var url_ext = 'export?exportFormat=pdf&format=pdf' //export as pdf
        // Print either the entire Spreadsheet or the specified sheet if optSheetId is provided    
        // following parameters are optional...
        +
        '&size=A4' // paper size
        +
        '&portrait=true' // orientation, false for landscape
        +
        '&fitw=true' // fit to width, false for actual size
        +
        '&sheetnames=false&printtitle=false&pagenumbers=false' //hide optional headers and footers
        +
        '&gridlines=true' // hide gridlines
        +
        '&fzr=false' // do not repeat row headers (frozen rows) on each page
        +
        '&gid=' +
        userParams.actualConditionsSheet.sheetGid +
        '&top_margin=0.1&bottom_margin=0&left_margin=0.1&right_margin=0.1'; // Margins: set all to 1
    // лист ДДУ
    var url_ext1 = 'export?exportFormat=pdf&format=pdf' //export as pdf
        // Print either the entire Spreadsheet or the specified sheet if optSheetId is provided    
        // following parameters are optional...
        +
        '&size=A4' // paper size
        +
        '&portrait=true' // orientation, false for landscape
        +
        '&fitw=true' // fit to width, false for actual size
        +
        '&sheetnames=false&printtitle=false&pagenumbers=false' //hide optional headers and footers
        +
        '&gridlines=false' // hide gridlines
        +
        '&fzr=false' // do not repeat row headers (frozen rows) on each page
        +
        '&gid=' +
        userParams.contractConditionsSheet.sheetGid +
        '&top_margin=0.1&bottom_margin=0&left_margin=0.1&right_margin=0.1'; // Margins: set all to 1
    var options = {
        headers: {
            'Authorization': 'Bearer ' + ScriptApp.getOAuthToken()
        }
    }
    // Лист Документ
    var response = UrlFetchApp.fetch(url_base + url_ext, options);
    var blob = response.getBlob().setName(contractId + ' Факт' + '.pdf');
    // Лист ДДУ
    var response1 = UrlFetchApp.fetch(url_base + url_ext1, options);
    var blob1 = response1.getBlob().setName(contractId + ' ДДУ' + '.pdf');
    //
    var mailOptions = {
        attachments: [blob, blob1]
    }
    if (/ипотека/i.test(payform)) {
        email.push(userParams.kreditEmailList);
    }
    MailApp.sendEmail(
        email,
        "Заявка " + userParams.departmentName + ": " + contractId,
        "Принимайте свежее мясо.",
        mailOptions);
    return "success";
};