angular.module('gross-profit', ['ideUI', 'ideView'])
    .controller('grossProfitController', ['$scope', '$http', function ($scope, $http) {
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

        const invoiceServiceUrl = "/services/ts/codbex-invoices/widgets/api/InvoiceService.ts/invoiceData";
        $http.get(invoiceServiceUrl)
            .then(function (response) {
                $scope.InvoiceData = response.data;
                calculateGrossProfit();
            });

        const orderServiceUrl = "/services/ts/codbex-invoices/widgets/api/OrderService.ts/orderData";
        $http.get(orderServiceUrl)
            .then(function (response) {
                $scope.OrderData = response.data;
                calculateGrossProfit();
            });

        function calculateGrossProfit() {
            if ($scope.InvoiceData && $scope.OrderData) {
                $scope.GrossProfit = (($scope.InvoiceData.SalesInvoiceTotal + $scope.OrderData.SalesOrderTotal) - ($scope.InvoiceData.PurchaseInvoiceTotal + $scope.OrderData.PurchaseOrderTotal)).toFixed(2);
            }
        }
    }]);