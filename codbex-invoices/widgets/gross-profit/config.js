const viewData = {
    id: 'gross-profit-widget',
    label: 'Gross Profit Widget',
    path: '/services/web/codbex-invoices/widgets/gross-profit/index.html',
    lazyLoad: true,
    autoFocusTab: false,
    perspectiveId: 'PurchaseInvoice',
    size: 'small'
};
if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}