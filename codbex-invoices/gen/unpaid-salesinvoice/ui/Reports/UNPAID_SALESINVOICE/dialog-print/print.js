const viewData = {
    id: 'codbex-invoices-Reports-UNPAID_SALESINVOICE-print',
    label: 'Print',
    link: '/services/web/codbex-invoices/gen/unpaid-salesinvoice/ui/Reports/UNPAID_SALESINVOICE/dialog-print/index.html',
    perspective: 'Reports',
    view: 'UNPAID_SALESINVOICE',
    type: 'page',
    order: 10
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}