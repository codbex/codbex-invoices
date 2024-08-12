const debitNoteApp = angular.module('DebitNoteApp', ['ideUI', 'ideView']);

debitNoteApp.controller('DebitNoteController', ['$scope', '$http', 'ViewParameters', 'messageHub', function ($scope, $http, ViewParameters, messageHub) {
    const params = ViewParameters.get();
    $scope.showDialog = true;

    $scope.submitCopy = function (newNet) {
        const debitNoteUrl = "/services/ts/codbex-invoices/gen/codbex-invoices/api/DebitNote/DebitNoteService.ts/";

        const debitNoteData = {
            Date: new Date(),
            SalesInvoice: params.id,
            NewNet: newNet
        }

        $http.post(debitNoteUrl, debitNoteData)
            .then($scope.closeDialog)
            .catch(function (error) {
                alert("Error creating debit note:" + error.data.message);
                // console.log("Error creating debit note:" + error.data.message);
                $scope.closeDialog();
            });
    }

    $scope.closeDialog = function () {
        $scope.showDialog = false;
        messageHub.closeDialogWindow("debit-note-generate");
    };
}]);