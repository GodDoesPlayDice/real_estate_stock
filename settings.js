// настройка пользователей
var users = {
    "alikjackass@gmail.com": {
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
    }
}
// параметры полей 
var fieldProps = {
    V2: {
        SelectLiter: {
            reactComponent: "",
            label: "Выберите литер",
            dataForOptions: dataSources.V2.stockSheet
        },
        SelectFlat: {
            reactComponent: "",
            label: "",
            dataForOptions: dataSources.V2.stockSheet
        },
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
    Switch: [
        "DealType"
    ]

}

