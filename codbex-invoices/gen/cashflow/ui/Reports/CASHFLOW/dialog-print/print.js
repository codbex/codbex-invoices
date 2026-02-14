const viewData = {
    id: 'codbex-invoices-Reports-CASHFLOW-print',
    label: 'Print',
    translation: {
        key: 'codbex-invoices:cashflow-report.defaults.print',
    },
    path: '/services/web/codbex-invoices/gen/cashflow/ui/Reports/CASHFLOW/dialog-print/index.html',
    perspective: 'Reports',
    view: 'CASHFLOW',
    type: 'page',
    order: 10
};
if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}