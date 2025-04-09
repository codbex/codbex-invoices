const viewData = {
    id: 'codbex-invoices-Reports-UNPAID_PURCHASEINVOICE-print',
    label: 'Print',
    path: '/services/web/codbex-invoices/gen/unpaid-purchase-invoice/ui/${perspectiveName}/UNPAID_PURCHASEINVOICE/dialog-print/index.html',
    perspective: '${perspectiveName}',
    view: 'UNPAID_PURCHASEINVOICE',
    type: 'page',
    order: 10
};
if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}