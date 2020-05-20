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
var newDocFields = {
    V2: [ 
        <Select
            id = "DocStatus"
            label = "Текущий статус документа:"
            value = ""
            others = {
                ["список возможных статусов"]
            }
        />,
        <DatePicker
            id = "CurrentStatusDate"
            label = "Дата текущего статуса:"
            value = ""
        />,
        <DatePicker
            id = "NextStatusEstimatedDate"
            label = "Предполагаемая дата следующего статуса:"
            value = ""
        />,
        <Select
            id = "SelectLiter"
            label = "Литер:"
            value = ""
            others = {
                ["все литеры"]
            }
        />,
        <Select
            id = "SelectFlat"
            label = "Номер квартиры:"
            value = ""
            others = {
                ["все свободные квартиры"]
            }
        />,
        <SimpleText
            id = "ClientName"
            label = "ФИО клиента:"
            value = ""
            inputTesting = "noStrangeSymbols();"
        />,
        <Select
            id = "SelectManager"
            label = "Менеджер:"
            value = ""
            others = {
                ["все менеджеры работающие сейчас"]
            }
        />,
        <CheckBox
            id = "RemainsOnSale"
            label = "В продаже от физ. лица:"
        />,
        <Radio
            id = "DealType"
            label = "Тип сделки:"
            first='Л'
            second='АН'
        />,
        <Select
            id = "PayMethod"
            label = "Способ оплаты:"
            value = ""
            others = {
                ["все доступные способы оплаты"]
            }
        />,
        <SimpleText
            id = "ActualCost"
            label = "Стоимость для расчета комиссии:"
            value = ""
            inputTesting = "onlyFloat();"
        />,        
        <SimpleText
            id = "LegalCost"
            label = "Стоимость по ДДУ:"
            value = ""
            inputTesting = "onlyFloat();"
        />,
        <SimpleText
            id = "LegalServiceCost"
            label = "Оплата юр. услуг:"
            value = ""
            inputTesting = "onlyFloat();"
        />,
        <Select
            id = "LegalServiceNoPayment"
            label = "Юр. услуги без оплаты:"
            value = ""
            others = {
                ["бесплатно, не оплачиваются"]
            }
        />,
        <SimpleText
            id = "RealEstateAgency"
            label = "Агентство недвижимости:"
            value = ""
            inputTesting = "noStrangeSymbols();"
        />,
        <SimpleText
            id = "EstateAgent"
            label = "Сотрудник агентства:"
            value = ""
            inputTesting = "noStrangeSymbols();"
        />,
        <TextArea
            id = "Comment"
            label = "Комментарий к документу:"
            value = ""
        />,


    ]
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


