const navigationData = {
    id: 'credit-notes-navigation',
    label: "Credit Notes",
    view: "credit-notes",
    group: "sales",
    orderNumber: 1000,
    lazyLoad: true,
    link: "/services/web/codbex-invoices/gen/codbex-invoices/ui/CreditNote/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
