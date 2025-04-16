angular.module('NoteApp', ['blimpKit', 'platformView']).controller('NoteController', ($scope, $http, ViewParameters) => {
    const params = ViewParameters.get();
    const Dialogs = new DialogHub();
    let salesInvoiceNet;
    let salesInvoiceData;
    $scope.models = {
        net: 0
    };

    $http.get(`/services/ts/codbex-invoices/events/generate/Note/api/GenerateNoteService.ts/salesInvoiceData/${params.id}`).then(response => {
        salesInvoiceData = response.data;
    }).catch(error => {
        Dialogs.showAlert({
            title: 'Error fetching sales invoice data',
            message: error.data.message,
            type: AlertTypes.Error,
            preformatted: true,
        });
        $scope.closeDialog();
    });

    $http.get(`/services/ts/codbex-invoices/events/generate/Note/api/GenerateNoteService.ts/salesInvoiceNet/${params.id}`).then(response => {
        salesInvoiceNet = response.data;
    }).catch(error => {
        Dialogs.showAlert({
            title: 'Error fetching sales invoice Net',
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

        const noteData = {
            ...salesInvoiceData,
            SalesInvoice: params.id,
            Date: new Date().toISOString(),
            Net: parseFloat($scope.models.net)
        };

        if (salesInvoiceNet && salesInvoiceNet > net) {
            $http.post('/services/ts/codbex-invoices/gen/codbex-invoices/api/DebitNote/DebitNoteService.ts/', noteData).then(() => {
                $scope.closeDialog();
            }).catch(error => {
                Dialogs.showAlert({
                    title: 'Error creating debit note',
                    message: error.data.message,
                    type: AlertTypes.Error,
                    preformatted: true,
                });
                console.error('Error creating debit note:', error.data.message);
                $scope.closeDialog();
            });
        } else {
            $http.post('/services/ts/codbex-invoices/gen/codbex-invoices/api/CreditNote/CreditNoteService.ts/', noteData).then(() => {
                $scope.closeDialog();
            }).catch(error => {
                Dialogs.showAlert({
                    title: 'Error creating credit note',
                    message: error.data.message,
                    type: AlertTypes.Error,
                    preformatted: true,
                });
                console.error('Error creating credit note:', error.data.message);
                $scope.closeDialog();
            });
        }
    };

    $scope.closeDialog = () => {
        Dialogs.closeWindow({ path: viewData.path });
    };
});