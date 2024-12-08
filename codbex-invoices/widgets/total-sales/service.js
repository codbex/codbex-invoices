const widgetData = {
    id: 'total-sales-widget',
    label: 'Total Sales Widget',
    link: '/services/web/codbex-invoices/widgets/total-sales/index.html',
    redirectViewId: 'sales-invoice-navigation',
    size: "small"
};

export function getWidget() {
    return widgetData;
}

if (typeof exports !== 'undefined') {
    exports.getWidget = function () {
        return widgetData;
    }
}