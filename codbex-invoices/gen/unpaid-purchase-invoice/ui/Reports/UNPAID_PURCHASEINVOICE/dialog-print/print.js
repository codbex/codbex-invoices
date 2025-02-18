const viewData = {
    id: 'codbex-invoices-Reports-UNPAID_PURCHASEINVOICE-print',
    label: 'Print',
    link: '/services/web/codbex-invoices/gen/unpaid-purchase-invoice/ui/Reports/UNPAID_PURCHASEINVOICE/dialog-print/index.html',
    perspective: 'Reports',
    view: 'UNPAID_PURCHASEINVOICE',
    type: 'page',
    order: 10
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}