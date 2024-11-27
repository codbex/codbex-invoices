const navigationData = {
    id: 'purchase-invoices-navigation',
    label: "Purchase Invoices",
    group: "purchasing",
    order: 1000,
    link: "/services/web/codbex-invoices/gen/codbex-invoices/ui/purchaseinvoice/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
