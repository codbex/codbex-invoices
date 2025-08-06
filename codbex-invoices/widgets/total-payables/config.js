const viewData = {
    id: 'total-payables-widget',
    label: 'Total Payables Widget',
    path: '/services/web/codbex-invoices/widgets/total-payables/index.html',
    lazyLoad: true,
    autoFocusTab: false,
    perspectiveId: 'PurchaseInvoice',
    size: 'medium'
};
if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}