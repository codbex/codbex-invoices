const viewData = {
    id: 'codbex-invoices-Reports-CASHFLOW-print',
    label: 'Print',
    path: '/services/web/codbex-invoices/gen/cashflow/ui/${perspectiveName}/CASHFLOW/dialog-print/index.html',
    perspective: '${perspectiveName}',
    view: 'CASHFLOW',
    type: 'page',
    order: 10
};
if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}