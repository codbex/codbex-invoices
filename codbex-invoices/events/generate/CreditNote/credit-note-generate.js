const viewData = {
    id: 'credit-note-generate',
    label: 'Generate Credit Note',
    link: '/services/web/codbex-invoices/events/generate/CreditNote/generate-credit-note.html',
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