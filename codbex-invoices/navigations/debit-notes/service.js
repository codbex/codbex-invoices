const navigationData = {
    id: 'debit-notes-navigation',
    label: "Debit Notes",
    group: "sales",
    orderNumber: 1000,
    link: "/services/web/codbex-invoices/gen/codbex-invoices/ui/DebitNote/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
