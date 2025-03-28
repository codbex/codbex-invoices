const NoteApp = angular.module('NoteApp', ['ideUI', 'ideView']);

NoteApp.controller('NoteController', ['$scope', '$http', 'ViewParameters', 'messageHub', function ($scope, $http, ViewParameters, messageHub) {
    const params = ViewParameters.get();
    $scope.showDialog = true;

    const salesInvoiceDataUrl = `/services/ts/codbex-invoices/events/generate/DebitNote/api/GenerateDebitNoteService.ts/salesInvoiceData/${params.id}`;
    $http.get(salesInvoiceDataUrl)
        .then(response => {
            $scope.SalesInvoiceData = response.data;
            $scope.IsCreditOrDebit = $scope.SalesInvoiceData.Type == 1 || $scope.SalesInvoiceData.Type == 2;
        })
        .catch(error => {
            alert("Error fetching sales invoice data: " + error.data.message);
            $scope.closeDialog();
        });

    const salesInvoiceNetUrl = `/services/ts/codbex-invoices/events/generate/DebitNote/api/GenerateDebitNoteService.ts/salesInvoiceNet/${params.id}`;
    $http.get(salesInvoiceNetUrl)
        .then(response => {
            $scope.SalesInvoiceNet = response.data;
        })
        .catch(error => {
            alert("Error fetching sales invoice Net: " + error.data.message);
            $scope.closeDialog();
        });

    $scope.submitCopy = function (net) {
        if (!net || isNaN(net)) {
            alert("Please enter a valid Net value.");
            return;
        }

        const creditNoteUrl = "/services/ts/codbex-invoices/gen/codbex-invoices/api/CreditNote/CreditNoteService.ts/";
        const debitNoteUrl = "/services/ts/codbex-invoices/gen/codbex-invoices/api/DebitNote/DebitNoteService.ts/";

        const noteData = {
            ...$scope.SalesInvoiceData,
            SalesInvoice: params.id,
            Date: new Date().toISOString(),
            Net: parseFloat(net)
        };

        if ($scope.SalesInvoiceNet > net) {
            $http.post(debitNoteUrl, noteData)
                .then(response => {
                    console.log("Debit note created successfully:", response.data);
                    $scope.closeDialog();
                })
                .catch(error => {
                    alert("Error creating debit note: " + error.data.message);
                    $scope.closeDialog();
                });
        } else {
            $http.post(creditNoteUrl, noteData)
                .then(response => {
                    console.log("Credit note created successfully:", response.data);
                    $scope.closeDialog();
                })
                .catch(error => {
                    alert("Error creating credit note: " + error.data.message);
                    $scope.closeDialog();
                });
        }
    };

    $scope.closeDialog = function () {
        $scope.showDialog = false;
        messageHub.closeDialogWindow("debit-note-generate");
    };
}]);
