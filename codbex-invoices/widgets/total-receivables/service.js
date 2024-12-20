const widgetData = {
    id: 'total-receivables-widget',
    label: 'Total Receivables Widget',
    link: '/services/web/codbex-invoices/widgets/total-receivables/index.html',
    redirectViewId: 'sales-invoice-navigation',
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