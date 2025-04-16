angular.module('total-sales', ['blimpKit', 'platformView']).controller('totalSalesController', ($scope, $http) => {
    const Shell = new ShellHub();

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