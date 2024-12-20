const viewData = {
    id: 'codbex-invoices-Reports-MonthlyVAT-print',
    label: 'Print',
    link: '/services/web/codbex-invoices/gen/monthly-vat/ui/Reports/MonthlyVAT/dialog-print/index.html',
    perspective: 'Reports',
    view: 'MonthlyVAT',
    type: 'page',
    order: 10
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}