const navigationData = {
    id: 'purchase-invoices-navigation',
    label: "Purchase Invoices",
    view: "purchase-invoice",
    group: "purchasing",
    orderNumber: 1000,
    lazyLoad: true,
    link: "/services/web/codbex-invoices/gen/codbex-invoices/ui/purchaseinvoice/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
