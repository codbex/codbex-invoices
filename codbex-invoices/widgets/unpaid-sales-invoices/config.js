const viewData = {
    id: 'unpaid-sales-invoices-widget',
    label: 'Unpaid Sales Invoices Widget',
    path: '/services/web/codbex-invoices/widgets/unpaid-sales-invoices/index.html',
    lazyLoad: true,
    autoFocusTab: false,
    perspectiveId: 'salesinvoice',
    size: 'small'
};
if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}