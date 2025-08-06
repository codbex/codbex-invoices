const viewData = {
    id: 'credit-note-generate',
    label: 'Generate Credit Note',
    path: '/services/web/codbex-invoices/events/generate/CreditNote/index.html',
    perspective: 'SalesInvoice',
    view: 'SalesInvoice',
    translation: {
        key: 'codbex-invoices:t.CREDITNOTE',
    },
    lazyLoad: true,
    autoFocusTab: false,
    type: 'entity',
    order: 9
};

if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}