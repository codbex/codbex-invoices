const widgetData = {
    id: 'total-sales-widget',
    label: 'Total Sales Widget',
    link: '/services/web/codbex-invoices/widgets/subviews/total-sales.html',
    lazyLoad: true,
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