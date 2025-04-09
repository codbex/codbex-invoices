const viewData = {
    id: 'total-sales-widget',
    label: 'Total Sales Widget',
    path: '/services/web/codbex-invoices/widgets/total-sales/index.html',
    lazyLoad: true,
    autoFocusTab: false,
    perspectiveId: 'salesinvoice',
    size: 'small'
};
if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}