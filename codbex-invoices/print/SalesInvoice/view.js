const viewData = {
    id: 'sales-invoice-print',
    label: 'Print',
    link: '/services/ts/codbex-templates/print/sales-invoice-print-template.ts',
    perspective: 'salesinvoice',
    view: 'SalesInvoice',
    type: 'entity',
    order: 30
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}