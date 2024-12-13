const navigationData = {
    id: 'sales-invoices-navigation',
    label: "Sales Invoices",
    group: "sales",
    order: 200,
    link: "/services/web/codbex-invoices/gen/codbex-invoices/ui/salesinvoice/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
