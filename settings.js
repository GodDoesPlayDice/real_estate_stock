// настройка пользователей
var users = {
    "alikjackass@gmail.com": {
        department: "O2",
        role: "admin"
    },
    "nf0000000009@gmail.com": {
        department: "V2",
        role: "manager",
    },
    "nf0000000009@gmail.com": {
        department: "V2",
        role: "manager",
    },
    "roxxxanafray@gmail.com": {
        department: "O2",
        role: "admin"
    },
    "t2484958@gmail.com": {
        department: "O2",
        role: "manager"
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

var userSettings = {
    O2: {
        ssID:'1eOrUozWjzBSw3ioWUF3GuAMYNo8oLuXgDc5ZEw5Hn34',
        departmentName: "Оазис 2",
        roles: {
            admin: {
                data: {
                    utilitySheet: 'utility_data',
                    stockSheet: 'all_apartments',
                    priceSheet: 'price',
                    salarySheet: 'salary',

                    docsSheet: 'docs_current',
                    uncheckedSheet: 'unchecked_current',
                },
                links: {
                    archiveSheet: 'archive',
                    storageSheet: 'storage_raw',
                    uncheckedStorageSheet: 'verification_raw',
                },

                features: {
                    edit_screen: true,
                    verification_screen: true,
                    verify: true,
                    delete: true,
                    mail: true,
                }
            },
            manager: {
                data: {
                    utilitySheet: 'utility_data',
                    stockSheet: 'all_apartments',
                    priceSheet: 'price',
                    salarySheet: 'salary',

                    docsSheet: 'docs_current',
                    uncheckedSheet: 'unchecked_current',
                },
                links: {
                    archiveSheet: 'archive',
                    storageSheet: 'verification_raw',
                },
                features: {
                    edit_screen: true,
                    verification_screen: true,
                    verify: false,
                    delete: false,
                    mail: true
                },
            }
        }

    },
    V2: {
        ssID:'15iA9-3RpTFuFWLUHsjs4eUBjCKjU0dbdUPNxgwrw17M',
        departmentName: "Виноград 2",
        roles: {
            admin: {
                data: {
                    utilitySheet: 'utility_data',
                    stockSheet: 'all_apartments',

                    docsSheet: 'docs_current',
                    uncheckedSheet: 'unchecked_current',
                },
                links: {
                    archiveSheet: 'archive',
                    storageSheet: 'storage_raw',
                },

                features: {
                    edit_screen: true,
                    verification_screen: true,
                    verify: true,
                    delete: true,
                }
            },
            manager: {
                data: {
                    utilitySheet: 'utility_data',
                    stockSheet: 'all_apartments',

                    docsSheet: 'docs_current',
                },
                links: {
                    archiveSheet: 'archive',
                    storageSheet: 'storage_raw',
                },
                features: {
                    edit_screen: true,
                    verification_screen: false,
                    verify: false,
                    delete: true,
                },
            }
        }
    },
    B: {
        ssID:'16k9kb_Kv6VoHXVe-9ZQHTX_8UkHP3_8W3A6Qz8Ec7uY',
        departmentName: "Баланс",
        roles: {
            admin: {
                data: {
                    utilitySheet: 'utility_data',
                    stockSheet: 'all_apartments',

                    docsSheet: 'docs_current',
                    uncheckedSheet: 'unchecked_current',
                },
                links: {
                    archiveSheet: 'archive',
                    storageSheet: 'storage_raw',
                },

                features: {
                    edit_screen: true,
                    verification_screen: true,
                    verify: true,
                    delete: true,
                }
            },
            manager: {
                data: {
                    utilitySheet: 'utility_data',
                    stockSheet: 'all_apartments',

                    docsSheet: 'docs_current',
                },
                links: {
                    archiveSheet: 'archive',
                    storageSheet: 'storage_raw',
                },
                features: {
                    edit_screen: true,
                    verification_screen: false,
                    verify: false,
                    delete: true,
                },
            }
        }
    },
    test: {
        ssID:'1ex7gzC35SjS4f4y8U0LvYR8zKMPbPzso8B90ac_571I',
        departmentName: "Тестирование",
        roles: {
            admin: {
                data: {
                    utilitySheet: 'utility_data',
                    stockSheet: 'all_apartments',

                    docsSheet: 'docs_current',
                },
                links: {
                    archiveSheet: 'archive',
                    storageSheet: 'storage_raw',
                },

                features: {
                    statuses: true,
                    edit: true,
                    verify: false,
                    delete: true,
                }
            },
            manager: {
                data: {
                    utilitySheet: 'utility_data',
                    stockSheet: 'all_apartments',

                    docsSheet: 'docs_current',
                },
                links: {
                    archiveSheet: 'archive',
                    storageSheet: 'storage_raw',
                },
                features: {
                    statuses: true,
                    edit: true,
                    verify: false,
                    delete: true,
                },
            }
        }
    }
}

function initUserProperties(userName) {
    let department = users[userName].department;
    let role = users[userName].role;
    let ssID = userSettings[department].ssID;
    let dataPropsArr = Object.keys(userSettings[department].roles[role].data);
    let linkPropsArr = Object.keys(userSettings[department].roles[role].links);
    /* инициализация свойств, содержащих данные таблиц */
    dataPropsArr.forEach((elem) => {
        let sheet = userSettings[department].roles[role].data[elem];
        Object.defineProperty(userSettings[department].roles[role].data, elem, {
            get: function () {
                return SpreadsheetApp.openById(ssID).getSheetByName(sheet).getDataRange().getValues()
            }
        })
    })
    /* инициализация свойств, содержащих сслылки на таблицы (для записи в них) */
    linkPropsArr.forEach((elem) => {
        let sheet = userSettings[department].roles[role].links[elem];
        Object.defineProperty(userSettings[department].roles[role].links, elem, {
            get: function () {
                return SpreadsheetApp.openById(ssID).getSheetByName(sheet)
            }
        })
    });
};


var dictionary = {
    ID: 'Идентификатор документа:',
    Timestamp: 'Отметка времени:',
    DocStatus: 'Статус документа:',
    IsCession: 'уступка права требования',
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
    Comment: 'Комментарий:',
    TotalArea: 'Общая площадь:',
    AreaWithoutBalconies: 'Площадь без учета летних помещений:',
    Floor: 'Этаж:',
    /* дальше поля которые сейчас пока только в оазисе */
    IndPercentMagangerComission: 'Индивидуальный % МОП за сделку:',
    IndPercentHeadComission: 'Индивидуальный % РОП за сделку:',
    IndPercentAgencyComission: 'Индивидуальный % АН за сделку:',
    ShareInOwnership: 'Доля собственности:',
    OwnershipType: 'Форма собственности:',
    PhoneNumber: 'Телефон:',
    SecondPhoneNumber: 'Второй телефон:',
    Email: 'E-mail:',
    Passport: 'Паспортные данные:',
    HomeAddres: 'Адрес регистрации:',
    PaymentForRemoteDeal: 'Эл. регистрация (от клиента):',
    FirstSubsidyPayment: 'Субсидия платеж 1:',
    DaysBeforeFirstSubsidy: 'Дней на зачисление (Субсидия платеж 1):',
    SecondSubsidyPayment: 'Субсидия платеж 2:',
    DaysBeforeSecondSubsidy: 'Дней на зачисление (Субсидия платеж 2):',
    BankLoanPayment: 'Банковский кредит:',
    DaysBeforeBankLoan: 'Дней на зачисление Кредита:',
    PaymentFromDeveloper: 'ПВ от Застройщика:',
    FoolTaxPaymentInBankLoan: 'ННЛ в составе кредита:',
    FoolTaxPaymentFromClient: 'ННЛ от клиента:',
    CashFromClient: 'Наличные от клиента:',
    InitialPaymentFromClient: 'Первоначальный взнос (от клиента):',
    InitialPaymentType: 'Вид первоначального взноса:',
    DaysBeforeInitialPayment: 'Дней на внесение ПВ после регистрации:',
    InstallmentMonthsNumber: 'Количество месяцев рассрочки:',
    InstallmentPaymentsNumber: 'Количество выплат по рассрочке:',
    InstallmentPayment1: 'Платеж 1:',
    DateOfInstallmentPayment1: 'Дата платежа 1:',
    InstallmentPayment2: 'Платеж 2:',
    DateOfInstallmentPayment2: 'Дата платежа 2:',
    InstallmentPayment3: 'Платеж 3:',
    DateOfInstallmentPayment3: 'Дата платежа 3:',
    InstallmentPayment4: 'Платеж 4:',
    DateOfInstallmentPayment4: 'Дата платежа 4:',
    InstallmentPayment5: 'Платеж 5:',
    DateOfInstallmentPayment5: 'Дата платежа 5:',
    InstallmentPayment6: 'Платеж 6:',
    DateOfInstallmentPayment6: 'Дата платежа 6:',
    InstallmentPayment7: 'Платеж 7:',
    DateOfInstallmentPayment7: 'Дата платежа 7:',
    InstallmentPayment8: 'Платеж 8:',
    DateOfInstallmentPayment8: 'Дата платежа 8:',
    InstallmentPayment9: 'Платеж 9:',
    DateOfInstallmentPayment9: 'Дата платежа 9:',
    InstallmentPayment10: 'Платеж 10:',
    DateOfInstallmentPayment10: 'Дата платежа 10:',
    InstallmentPayment11: 'Платеж 11:',
    DateOfInstallmentPayment11: 'Дата платежа 11:',
    InstallmentPayment12: 'Платеж 12:',
    DateOfInstallmentPayment12: 'Дата платежа 12:',
    InstallmentPayment13: 'Платеж 13:',
    DateOfInstallmentPayment13: 'Дата платежа 13:',
    InstallmentPayment14: 'Платеж 14:',
    DateOfInstallmentPayment14: 'Дата платежа 14:',
    InstallmentPayment15: 'Платеж 15:',
    DateOfInstallmentPayment15: 'Дата платежа 15:',
    InstallmentPayment16: 'Платеж 16:',
    DateOfInstallmentPayment16: 'Дата платежа 16:',
    InstallmentPayment17: 'Платеж 17:',
    DateOfInstallmentPayment17: 'Дата платежа 17:',
    InstallmentPayment18: 'Платеж 18:',
    DateOfInstallmentPayment18: 'Дата платежа 18:',
    InstallmentPayment19: 'Платеж 19',
    DateOfInstallmentPayment19: 'Дата платежа 19',
    InstallmentPayment20: 'Платеж 20',
    DateOfInstallmentPayment20: 'Дата платежа 20',
    InstallmentPayment21: 'Платеж 21',
    DateOfInstallmentPayment21: 'Дата платежа 21',
    InstallmentPayment22: 'Платеж 22:',
    DateOfInstallmentPayment22: 'Дата платежа 22:',
    InstallmentPayment23: 'Платеж 23:',
    DateOfInstallmentPayment23: 'Дата платежа 23:',
    InstallmentPayment24: 'Платеж 24:',
    DateOfInstallmentPayment24: 'Дата платежа 24:',
    InstallmentPayment25: 'Платеж 25:',
    DateOfInstallmentPayment25: 'Дата платежа 25:',
    InstallmentPayment26: 'Платеж 26:',
    DateOfInstallmentPayment26: 'Дата платежа 26:',
    InstallmentPayment27: 'Платеж 27:',
    DateOfInstallmentPayment27: 'Дата платежа 27:',
    DiscountPerOneSquareMeter: 'Скидка с 1 кв.м.:',
    DiscountOnFlat: 'Скидка:',
    ActualOneSquareMeterCost: 'Стоимость 1 кв.м для расчета комиссий:',
    StockOneSquareMeterCost: 'Стоимость 1 кв.м. по шахматке:',
    StockFlatCost: 'Стоимость квартиры по шахматке:',
    FormalCostIncrease: 'Увеличение стоимости:',
    LegalOneSquareMeterCost: 'Стоимость 1 кв. м. по ДДУ:',
    MagangerComissionPercent: '% МОП за сделку:',
    HeadComissionPercent: '% РОП за сделку:',
    ManagerComission: 'Комиссия МОП за сделку (сумма):',
    HeadComission: 'Комиссия РОП за сделку (сумма):',
    AgencyComissionPercent: '% АН за сделку:',
    AgencyComission: 'Комиссия АН (сумма):',
    }

