const viewData = {
    id: 'debit-note-generate',
    label: 'Generate Debit Note',
    link: '/services/web/codbex-invoices/events/generate/DebitNote/generate-debit-note.html',
    lazyLoad: false,
    autoFocusTab: false,
    maxWidth: '320px',
    maxHeight: '182px',
    perspective: 'salesinvoice',
    view: 'SalesInvoice',
    type: 'entity',
    order: 10
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}