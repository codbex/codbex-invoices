const creditNoteApp = angular.module('CreditNoteApp', ['ideUI', 'ideView']);

creditNoteApp.controller('CreditNoteController', ['$scope', '$http', 'ViewParameters', 'messageHub', function ($scope, $http, ViewParameters, messageHub) {
    const params = ViewParameters.get();
    $scope.showDialog = true;

    $scope.submitCopy = function (newNet) {
        const creditNoteUrl = "/services/ts/codbex-invoices/gen/codbex-invoices/api/CreditNote/CreditNoteService.ts/";

        const creditNoteData = {
            Date: new Date(),
            SalesInvoice: params.id,
            NewNet: newNet
        }

        $http.post(creditNoteUrl, creditNoteData)
            .then($scope.closeDialog)
            .catch(function (error) {
                alert("Error creating credit note:" + error.data.message);
                // console.log("Error creating credit note:" + error.data.message);
                $scope.closeDialog();
            });
    }

    $scope.closeDialog = function () {
        $scope.showDialog = false;
        messageHub.closeDialogWindow("credit-note-generate");
    };
}]);