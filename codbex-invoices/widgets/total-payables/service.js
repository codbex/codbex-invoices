const widgetData = {
    id: 'total-payables-widget',
    label: 'Total Payables Widget',
    link: '/services/web/codbex-invoices/widgets/total-payables/index.html',
    redirectViewId: 'purchase-invoice-navigation',
    size: "medium"
};

export function getWidget() {
    return widgetData;
}

if (typeof exports !== 'undefined') {
    exports.getWidget = function () {
        return widgetData;
    }
}