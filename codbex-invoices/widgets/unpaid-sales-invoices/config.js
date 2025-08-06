const viewData = {
    id: 'unpaid-sales-invoices-widget',
    label: 'Unpaid Sales Invoices Widget',
    path: '/services/web/codbex-invoices/widgets/unpaid-sales-invoices/index.html',
    lazyLoad: true,
    autoFocusTab: false,
    perspectiveId: 'SalesInvoice',
    size: 'small'
};
if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}