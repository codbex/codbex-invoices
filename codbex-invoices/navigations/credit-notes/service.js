const navigationData = {
    id: 'credit-notes-navigation',
    label: "Credit Notes",
    group: "sales",
    order: 500,
    link: "/services/web/codbex-invoices/gen/codbex-invoices/ui/CreditNote/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
