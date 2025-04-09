angular.module('total-payables', ['blimpKit', 'platformView']).controller('totalPayablesController', ($scope, $http) => {
    const Shell = new ShellHub();

    $scope.openPerspective = () => {
        if (viewData && viewData.perspectiveId) Shell.showPerspective({ id: viewData.perspectiveId });
    };

    $scope.getCurrentBar = () => {
        if ($scope.invoiceData.PayablesOverdue != null && $scope.invoiceData.PayablesCurrent != null && $scope.invoiceData.UnpaidPurchaseInvoiceTotal > 0) {
            return `${($scope.invoiceData.PayablesCurrent / $scope.invoiceData.UnpaidPurchaseInvoiceTotal) * 100}%`;
        } else return 0;
    };

    $scope.getOverdueBar = () => {
        if ($scope.invoiceData.PayablesOverdue != null && $scope.invoiceData.PayablesCurrent != null && $scope.invoiceData.UnpaidPurchaseInvoiceTotal > 0) {
            return `${($scope.invoiceData.PayablesOverdue / $scope.invoiceData.UnpaidPurchaseInvoiceTotal) * 100}%`;
        } else return 0;
    };

    $http.get('/services/ts/codbex-invoices/widgets/api/InvoiceService.ts/invoiceData').then(function (response) {
        $scope.$evalAsync(() => {
            $scope.invoiceData = response.data;
        });
    }, (error) => {
        console.error(error);
    });

});