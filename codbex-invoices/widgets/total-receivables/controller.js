angular.module('total-receivables', ['ideUI', 'ideView'])
    .controller('totalReceivablesController', ['$scope', '$http', 'messageHub', function ($scope, $http, messageHub) {
        $scope.state = {
            isBusy: true,
            error: false,
            busyText: "Loading...",
        };

        $scope.openPerspective = function (perspective) {
            if (perspective === 'sales-orders') {
                messageHub.postMessage('launchpad.switch.perspective', { perspectiveId: 'sales-orders' }, true);
            } else if (perspective === 'products') {
                messageHub.postMessage('launchpad.switch.perspective', { perspectiveId: 'products' }, true);
            } else if (perspective === 'sales-invoices') {
                messageHub.postMessage('launchpad.switch.perspective', { perspectiveId: 'sales-invoices' }, true);
            }
            ;
        }

        $scope.today = new Date();


        const invoiceServiceUrl = "/services/ts/codbex-invoices/widgets/api/InvoiceService.ts/invoiceData";
        $http.get(invoiceServiceUrl)
            .then(function (response) {
                $scope.InvoiceData = response.data;
            });

    }]);