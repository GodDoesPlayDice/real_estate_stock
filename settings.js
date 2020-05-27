// настройка пользователей
var users = {
    "alikjackass@gmail.com": {
        department: "B",
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
        departmentName: "Виноград 2",
    },
    B: {
        departmentName: "Баланс",
    },
};


Object.defineProperty(dataSources.V2, "archiveSheet", {
    get: function() {
        return SpreadsheetApp.openById("15iA9-3RpTFuFWLUHsjs4eUBjCKjU0dbdUPNxgwrw17M").getSheetByName("archive");
    }
});
Object.defineProperty(dataSources.V2, "stockSheet", {
    get: function() {
        return SpreadsheetApp.openById("15iA9-3RpTFuFWLUHsjs4eUBjCKjU0dbdUPNxgwrw17M").getSheetByName("all_apartments").getDataRange().getValues()
    }
});
Object.defineProperty(dataSources.V2, "docsSheet", {
    get: function() {
        return SpreadsheetApp.openById("15iA9-3RpTFuFWLUHsjs4eUBjCKjU0dbdUPNxgwrw17M").getSheetByName("docs_current").getDataRange().getValues()
    }
});
Object.defineProperty(dataSources.V2, "utilitySheet", {
    get: function() {
        return SpreadsheetApp.openById("15iA9-3RpTFuFWLUHsjs4eUBjCKjU0dbdUPNxgwrw17M").getSheetByName("utility_data").getDataRange().getValues()
    }
});
Object.defineProperty(dataSources.V2, "targetSheet", {
    get: function() {
        return SpreadsheetApp.openById("15iA9-16k9kb_Kv6VoHXVe-9ZQHTX_8UkHP3_8W3A6Qz8Ec7uY").getSheetByName("storage_raw")
    }
});


Object.defineProperty(dataSources.B, "archiveSheet", {
    get: function() {
        return SpreadsheetApp.openById("16k9kb_Kv6VoHXVe-9ZQHTX_8UkHP3_8W3A6Qz8Ec7uY").getSheetByName("archive");
    }
});
Object.defineProperty(dataSources.B, "stockSheet", {
    get: function() {
        return SpreadsheetApp.openById("16k9kb_Kv6VoHXVe-9ZQHTX_8UkHP3_8W3A6Qz8Ec7uY").getSheetByName("all_apartments").getDataRange().getValues()
    }
});
Object.defineProperty(dataSources.B, "docsSheet", {
    get: function() {
        return SpreadsheetApp.openById("16k9kb_Kv6VoHXVe-9ZQHTX_8UkHP3_8W3A6Qz8Ec7uY").getSheetByName("docs_current").getDataRange().getValues()
    }
});
Object.defineProperty(dataSources.B, "utilitySheet", {
    get: function() {
        return SpreadsheetApp.openById("16k9kb_Kv6VoHXVe-9ZQHTX_8UkHP3_8W3A6Qz8Ec7uY").getSheetByName("utility_data").getDataRange().getValues()
    }
});
Object.defineProperty(dataSources.B, "targetSheet", {
    get: function() {
        return SpreadsheetApp.openById("16k9kb_Kv6VoHXVe-9ZQHTX_8UkHP3_8W3A6Qz8Ec7uY").getSheetByName("storage_raw")
    }
});



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


