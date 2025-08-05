const viewData = {
    id: 'codbex-invoices-Reports-UNPAID_SALESINVOICE-print',
    label: 'Print',
    translation: {
        key: '$projectName:defaults.print',
    },
    path: '/services/web/codbex-invoices/gen/unpaid-sales-invoice/ui/Reports/UNPAID_SALESINVOICE/dialog-print/index.html',
    perspective: 'Reports',
    view: 'UNPAID_SALESINVOICE',
    type: 'page',
    order: 10
};
if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}