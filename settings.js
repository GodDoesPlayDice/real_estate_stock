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
    }
}

var reactComponents = {
    SimpleText: [
        "ClientName",
        "ActualCost",
        "LegalCost",
        "LegalServiceCost",
        "RealEstateAgency",
        "EstateAgent"
    ],
    TextArea: [
        "Comment"
    ],
    Select: [
        "DocStatus",
        "SelectLiter",
        "SelectFlat",
        "SelectManager",
        "LegalServiceNoPayment",
        "PayMethod",
        
    ],
    DatePicker: [
        "CurrentStatusDate",
        "NextStatusEstimatedDate"
    ],
    Checkbox: [
        "RemainsOnSale"
    ],
    Radio: [
        "DealType"
    ]

}


