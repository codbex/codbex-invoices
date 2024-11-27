const widgetData = {
    id: 'unpaid-sales-invoices-widget',
    label: 'Unpaid Sales Invoices Widget',
    link: '/services/web/codbex-invoices/widgets/unpaid-sales-invoices/index.html',
    size: "small"
};

export function getWidget() {
    return widgetData;
}

if (typeof exports !== 'undefined') {
    exports.getWidgets = function () {
        return widgetData;
    }
}