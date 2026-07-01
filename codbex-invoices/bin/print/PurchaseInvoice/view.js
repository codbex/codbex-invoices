const viewData = {
    id: 'purchase-invoice-print',
    label: 'Print',
    path: '/services/ts/codbex-templates/print/purchase-invoice-print-template.ts',
    translation: {
        key: 'codbex-orders:t.PURCHASEINVOICE',
    },
    perspective: 'PurchaseInvoice',
    view: 'PurchaseInvoice',
    type: 'entity',
    order: 30
};

if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}