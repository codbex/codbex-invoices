const viewData = {
    id: 'debit-note-generate',
    label: 'Generate Debit Note',
    link: '/services/web/codbex-invoices/events/generate/DebitNote/generate-debit-note.html',
    perspective: 'purchaseinvoice',
    view: 'PurchaseInvoice',
    type: 'entity',
    order: 9
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}