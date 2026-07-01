const viewData = {
    id: 'total-receivables-widget',
    label: 'Total Receivables Widget',
    path: '/services/web/codbex-invoices/widgets/total-receivables/index.html',
    lazyLoad: true,
    autoFocusTab: false,
    perspectiveId: 'SalesInvoice',
    size: 'medium'
};
if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}