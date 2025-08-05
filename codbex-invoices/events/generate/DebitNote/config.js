const viewData = {
    id: 'debit-note-generate',
    label: 'Generate Debit Note',
    path: '/services/web/codbex-invoices/events/generate/DebitNote/index.html',
    translation: {
        key: 'codbex-invoices:t.DEBITNOTE',
    },
    perspective: 'SalesInvoice',
    view: 'SalesInvoice',
    type: 'entity',
    order: 9
};


if (typeof exports !== 'undefined') {
    exports.getView = () => viewData;
}
