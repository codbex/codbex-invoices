const navigationData = {
    id: 'purchase-invoices-navigation',
    label: "Purchase Invoices",
    view: "purchase-invoices",
    group: "purchasing",
    orderNumber: 1100
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }