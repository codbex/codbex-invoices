const viewData = {
    id: 'codbex-invoices-Reports-MonthlyVAT-print',
    label: 'Print',
    path: '/services/web/codbex-invoices/gen/monthly-vat/ui/${perspectiveName}/MonthlyVAT/dialog-print/index.html',
    perspective: '${perspectiveName}',
    view: 'MonthlyVAT',
    type: 'page',
    order: 10
};
if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}