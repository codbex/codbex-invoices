const app = angular.module('templateApp', ['ideUI', 'ideView']);
app.controller('templateController', ['$scope', '$http', 'ViewParameters', 'messageHub', function ($scope, $http, ViewParameters, messageHub) {
    const params = ViewParameters.get();
    $scope.showDialog = true;

    $scope.generateInvoice = function () {
        const creditNoteUrl = "/services/ts/codbex-invoices/gen/codbex-invoices/api/CreditNote/CreditNoteService.ts/";

        creditNoteData = {
            Date: new Date(),
            salesInvoice: params.id
        }

        $http.post(creditNoteUrl, creditNoteData)
            .catch(function (error) {
                alert("Error creating credit note:" + error.data.message);
                console.log("Error creating credit note:" + error.data.message);
                $scope.closeDialog();
            });
    };

    $scope.closeDialog = function () {
        $scope.showDialog = false;
        messageHub.closeDialogWindow("credit-note-generate");
    };

    // @ts-ignore
    document.getElementById("dialog").style.display = "block";
}]);