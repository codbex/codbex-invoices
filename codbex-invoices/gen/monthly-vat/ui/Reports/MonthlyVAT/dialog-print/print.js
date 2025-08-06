const viewData = {
    id: 'codbex-invoices-Reports-MonthlyVAT-print',
    label: 'Print',
    translation: {
        key: '$projectName:defaults.print',
    },
    path: '/services/web/codbex-invoices/gen/monthly-vat/ui/Reports/MonthlyVAT/dialog-print/index.html',
    perspective: 'Reports',
    view: 'MonthlyVAT',
    type: 'page',
    order: 10
};
if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}