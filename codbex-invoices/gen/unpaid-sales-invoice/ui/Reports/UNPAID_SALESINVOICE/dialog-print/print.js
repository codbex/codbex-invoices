const viewData = {
    id: 'codbex-invoices-Reports-UNPAID_SALESINVOICE-print',
    label: 'Print',
    path: '/services/web/codbex-invoices/gen/unpaid-sales-invoice/ui/${perspectiveName}/UNPAID_SALESINVOICE/dialog-print/index.html',
    perspective: '${perspectiveName}',
    view: 'UNPAID_SALESINVOICE',
    type: 'page',
    order: 10
};
if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}