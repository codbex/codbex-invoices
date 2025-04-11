const viewData = {
    id: 'purchase-invoice-print',
    label: 'Print',
    path: '/services/ts/codbex-templates/print/purchase-invoice-print-template.ts',
    perspective: 'purchaseinvoice',
    view: 'PurchaseInvoice',
    type: 'entity',
    order: 30
};
if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}