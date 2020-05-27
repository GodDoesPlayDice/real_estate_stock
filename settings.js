// настройка пользователей
var users = {
    "alikjackass@gmail.com": {
        department: "V2",
        role: "admin"
    },
    "roxxxanafray@gmail.com": {
        department: "V2",
        role: "admin"
    },
    "viktorboldareff@gmail.com": {
        department: "B",
        role: "manager"
    },
    "atvinograd@gmail.com": {
        department: "V2",
        role: "manager"
    },
};

var dataSources = {
    V2: {
        archiveSheet:SpreadsheetApp.openById("15iA9-3RpTFuFWLUHsjs4eUBjCKjU0dbdUPNxgwrw17M")
        .getSheetByName("archive"),
        stockSheet: SpreadsheetApp.openById("15iA9-3RpTFuFWLUHsjs4eUBjCKjU0dbdUPNxgwrw17M")
            .getSheetByName("all_apartments").getDataRange().getValues(),
        docsSheet: SpreadsheetApp.openById("15iA9-3RpTFuFWLUHsjs4eUBjCKjU0dbdUPNxgwrw17M")
            .getSheetByName("docs_current").getDataRange().getValues(),
        utilitySheet: SpreadsheetApp.openById("15iA9-3RpTFuFWLUHsjs4eUBjCKjU0dbdUPNxgwrw17M")
            .getSheetByName("utility_data").getDataRange().getValues(),
        targetSheet: SpreadsheetApp.openById("15iA9-3RpTFuFWLUHsjs4eUBjCKjU0dbdUPNxgwrw17M")
        .getSheetByName("storage_raw"),
        departmentName: "Виноград 2",
    },
    B: {
        archiveSheet:SpreadsheetApp.openById("16k9kb_Kv6VoHXVe-9ZQHTX_8UkHP3_8W3A6Qz8Ec7uY")
        .getSheetByName("archive"),
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
};

var dictionary = {
    ID: 'Идентификатор документа:',
    Timestamp: 'Отметка времени:',
    DocStatus: 'Статус документа:',
    CurrentStatusDate: 'Дата текущего статуса:',
    NextStatusEstimatedDate: 'Предполагаемая дата следующего статуса:',
    SelectLiter: 'Литер:',
    SelectFlat: 'Номер квартиры:',
    ClientName: 'ФИО клиента:',
    SelectManager: 'Менеджер ОП:',
    RemainsOnSale: 'В продаже по переуступке:',
    DealType: 'Тип сделки:',
    PayMethod: 'Форма оплаты:',
    ActualCost: 'Стоимость для расчета комиссии:',
    LegalCost: 'Стоимость по ДДУ:',
    LegalServiceCost: 'Оплата юр. услуг:',
    LegalServiceNoPayment: 'Юр. услуги без оплаты:',
    RealEstateAgency: 'Агентство недвижимости:',
    EstateAgent: 'Сотрудник АН:',
    Comment: 'Комментарий:'
}


