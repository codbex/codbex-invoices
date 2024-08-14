const creditNoteApp = angular.module('CreditNoteApp', ['ideUI', 'ideView']);

creditNoteApp.controller('CreditNoteController', ['$scope', '$http', 'ViewParameters', 'messageHub', function ($scope, $http, ViewParameters, messageHub) {
    const params = ViewParameters.get();
    $scope.showDialog = true;

    // Fetch sales invoice data
    const salesInvoiceDataUrl = `/services/ts/codbex-invoices/events/generate/CreditNote/api/GenerateCreditNoteService.ts/salesInvoiceData/${params.id}`;
    $http.get(salesInvoiceDataUrl)
        .then(response => {
            $scope.SalesInvoiceData = response.data;
        })
        .catch(error => {
            alert("Error fetching sales invoice data: " + error.data.message);
            $scope.closeDialog();
        });

    // Submit the credit note
    $scope.submitCopy = function (net) {
        if (!net || isNaN(net)) {
            alert("Please enter a valid Net value.");
            return;
        }

        const creditNoteUrl = "/services/ts/codbex-invoices/gen/codbex-invoices/api/CreditNote/CreditNoteService.ts/";

        const creditNoteData = {
            ...$scope.SalesInvoiceData,  // Spread the sales invoice data
            SalesInvoice: params.id,
            Date: new Date().toISOString(),  // Ensure correct date format
            Net: parseFloat(net)  // Ensure Net is a number
        };

        console.log("Submitting credit note data:", creditNoteData);

        $http.post(creditNoteUrl, creditNoteData)
            .then(response => {
                console.log("Credit note created successfully:", response.data);
                $scope.closeDialog();
            })
            .catch(error => {
                alert("Error creating credit note: " + error.data.message);
                $scope.closeDialog();
            });
    };

    // Close the dialog
    $scope.closeDialog = function () {
        $scope.showDialog = false;
        messageHub.closeDialogWindow("credit-note-generate");
    };
}]);
