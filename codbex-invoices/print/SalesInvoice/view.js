const viewData = {
    id: 'sales-invoice-print',
    label: 'Print',
    path: '/services/ts/codbex-templates/print/sales-invoice-print-template.ts',
    translation: {
        key: 'codbex-orders:t.SALESINVOICE',
    },
    perspective: 'SalesInvoice',
    view: 'SalesInvoice',
    type: 'entity',
    order: 30
};
if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}