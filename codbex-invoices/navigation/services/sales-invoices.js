const navigationData = {
    id: 'sales-invoice-navigation',
    label: "Sales invoices",
    view: "sales-invoices",
    group: "sales",
    orderNumber: 1000
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }