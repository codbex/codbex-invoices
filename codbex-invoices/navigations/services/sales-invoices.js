const navigationData = {
    id: 'sales-invoices-navigation',
    label: "Sales Invoices",
    view: "sales-invoice",
    group: "sales",
    orderNumber: 1000,
    lazyLoad: true,
    link: "/services/web/codbex-invoices/gen/codbex-invoices/ui/salesinvoice/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
