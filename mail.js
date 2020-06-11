const SS = '1eOrUozWjzBSw3ioWUF3GuAMYNo8oLuXgDc5ZEw5Hn34';
const SHEETNAME = 'mail_template';

/* здесь только готовится табличный шаблон с документом для последующей отправки по почте */
function evaluateEmailTemplate(json) {
    let docObj = JSON.parse(json);
    let ss = SpreadsheetApp.openById(SS);
    let sheet = ss.getSheetByName(SHEETNAME);
    
    let docArr = []

    for (let key in docObj) {
        let value = docObj[key];
        let field = dictionary[key];
        if (value !== '') {
            if (key.includes('Date')) {
                value = new Date(docObj[key]);
            }
            docArr.push(
                [field, value]
            )
        }
    }
    sheet.deleteRows(1, (sheet.getDataRange().getLastRow() - 1));
    sheet.getRange("A:B").clearContent(); 

    sheet.insertRowsAfter(1, (docArr.length - 1));
    sheet.getRange(1,1,docArr.length, 2).setValues(docArr);

    let nameAndPay = {
        docName: `${docObj.ID}_${docObj.ClientName}`,
        payMethod: docObj.PayMethod,
    }
    return JSON.stringify(nameAndPay);
};


/* эта функция существует отдельно, потому что я не разгадал
как заставить рабоать метод fetch как любой другой код */
function sendEmail(nameAndPay) {
    let someData = JSON.parse(nameAndPay)
    let payMethod = someData.payMethod;
    let docName = someData.docName;
    let ss = SpreadsheetApp.openById(SS);
    
    let url_base = ss.getUrl().replace(/edit$/, '');
    // Лист Документ
    let url_ext = 'export?exportFormat=pdf&format=pdf' //export as pdf
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
        '&gid='
        +
        '406450523' 
        +
        '&top_margin=0.1&bottom_margin=0&left_margin=0.1&right_margin=0.1'; // Margins: set all to 1
    let options = {
        headers: {
            'Authorization': 'Bearer ' + ScriptApp.getOAuthToken()
        }
    }

    let promise = UrlFetchApp.fetch(url_base + url_ext, options);
    let blob = promise.getBlob().setName(`${docName}.pdf`);
    

    let recipients = `alikjackass@gmail.com, avb-oasis@mail.ru, nt.mir@yandex.ru, f_ulya7@mail.ru, legashovai@inbox.ru, 
    anna-avb-rs2017@yandex.ru, mn@oasis23.ru, t2484958@gmail.com`;
    if (payMethod) {
        if (payMethod.includes('Ипотека')) {
            recipients += ", li@oasis23.ru";
        }
    }
    let title = "Заявка ЖК Оазис 2: " + `${docName}`;
    let body = "Принимайте свежее мясо.";
    let mailOptions = {
        attachments: [blob]
    }
    MailApp.sendEmail(
        recipients,
        title,
        body,
        mailOptions)
}

function sendEmailNotificaiton (recipients, title, body, opitons) {
    MailApp.sendEmail(
        recipients,
        title,
        body,
        opitons)
}