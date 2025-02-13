const viewData = {
    id: 'purchase-invoice-print',
    label: 'Print',
    link: '/services/ts/codbex-templates/print/purchase-invoice-print-template.ts',
    perspective: 'purchaseinvoice',
    view: 'PurchaseInvoice',
    type: 'entity',
    order: 30
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}