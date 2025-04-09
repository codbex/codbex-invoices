angular.module('total-receivables', ['blimpKit', 'platformView']).controller('totalReceivablesController', ($scope, $http) => {
    const Shell = new ShellHub();

    $scope.openPerspective = () => {
        if (viewData && viewData.perspectiveId) Shell.showPerspective({ id: viewData.perspectiveId });
    };

    $scope.getCurrentBar = () => {
        if ($scope.invoiceData.ReceivableCurrent != null && $scope.invoiceData.ReceivableOverdue != null && $scope.invoiceData.UnpaidSalesInvoiceTotal > 0) {
            return `${($scope.invoiceData.ReceivableCurrent / $scope.invoiceData.UnpaidSalesInvoiceTotal) * 100}%`;
        } else return 0;
    };

    $scope.getOverdueBar = () => {
        if ($scope.invoiceData.ReceivableCurrent != null && $scope.invoiceData.ReceivableOverdue != null && $scope.invoiceData.UnpaidSalesInvoiceTotal > 0) {
            return `${($scope.invoiceData.ReceivableOverdue / $scope.invoiceData.UnpaidSalesInvoiceTotal) * 100}%`;
        } else return 0;
    };

    $http.get('/services/ts/codbex-invoices/widgets/api/InvoiceService.ts/invoiceData').then((response) => {
        $scope.$evalAsync(() => {
            $scope.invoiceData = response.data;
        });
    }, (error) => {
        console.error(error);
    });

});