// настройка пользователей
var users = {
    "alikjackass@gmail.com": {
        department: "V2",
        role: "admin"
    },
    "roxxxanafray@gmail.com": {
        department: "V2",
        role: "admin"
    }
};

var dataSources = {
    V2: {
        stockSheet: SpreadsheetApp.openById("15iA9-3RpTFuFWLUHsjs4eUBjCKjU0dbdUPNxgwrw17M")
            .getSheetByName("all_apartments").getDataRange().getValues(),
        docsSheet: SpreadsheetApp.openById("15iA9-3RpTFuFWLUHsjs4eUBjCKjU0dbdUPNxgwrw17M")
            .getSheetByName("docs_current").getDataRange().getValues(),
        utilitySheet: SpreadsheetApp.openById("15iA9-3RpTFuFWLUHsjs4eUBjCKjU0dbdUPNxgwrw17M")
            .getSheetByName("utility_data").getDataRange().getValues(),
        targetSheet: SpreadsheetApp.openById("15iA9-3RpTFuFWLUHsjs4eUBjCKjU0dbdUPNxgwrw17M")
        .getSheetByName("storage_raw"),
        departmentName: "Виноград 2"
    },
    B: {
        stockSheet: SpreadsheetApp.openById("16k9kb_Kv6VoHXVe-9ZQHTX_8UkHP3_8W3A6Qz8Ec7uY")
            .getSheetByName("all_apartments").getDataRange().getValues(),
        docsSheet: SpreadsheetApp.openById("16k9kb_Kv6VoHXVe-9ZQHTX_8UkHP3_8W3A6Qz8Ec7uY")
            .getSheetByName("docs_current").getDataRange().getValues(),
        utilitySheet: SpreadsheetApp.openById("16k9kb_Kv6VoHXVe-9ZQHTX_8UkHP3_8W3A6Qz8Ec7uY")
            .getSheetByName("utility_data").getDataRange().getValues(),
        targetSheet: SpreadsheetApp.openById("16k9kb_Kv6VoHXVe-9ZQHTX_8UkHP3_8W3A6Qz8Ec7uY")
        .getSheetByName("storage_raw"),
        departmentName: "Баланс"
    }
}


