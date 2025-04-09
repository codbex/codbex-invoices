angular.module('unpaid-sales-invoices', ['blimpKit', 'platformView']).controller('unpaidSalesInvoicesController', ($scope, $http) => {
    const Shell = new ShellHub();
    $scope.today = new Date();

    $scope.openPerspective = () => {
        if (viewData && viewData.perspectiveId) Shell.showPerspective({ id: viewData.perspectiveId });
    };

    $http.get('/services/ts/codbex-invoices/widgets/api/InvoiceService.ts/invoiceData').then((response) => {
        $scope.$evalAsync(() => {
            $scope.invoiceData = response.data;
        });
    }, (error) => {
        console.error(error);
    });

});