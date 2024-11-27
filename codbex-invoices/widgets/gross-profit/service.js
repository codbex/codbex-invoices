const widgetData = {
    id: 'gross-profit-widget',
    label: 'Gross Profit Widget',
    link: '/services/web/codbex-invoices/widgets/gross-profit/index.html',
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