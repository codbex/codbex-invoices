angular.module('gross-profit', ['blimpKit', 'platformView']).controller('grossProfitController', ($scope, $http) => {
    const Shell = new ShellHub();

    $scope.openPerspective = () => {
        if (viewData && viewData.perspectiveId) Shell.showPerspective({ id: viewData.perspectiveId });
    };

    $http.get('/services/ts/codbex-invoices/widgets/api/InvoiceService.ts/invoiceData').then((response) => {
        $scope.$evalAsync(() => {
            $scope.grossProfit = calculateGrossProfit(response.data);
        });
    }, (error) => {
        console.error(error);
    });

    function calculateGrossProfit(invoiceData) {
        if (invoiceData) {
            return ((invoiceData.SalesInvoiceTotal) - (invoiceData.PurchaseInvoiceTotal)).toFixed(2);
        }
    }
});