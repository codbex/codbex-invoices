const navigationData = {
    id: 'Debit-notes-navigation',
    label: "Debit Notes",
    view: "debitit-notes",
    group: "sales",
    orderNumber: 1000,
    lazyLoad: true,
    link: "/services/web/codbex-invoices/gen/codbex-invoices/ui/DebitNote/index.html?embedded"
};

function getNavigation() {
    return navigationData;
}

if (typeof exports !== 'undefined') {
    exports.getNavigation = getNavigation;
}

export { getNavigation }
