angular.module('NoteApp', ['blimpKit', 'platformView']).controller('NoteController', ($scope, $http, ViewParameters) => {
    const params = ViewParameters.get();
    const Dialogs = new DialogHub();

    $scope.models = {
        net: 0
    };

    const salesInvoiceDataUrl = `/services/ts/codbex-invoices/events/generate/DebitNote/api/GenerateDebitNoteService.ts/salesInvoiceData/${params.id}`;
    const salesInvoiceSubmitUrl = "/services/ts/codbex-invoices/gen/codbex-invoices/api/salesinvoice/SalesInvoiceService.ts/";

    $http.get(salesInvoiceDataUrl)
        .then(response => {
            $scope.SalesInvoiceData = response.data.SalesInvoice;
            $scope.IsCreditOrDebit = $scope.SalesInvoiceData.Type == 1 || $scope.SalesInvoiceData.Type == 2;
        })
        .catch(error => {
            Dialogs.showAlert({
                title: 'Error fetching sales invoice data',
                message: error.data.message,
                type: AlertTypes.Error,
                preformatted: true,
            });
            $scope.closeDialog();
        });

    $scope.submitCopy = () => {

        if ($scope.models.net === undefined) {
            Dialogs.showAlert({
                title: 'Invalid input',
                message: 'Please enter a valid Net value.',
                type: AlertTypes.Error,
            });
            return;
        }

        const debitSalesInvoice =
        {
            "Type": 1,
            "Customer": $scope.SalesInvoiceData.Customer,
            "Date": $scope.SalesInvoiceData.Date,
            "Due": $scope.SalesInvoiceData.Due,
            "Net": $scope.models.net,
            "Currency": $scope.SalesInvoiceData.Currency,
            "VAT": $scope.models.net * 0.2,
            "Total": $scope.models.net * 1.20,
            "Paid": 0,
            "Conditions": $scope.SalesInvoiceData.Conditions,
            "PaymentMethod": $scope.SalesInvoiceData.PaymentMethod,
            "SentMethod": $scope.SalesInvoiceData.SentMethod,
            "Status": 1,
            "Operator": $scope.SalesInvoiceData.Operator,
            "Company": $scope.SalesInvoiceData.Company,
            "Reference": "Invoice " + $scope.SalesInvoiceData.Number + " / " + new Date($scope.SalesInvoiceData.Date).toISOString().slice(0, 10)
        }

        $http.post(salesInvoiceSubmitUrl, debitSalesInvoice)
            .then(response => {
                console.log("Debit note created successfully:", response.data);
                $scope.closeDialog();
            })
            .catch(error => {
                Dialogs.showAlert({
                    title: 'Error creating debit note',
                    message: error.data.message,
                    type: AlertTypes.Error,
                    preformatted: true,
                });
                console.error('Error creating debit note:', error.data.message);
                $scope.closeDialog();
            });
    };

    $scope.closeDialog = () => {
        Dialogs.closeWindow({ path: viewData.path });
    };
});