const viewData = {
    id: 'credit-note-generate',
    label: 'Generate Credit Note',
    path: '/services/web/codbex-invoices/events/generate/CreditNote/generate-credit-note.html',
    lazyLoad: false,
    autoFocusTab: false,
    maxWidth: '320px',
    maxHeight: '182px',
    perspective: 'salesinvoice',
    view: 'SalesInvoice',
    type: 'entity',
    order: 9
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}