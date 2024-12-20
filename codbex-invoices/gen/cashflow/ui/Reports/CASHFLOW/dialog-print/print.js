const viewData = {
    id: 'codbex-invoices-Reports-CASHFLOW-print',
    label: 'Print',
    link: '/services/web/codbex-invoices/gen/cashflow/ui/Reports/CASHFLOW/dialog-print/index.html',
    perspective: 'Reports',
    view: 'CASHFLOW',
    type: 'page',
    order: 10
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}