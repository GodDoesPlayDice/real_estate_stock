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

var roles = ['admin', 'manager'];
var departments = ['V2', 'B', 'test'];
var ssID = {
    V2: '15iA9-3RpTFuFWLUHsjs4eUBjCKjU0dbdUPNxgwrw17M',
    B: '16k9kb_Kv6VoHXVe-9ZQHTX_8UkHP3_8W3A6Qz8Ec7uY',
    test: '1ex7gzC35SjS4f4y8U0LvYR8zKMPbPzso8B90ac_571I'
};

var accessLevel = {
    V2: {
        admin: {
            statuses: true,
            verification: true,
            edit: true,
        },
        manager: {
            statuses: true,
            verification: true,
            edit: true,
        }
    },
    B: {
        admin: {
            statuses: true,
            verification: true,
            edit: true,
        },
        manager: {
            statuses: true,
            verification: true,
            edit: true,
        }
    },
    test: {
        admin: {
            statuses: true,
            verification: true,
            edit: true,
        },
        manager: {
            statuses: true,
            verification: true,
            edit: true,
        }
    }
}

var dataSources = {
    V2: {
        admin: {departmentName: "Виноград 2",},
        manager: {departmentName: "Виноград 2",}
    },
    B: {
        admin: {departmentName: "Баланс",},
        manager: {departmentName: "Баланс",}
    },
    "test": {
        admin: {departmentName: "Тестовый полигон",},
        manager: {departmentName: "Тестовый полигон",}
    }
};


/* Общие параметры */
roles.forEach((role) => {
    departments.forEach((dep) => {
        // ленивые свойства для винограда
        Object.defineProperty(dataSources[dep][role], "archiveSheet", {
            get: function() {
                return SpreadsheetApp.openById(ssID[dep]).getSheetByName("archive");
            }
        });
        Object.defineProperty(dataSources[dep][role], "stockSheet", {
            get: function() {
                return SpreadsheetApp.openById(ssID[dep]).getSheetByName("all_apartments").getDataRange().getValues()
            }
        });
        Object.defineProperty(dataSources[dep][role], "docsSheet", {
            get: function() {
                return SpreadsheetApp.openById(ssID[dep]).getSheetByName("docs_current").getDataRange().getValues()
            }
        });
        Object.defineProperty(dataSources[dep][role], "utilitySheet", {
            get: function() {
                return SpreadsheetApp.openById(ssID[dep]).getSheetByName("utility_data").getDataRange().getValues()
            }
        });
        Object.defineProperty(dataSources[dep][role], "targetSheet", {
            get: function() {
                return SpreadsheetApp.openById(ssID[dep]).getSheetByName("storage_raw")
            }
        });
    })
});


var dictionary = {
    ID: 'Идентификатор документа:',
    Timestamp: 'Отметка времени:',
    DocStatus: 'Статус документа:',
    CurrentStatusDate: 'Дата текущего статуса:',
    ReservationDate:  'Дата бронирования:',
    RegistrationStartDate: 'Дата сдачи на регистрацию:',
    DateOfRegistration: 'Дата регистрации:',
    TerminationDate: 'Дата расторжения:',
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


