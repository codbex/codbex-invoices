const NoteApp = angular.module('NoteApp', ['ideUI', 'ideView']);

NoteApp.controller('NoteController', ['$scope', '$http', 'ViewParameters', 'messageHub', function ($scope, $http, ViewParameters, messageHub) {
    const params = ViewParameters.get();
    $scope.showDialog = true;

    const salesInvoiceDataUrl = `/services/ts/codbex-invoices/events/generate/DebitNote/api/GenerateDebitNoteService.ts/salesInvoiceData/${params.id}`;
    const salesInvoiceSubmitUrl = "/services/ts/codbex-invoices/gen/codbex-invoices/dao/salesinvoice/SalesInvoiceRepository.ts/";

    $http.get(salesInvoiceDataUrl)
        .then(response => {
            $scope.SalesInvoiceData = response.data.SalesInvoice;
            $scope.IsCreditOrDebit = $scope.SalesInvoiceData.Type == 1 || $scope.SalesInvoiceData.Type == 2;
        })
        .catch(error => {
            alert("Error fetching sales invoice data: " + error.data.message);
            $scope.closeDialog();
        });

    $scope.submitCopy = function (net) {

        if (!net || isNaN(net)) {
            alert("Please enter a valid Net value.");
            return;
        }

        const creditSalesInvoice =
        {
            "Type": 1,
            "Customer": $scope.SalesInvoiceData.Customer,
            "Date": $scope.SalesInvoiceData.Date,
            "Due": $scope.SalesInvoiceData.Due,
            "Net": net,
            "Currency": $scope.SalesInvoiceData.Currency,
            "VAT": net * 0.2,
            "Total": net * 1.20,
            "Paid": 0,
            "Conditions": $scope.SalesInvoiceData.Conditions,
            "PaymentMethod": $scope.SalesInvoiceData.PaymentMethod,
            "SentMethod": $scope.SalesInvoiceData.SentMethod,
            "Status": 1,
            "Operator": $scope.SalesInvoiceData.Operator,
            "Company": $scope.SalesInvoiceData.Company,
            "Reference": "Invoice " + $scope.SalesInvoiceData.Number + " / " + $scope.SalesInvoiceData.Date
        }

        $http.post(salesInvoiceSubmitUrl, creditSalesInvoice)
            .then(response => {
                console.log("Debit note created successfully:", response.data);
                $scope.closeDialog();
            })
            .catch(error => {
                alert("Error creating debit note: " + error.data.message);
                $scope.closeDialog();
            });
    };

    $scope.closeDialog = function () {
        $scope.showDialog = false;
        messageHub.closeDialogWindow("debit-note-generate");
    };
}]);
